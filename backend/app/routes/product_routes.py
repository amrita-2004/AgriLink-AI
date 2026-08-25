from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from backend.app.database import get_products_col, get_reviews_col
from backend.app.schemas import ProductCreate, ProductUpdate, ProductOut, ReviewCreate
from backend.app.auth import get_required_user, require_role
from backend.app.ml.demand_forecasting import predict_demand
from backend.app.ml.price_recommender import recommend_price

router = APIRouter(prefix="/products", tags=["Products & Marketplace"])

@router.get("", response_model=List[ProductOut])
def list_products(
    category: Optional[str] = None,
    search: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    quality_grade: Optional[str] = None,
    organic_only: Optional[bool] = None,
    sort_by: Optional[str] = None,  # "price_asc", "price_desc", "rating", "newest", "demand"
):
    products_col = get_products_col()
    all_products = products_col.find({"is_available": True})
    
    filtered = []
    for p in all_products:
        if category and category.lower() != "all" and p.get("category", "").lower() != category.lower():
            continue
        if search:
            s = search.lower()
            if (s not in p.get("name", "").lower() and 
                s not in p.get("variety", "").lower() and 
                s not in p.get("location", "").lower() and 
                s not in p.get("category", "").lower() and
                s not in p.get("farmer_name", "").lower()):
                continue
        if location and location.lower() != "all" and location.lower() not in p.get("location", "").lower():
            continue
        if min_price is not None and p.get("price_per_kg", 0) < min_price:
            continue
        if max_price is not None and p.get("price_per_kg", 0) > max_price:
            continue
        if quality_grade and quality_grade.lower() != "all" and p.get("quality_grade", "").lower() != quality_grade.lower():
            continue
        if organic_only is True and not p.get("organic_certified", False):
            continue
        filtered.append(p)

    # Sorting
    if sort_by == "price_asc":
        filtered.sort(key=lambda x: x.get("price_per_kg", 0))
    elif sort_by == "price_desc":
        filtered.sort(key=lambda x: x.get("price_per_kg", 0), reverse=True)
    elif sort_by == "rating":
        filtered.sort(key=lambda x: x.get("rating", 0), reverse=True)
    elif sort_by == "newest":
        filtered.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    elif sort_by == "demand":
        priority = {"VERY HIGH": 4, "HIGH": 3, "MODERATE": 2, "LOW": 1}
        filtered.sort(key=lambda x: priority.get(x.get("ai_demand_score", "MODERATE"), 0), reverse=True)

    return [ProductOut(**p) for p in filtered]

@router.get("/farmer/my-inventory", response_model=List[ProductOut])
def get_my_inventory(user: dict = Depends(get_required_user)):
    products_col = get_products_col()
    products = products_col.find({"farmer_id": user["id"]})
    # If farmer has no products, return all products seeded for demo farmer
    if not products and user.get("role") == "farmer":
        products = products_col.find({"farmer_id": "usr_farmer_01"})
    return [ProductOut(**p) for p in products]

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str):
    products_col = get_products_col()
    p = products_col.find_one({"id": product_id})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    return ProductOut(**p)

@router.post("", response_model=ProductOut)
def create_product(
    product_in: ProductCreate,
    user: dict = Depends(require_role(["farmer", "admin"]))
):
    products_col = get_products_col()
    prod_dict = product_in.model_dump()
    
    # Associate farmer info
    prod_dict["farmer_id"] = user["id"]
    prod_dict["farmer_name"] = user.get("fpo_name") or user.get("name")
    prod_dict["farmer_phone"] = user.get("phone")
    prod_dict["farmer_location"] = user.get("location") or prod_dict.get("location")
    prod_dict["rating"] = 5.0
    prod_dict["review_count"] = 0
    prod_dict["is_available"] = True

    # Run AI evaluation automatically on upload
    forecast = predict_demand(
        product_name=prod_dict["name"],
        category=prod_dict["category"],
        location=prod_dict["location"]
    )
    prod_dict["ai_demand_score"] = forecast["demand_level"]
    prod_dict["ai_predicted_growth"] = forecast["predicted_growth_percent"]

    # Image fallback if not provided
    if not prod_dict.get("image_url"):
        cat_images = {
            "Vegetables": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
            "Fruits": "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80",
            "Rice": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
            "Wheat": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&auto=format&fit=crop&q=80",
            "Pulses": "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=800&auto=format&fit=crop&q=80",
            "Spices": "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&auto=format&fit=crop&q=80",
            "Dairy": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
        }
        prod_dict["image_url"] = cat_images.get(prod_dict["category"], "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80")

    created = products_col.insert_one(prod_dict)
    return ProductOut(**created)

@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: str,
    update_in: ProductUpdate,
    user: dict = Depends(require_role(["farmer", "admin"]))
):
    products_col = get_products_col()
    p = products_col.find_one({"id": product_id})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Allow admin or owning farmer
    if user.get("role") != "admin" and p.get("farmer_id") != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to edit this product")

    update_data = {k: v for k, v in update_in.model_dump().items() if v is not None}
    products_col.update_one({"id": product_id}, {"$set": update_data})
    
    updated = products_col.find_one({"id": product_id})
    return ProductOut(**updated)

@router.delete("/{product_id}")
def delete_product(
    product_id: str,
    user: dict = Depends(require_role(["farmer", "admin"]))
):
    products_col = get_products_col()
    p = products_col.find_one({"id": product_id})
    if not p:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if user.get("role") != "admin" and p.get("farmer_id") != user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")

    products_col.delete_one({"id": product_id})
    return {"message": "Product removed successfully", "id": product_id}

@router.get("/{product_id}/reviews")
def get_product_reviews(product_id: str):
    reviews_col = get_reviews_col()
    return reviews_col.find({"product_id": product_id})

@router.post("/{product_id}/reviews")
def add_product_review(
    product_id: str,
    review_in: ReviewCreate,
    user: dict = Depends(get_required_user)
):
    reviews_col = get_reviews_col()
    products_col = get_products_col()
    
    rev_dict = review_in.model_dump()
    rev_dict["product_id"] = product_id
    rev_dict["buyer_id"] = user["id"]
    rev_dict["buyer_name"] = user["name"]
    created_rev = reviews_col.insert_one(rev_dict)

    # Recalculate average rating
    all_revs = reviews_col.find({"product_id": product_id})
    if all_revs:
        avg_rating = round(sum(r.get("rating", 5) for r in all_revs) / len(all_revs), 1)
        products_col.update_one(
            {"id": product_id},
            {"$set": {"rating": avg_rating, "review_count": len(all_revs)}}
        )

    return created_rev
