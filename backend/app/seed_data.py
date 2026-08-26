from datetime import datetime, timedelta
from backend.app.auth import get_password_hash
from backend.app.database import (
    get_users_col,
    get_products_col,
    get_orders_col,
    get_deliveries_col,
    get_reviews_col,
    get_notifications_col,
    get_disputes_col
)

def _clear_col(col):
    """Safely clear a collection regardless of backend (Local or MongoDB)."""
    if hasattr(col, 'data'):
        # LocalCollection — wipe list directly and save
        col.data = []
        col._save()
    else:
        # MongoCollectionWrapper — delete all documents
        try:
            col.raw_col.delete_many({})
        except Exception:
            pass

def seed_database():
    users_col = get_users_col()
    products_col = get_products_col()
    orders_col = get_orders_col()
    deliveries_col = get_deliveries_col()
    reviews_col = get_reviews_col()
    notifications_col = get_notifications_col()
    disputes_col = get_disputes_col()

    # Clear old records to guarantee fresh state
    _clear_col(users_col)
    _clear_col(products_col)
    _clear_col(orders_col)
    _clear_col(deliveries_col)
    _clear_col(reviews_col)
    _clear_col(notifications_col)
    _clear_col(disputes_col)

    # 1. Seed Users
    farmer_user = {
        "id": "usr_farmer_01",
        "name": "Ramesh Sharma",
        "email": "farmer@agrilink.ai",
        "password": get_password_hash("farmer123"),
        "role": "farmer",
        "phone": "+91 98310 44521",
        "location": "Hooghly, West Bengal",
        "fpo_name": "Hooghly Organic Farmer Cooperative (HOFC)",
        "coordinates": {"lat": 22.8953, "lng": 88.4026},
        "avatar": "https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80",
        "created_at": (datetime.now() - timedelta(days=120)).isoformat()
    }
    
    buyer_user = {
        "id": "usr_buyer_01",
        "name": "Pooja Verma",
        "email": "buyer@agrilink.ai",
        "password": get_password_hash("buyer123"),
        "role": "buyer",
        "phone": "+91 98201 88390",
        "location": "Kolkata, West Bengal",
        "fpo_name": "FreshBites Kitchens & Retail",
        "coordinates": {"lat": 22.5726, "lng": 88.3639},
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        "created_at": (datetime.now() - timedelta(days=90)).isoformat()
    }

    admin_user = {
        "id": "usr_admin_01",
        "name": "AgriLink System Administrator",
        "email": "admin@agrilink.ai",
        "password": get_password_hash("admin123"),
        "role": "admin",
        "phone": "+91 99000 11223",
        "location": "National Operations Center, Delhi NCR",
        "fpo_name": "AgriLink Platform Core",
        "coordinates": {"lat": 28.6139, "lng": 77.2090},
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        "created_at": (datetime.now() - timedelta(days=365)).isoformat()
    }

    logistics_user = {
        "id": "usr_logistics_01",
        "name": "GreenFleet Express Logistics",
        "email": "logistics@agrilink.ai",
        "password": get_password_hash("logistics123"),
        "role": "logistics",
        "phone": "+91 94331 77650",
        "location": "Eastern Agri-Logistics Hub, Howrah",
        "fpo_name": "GreenFleet Cold Chains",
        "coordinates": {"lat": 22.6845, "lng": 88.3120},
        "avatar": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
        "created_at": (datetime.now() - timedelta(days=60)).isoformat()
    }

    users_col.insert_one(farmer_user)
    users_col.insert_one(buyer_user)
    users_col.insert_one(admin_user)
    users_col.insert_one(logistics_user)

    # 2. Seed Products
    today_str = datetime.now().strftime("%Y-%m-%d")
    yesterday_str = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
    two_days_ago = (datetime.now() - timedelta(days=2)).strftime("%Y-%m-%d")

    products = [
        {
            "id": "prod_tomato_01",
            "name": "Fresh Hybrid Red Tomatoes",
            "category": "Vegetables",
            "variety": "Avinash-2 High Lycopene",
            "quantity_kg": 1000.0,
            "price_per_kg": 28.0,
            "expected_price": 25.0,
            "quality_grade": "Grade A",
            "harvest_date": today_str,
            "location": "Hooghly, West Bengal",
            "coordinates": {"lat": 22.8953, "lng": 88.4026},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Ramesh Sharma (Hooghly FPO)",
            "farmer_phone": "+91 98310 44521",
            "farmer_location": "Hooghly, West Bengal",
            "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
            "description": "Farm-fresh, crisp, naturally vine-ripened tomatoes harvested early morning. Packed with rich red pigment, low acidity, and extended 8-day shelf life. Ideal for restaurants, retail chains, and household cooking.",
            "organic_certified": True,
            "shelf_life_days": 8,
            "min_order_kg": 10.0,
            "rating": 4.9,
            "review_count": 28,
            "is_available": True,
            "ai_demand_score": "HIGH",
            "ai_predicted_growth": 18.0,
            "created_at": (datetime.now() - timedelta(days=2)).isoformat()
        },
        {
            "id": "prod_potato_02",
            "name": "Jyoti Farm Gold Potatoes",
            "category": "Vegetables",
            "variety": "Kufri Jyoti Starch Rich",
            "quantity_kg": 2500.0,
            "price_per_kg": 22.0,
            "expected_price": 20.0,
            "quality_grade": "Grade A",
            "harvest_date": yesterday_str,
            "location": "Chandannagar, West Bengal",
            "coordinates": {"lat": 22.8671, "lng": 88.3674},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Ramesh Sharma (Hooghly FPO)",
            "farmer_phone": "+91 98310 44521",
            "farmer_location": "Hooghly, West Bengal",
            "image_url": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop&q=80",
            "description": "Uniform sized, sand-washed Jyoti potatoes. Firm texture, low moisture, superior cooking quality for curries and snacks.",
            "organic_certified": False,
            "shelf_life_days": 30,
            "min_order_kg": 25.0,
            "rating": 4.7,
            "review_count": 19,
            "is_available": True,
            "ai_demand_score": "VERY HIGH",
            "ai_predicted_growth": 25.0,
            "created_at": (datetime.now() - timedelta(days=5)).isoformat()
        },
        {
            "id": "prod_mango_03",
            "name": "Ratnagiri Alphonso GI Mangoes",
            "category": "Fruits",
            "variety": "Hapus GI-Tagged",
            "quantity_kg": 650.0,
            "price_per_kg": 95.0,
            "expected_price": 85.0,
            "quality_grade": "Organic Premium",
            "harvest_date": today_str,
            "location": "Ratnagiri, Maharashtra",
            "coordinates": {"lat": 16.9902, "lng": 73.3120},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Maharashtra Sahyadri FPO",
            "farmer_phone": "+91 98220 11994",
            "farmer_location": "Ratnagiri, Maharashtra",
            "image_url": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80",
            "description": "100% naturally tree-ripened, chemical-free GI tagged Alphonso mangoes with rich aroma, golden saffron pulp, and exquisite sweetness.",
            "organic_certified": True,
            "shelf_life_days": 6,
            "min_order_kg": 5.0,
            "rating": 5.0,
            "review_count": 42,
            "is_available": True,
            "ai_demand_score": "HIGH",
            "ai_predicted_growth": 32.0,
            "created_at": (datetime.now() - timedelta(days=1)).isoformat()
        },
        {
            "id": "prod_rice_04",
            "name": "Royal Traditional Basmati Rice",
            "category": "Rice",
            "variety": "Pusa 1121 Extra Long Grain",
            "quantity_kg": 4000.0,
            "price_per_kg": 85.0,
            "expected_price": 78.0,
            "quality_grade": "Grade A",
            "harvest_date": two_days_ago,
            "location": "Karnal, Haryana",
            "coordinates": {"lat": 29.6857, "lng": 76.9905},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Punjab Organic Growers Union",
            "farmer_phone": "+91 98140 22319",
            "farmer_location": "Karnal, Haryana",
            "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&auto=format&fit=crop&q=80",
            "description": "Aged 18 months for non-sticky, long aromatic grains that elongate up to 2.5x after boiling. Certified pesticide residue-free.",
            "organic_certified": True,
            "shelf_life_days": 365,
            "min_order_kg": 20.0,
            "rating": 4.9,
            "review_count": 31,
            "is_available": True,
            "ai_demand_score": "MODERATE",
            "ai_predicted_growth": 12.0,
            "created_at": (datetime.now() - timedelta(days=10)).isoformat()
        },
        {
            "id": "prod_capsicum_05",
            "name": "Crisp Green Bell Capsicum",
            "category": "Vegetables",
            "variety": "Indra Polyhouse Green",
            "quantity_kg": 750.0,
            "price_per_kg": 48.0,
            "expected_price": 42.0,
            "quality_grade": "Grade A",
            "harvest_date": today_str,
            "location": "Nashik, Maharashtra",
            "coordinates": {"lat": 19.9975, "lng": 73.7898},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Nashik Agro Producer Co.",
            "farmer_phone": "+91 94231 66520",
            "farmer_location": "Nashik, Maharashtra",
            "image_url": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop&q=80",
            "description": "Thick-walled, crunchy green bell peppers harvested from automated polyhouses. Clean, glossy skin with zero blemishes.",
            "organic_certified": True,
            "shelf_life_days": 10,
            "min_order_kg": 10.0,
            "rating": 4.8,
            "review_count": 14,
            "is_available": True,
            "ai_demand_score": "HIGH",
            "ai_predicted_growth": 14.5,
            "created_at": (datetime.now() - timedelta(days=3)).isoformat()
        },
        {
            "id": "prod_milk_06",
            "name": "A2 Desi Gir Cow Fresh Milk",
            "category": "Dairy",
            "variety": "Pure A2 Beta-Casein Raw Farm Milk",
            "quantity_kg": 350.0,
            "price_per_kg": 65.0,
            "expected_price": 60.0,
            "quality_grade": "Organic Premium",
            "harvest_date": today_str,
            "location": "Kolkata Suburbs, West Bengal",
            "coordinates": {"lat": 22.7210, "lng": 88.4812},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Amrit Dairy Farmer Producer Org",
            "farmer_phone": "+91 98300 99881",
            "farmer_location": "Kolkata, West Bengal",
            "image_url": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80",
            "description": "Cold-chain preserved, non-homogenized natural A2 cow milk from grass-fed indigenous Gir cattle. Glass bottle chilled transport.",
            "organic_certified": True,
            "shelf_life_days": 3,
            "min_order_kg": 5.0,
            "rating": 5.0,
            "review_count": 56,
            "is_available": True,
            "ai_demand_score": "HIGH",
            "ai_predicted_growth": 21.0,
            "created_at": (datetime.now() - timedelta(days=1)).isoformat()
        },
        {
            "id": "prod_turmeric_07",
            "name": "High-Curcumin Erode Turmeric",
            "category": "Spices",
            "variety": "Salem Erode GI Finger 5.2% Curcumin",
            "quantity_kg": 1200.0,
            "price_per_kg": 175.0,
            "expected_price": 160.0,
            "quality_grade": "Organic Premium",
            "harvest_date": two_days_ago,
            "location": "Erode, Tamil Nadu",
            "coordinates": {"lat": 11.3410, "lng": 77.7172},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Erode Spice Collective",
            "farmer_phone": "+91 94432 11880",
            "farmer_location": "Erode, Tamil Nadu",
            "image_url": "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80",
            "description": "Solar-dried whole turmeric fingers with lab-tested 5.2% natural Curcumin content. Deep golden-yellow hue, intense medicinal aroma.",
            "organic_certified": True,
            "shelf_life_days": 730,
            "min_order_kg": 10.0,
            "rating": 4.9,
            "review_count": 27,
            "is_available": True,
            "ai_demand_score": "HIGH",
            "ai_predicted_growth": 19.5,
            "created_at": (datetime.now() - timedelta(days=15)).isoformat()
        },
        {
            "id": "prod_onion_08",
            "name": "Nashik Pink Nasik Red Onions",
            "category": "Vegetables",
            "variety": "Panchganga Medium Pink",
            "quantity_kg": 4500.0,
            "price_per_kg": 34.0,
            "expected_price": 30.0,
            "quality_grade": "Grade A",
            "harvest_date": yesterday_str,
            "location": "Lasalgaon, Maharashtra",
            "coordinates": {"lat": 20.1472, "lng": 74.2255},
            "farmer_id": "usr_farmer_01",
            "farmer_name": "Maharashtra Onion Growers FPO",
            "farmer_phone": "+91 98233 44556",
            "farmer_location": "Lasalgaon, Maharashtra",
            "image_url": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800&auto=format&fit=crop&q=80",
            "description": "Sun-cured dry outer skin, firm pungency, excellent shelf-life suitable for wholesale kitchens, catering, and retail storage.",
            "organic_certified": False,
            "shelf_life_days": 45,
            "min_order_kg": 50.0,
            "rating": 4.6,
            "review_count": 38,
            "is_available": True,
            "ai_demand_score": "MODERATE",
            "ai_predicted_growth": 8.5,
            "created_at": (datetime.now() - timedelta(days=7)).isoformat()
        }
    ]

    for p in products:
        products_col.insert_one(p)

    # 3. Seed Existing Orders
    sample_order = {
        "id": "ord_demo_101",
        "buyer_id": "usr_buyer_01",
        "buyer_name": "Pooja Verma (FreshBites Kitchens)",
        "buyer_phone": "+91 98201 88390",
        "items": [
            {
                "product_id": "prod_tomato_01",
                "product_name": "Fresh Hybrid Red Tomatoes",
                "farmer_id": "usr_farmer_01",
                "farmer_name": "Ramesh Sharma (Hooghly FPO)",
                "price_per_kg": 28.0,
                "quantity_kg": 500.0,
                "item_total": 14000.0,
                "image_url": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80",
                "farmer_location": "Hooghly, West Bengal"
            }
        ],
        "total_amount": 14000.0,
        "status": "In Transit",
        "payment_status": "Completed (Escrow Secured)",
        "payment_method": "Online UPI / AgriEscrow",
        "delivery_address": "FreshBites Kitchens Central Processing Hub, Salt Lake Sector V, Kolkata, WB - 700091",
        "delivery_coordinates": {"lat": 22.5726, "lng": 88.3639},
        "logistics_info": {
            "partner_name": "GreenFleet Cold Logistics",
            "driver_name": "Rajesh Kumar",
            "vehicle_number": "WB-02-AG-8821",
            "vehicle_type": "Refrigerated Mini-Truck (Temp 4.2°C)",
            "distance_km": 24.0,
            "duration_minutes": 52,
            "estimated_cost": 420.0,
            "eta": "45 mins",
            "current_step": "En Route to Salt Lake Hub",
            "route_status": "Optimized Multi-Stop Route Active"
        },
        "created_at": (datetime.now() - timedelta(minutes=40)).isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    orders_col.insert_one(sample_order)

    # 4. Seed Notifications
    sample_notifications = [
        {
            "id": "notif_01",
            "user_id": "usr_farmer_01",
            "title": "⚠️ Potato Demand Alert",
            "message": "Potato demand is expected to increase by 25% next week due to upcoming festive restocking.",
            "type": "demand_alert",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(hours=3)).isoformat()
        },
        {
            "id": "notif_02",
            "user_id": "usr_farmer_01",
            "title": "🎉 New High-Volume Order Received!",
            "message": "FreshBites Kitchens placed an order for 500 kg Fresh Tomatoes (₹14,000). Route optimization active.",
            "type": "order",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(minutes=40)).isoformat()
        },
        {
            "id": "notif_03",
            "user_id": "usr_farmer_01",
            "title": "💡 AI Price Recommendation Update",
            "message": "Recommended selling price for Grade A Tomato updated to ₹28/kg (+12% profit boost).",
            "type": "price_alert",
            "is_read": True,
            "created_at": (datetime.now() - timedelta(days=1)).isoformat()
        },
        {
            "id": "notif_04",
            "user_id": "usr_buyer_01",
            "title": "🚚 Dispatch Alert",
            "message": "Your order #ord_demo_101 is picked up and currently In Transit. ETA: 45 mins.",
            "type": "delivery",
            "is_read": False,
            "created_at": (datetime.now() - timedelta(minutes=25)).isoformat()
        }
    ]
    for n in sample_notifications:
        notifications_col.insert_one(n)

    # 5. Seed Reviews
    sample_reviews = [
        {
            "id": "rev_01",
            "product_id": "prod_tomato_01",
            "order_id": "ord_demo_101",
            "buyer_id": "usr_buyer_01",
            "buyer_name": "Pooja Verma (FreshBites)",
            "rating": 5,
            "comment": "Exceptional farm freshness! Direct procurement reduced our cost by 18% and the quality was far better than local mandi supplies.",
            "created_at": (datetime.now() - timedelta(days=3)).isoformat()
        },
        {
            "id": "rev_02",
            "product_id": "prod_mango_03",
            "order_id": "ord_demo_102",
            "buyer_id": "usr_buyer_01",
            "buyer_name": "Sunil Chawla",
            "rating": 5,
            "comment": "Real authentic Ratnagiri Alphonso mangoes. Perfect packaging and swift temperature-controlled logistics.",
            "created_at": (datetime.now() - timedelta(days=5)).isoformat()
        }
    ]
    for r in sample_reviews:
        reviews_col.insert_one(r)

    print(" Database seeded successfully with realistic agricultural produce, demo users, orders, and AI metrics!")

if __name__ == "__main__":
    seed_database()
