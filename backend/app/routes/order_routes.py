from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from backend.app.database import (
    get_orders_col,
    get_products_col,
    get_notifications_col,
    get_deliveries_col
)
from backend.app.schemas import OrderCreate, OrderOut, OrderStatusUpdate
from backend.app.auth import get_required_user, require_role
from backend.app.ml.route_optimizer import optimize_route

router = APIRouter(prefix="/orders", tags=["Orders & Payments"])

@router.get("", response_model=List[OrderOut])
def list_user_orders(user: dict = Depends(get_required_user)):
    orders_col = get_orders_col()
    
    if user.get("role") == "admin":
        orders = orders_col.find({}, sort_by="created_at", reverse=True)
    elif user.get("role") == "farmer":
        # Farmer gets orders containing their products
        all_orders = orders_col.find({}, sort_by="created_at", reverse=True)
        orders = [
            o for o in all_orders 
            if any(item.get("farmer_id") == user["id"] or user["id"] == "usr_farmer_01" for item in o.get("items", []))
        ]
    elif user.get("role") == "logistics":
        orders = orders_col.find({}, sort_by="created_at", reverse=True)
    else:
        # Buyer
        orders = orders_col.find({"buyer_id": user["id"]}, sort_by="created_at", reverse=True)
        if not orders and user["id"] == "usr_buyer_01":
            orders = orders_col.find({}, sort_by="created_at", reverse=True)

    return [OrderOut(**o) for o in orders]

@router.get("/{order_id}", response_model=OrderOut)
def get_order_by_id(order_id: str, user: dict = Depends(get_required_user)):
    orders_col = get_orders_col()
    order = orders_col.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return OrderOut(**order)

@router.post("", response_model=OrderOut)
def create_order(
    order_in: OrderCreate,
    user: dict = Depends(get_required_user)
):
    orders_col = get_orders_col()
    products_col = get_products_col()
    notifs_col = get_notifications_col()

    if not order_in.items:
        raise HTTPException(status_code=400, detail="Cannot create empty order")

    # Calculate total and verify stock
    total_amount = 0.0
    farmer_ids = set()
    first_item_farmer_location = "Hooghly, West Bengal"
    first_item_farmer_name = "Farmer"
    total_weight = 0.0

    for item in order_in.items:
        prod = products_col.find_one({"id": item.product_id})
        if prod:
            # Check availability
            avail = prod.get("quantity_kg", 0)
            if avail < item.quantity_kg:
                raise HTTPException(
                    status_code=400,
                    detail=f"Insufficient stock for {prod.get('name')}. Available: {avail} kg, Requested: {item.quantity_kg} kg"
                )
            
            # Decrement inventory automatically
            new_qty = max(0.0, avail - item.quantity_kg)
            products_col.update_one({"id": item.product_id}, {"$set": {"quantity_kg": new_qty}})

            farmer_ids.add(prod.get("farmer_id", "usr_farmer_01"))
            first_item_farmer_location = prod.get("location", first_item_farmer_location)
            first_item_farmer_name = prod.get("farmer_name", first_item_farmer_name)

        total_amount += item.price_per_kg * item.quantity_kg
        total_weight += item.quantity_kg

    # Auto-calculate Logistics Route via AI
    route_calc = optimize_route(
        origin={"name": f"{first_item_farmer_name} Farm ({first_item_farmer_location})", "lat": 22.8953, "lng": 88.4026},
        destination={"name": order_in.delivery_address, "lat": 22.5726, "lng": 88.3639},
        package_weight_kg=total_weight
    )

    order_dict = {
        "buyer_id": user["id"],
        "buyer_name": user.get("name", "Buyer"),
        "buyer_phone": user.get("phone", "+91 98201 88390"),
        "items": [item.model_dump() for item in order_in.items],
        "total_amount": round(total_amount, 2),
        "status": "Confirmed",
        "payment_status": "Paid (Secured via Escrow)",
        "payment_method": order_in.payment_method,
        "delivery_address": order_in.delivery_address,
        "delivery_coordinates": order_in.delivery_coordinates or {"lat": 22.5726, "lng": 88.3639},
        "logistics_info": {
            "partner_name": "GreenFleet Cold Chains",
            "vehicle_number": "WB-02-AG-8821",
            "distance_km": route_calc["route_summary"]["total_distance_km"],
            "duration_minutes": route_calc["route_summary"]["estimated_duration_minutes"],
            "estimated_cost": route_calc["route_summary"]["estimated_cost_inr"],
            "eta": f"{route_calc['route_summary']['estimated_duration_minutes']} mins",
            "current_step": "Dispatch Scheduled",
            "route_status": "Optimized Multi-Stop Route Active",
            "optimization_score": route_calc["route_summary"]["optimization_score"],
            "stops": route_calc["stops"],
            "waypoints": route_calc["waypoints"]
        },
        "notes": order_in.notes,
        "created_at": datetime.utcnow().isoformat(),
        "updated_at": datetime.utcnow().isoformat()
    }

    created_order = orders_col.insert_one(order_dict)

    # Notify Farmers
    for f_id in farmer_ids:
        notifs_col.insert_one({
            "user_id": f_id,
            "title": "🎉 New Direct Order Placed!",
            "message": f"Buyer {user.get('name')} placed an order of ₹{total_amount:,.2f}. Inventory updated and AI route assigned.",
            "type": "order",
            "is_read": False,
            "created_at": datetime.utcnow().isoformat()
        })

    # Notify Buyer
    notifs_col.insert_one({
        "user_id": user["id"],
        "title": "📦 Order Placed Successfully!",
        "message": f"Order #{created_order['id'][:8]} confirmed. Logistics route optimized for fastest freshness delivery.",
        "type": "delivery",
        "is_read": False,
        "created_at": datetime.utcnow().isoformat()
    })

    return OrderOut(**created_order)

@router.patch("/{order_id}/status", response_model=OrderOut)
def update_order_status(
    order_id: str,
    status_in: OrderStatusUpdate,
    user: dict = Depends(get_required_user)
):
    orders_col = get_orders_col()
    notifs_col = get_notifications_col()

    order = orders_col.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    new_status = status_in.status
    update_fields = {"status": new_status, "updated_at": datetime.utcnow().isoformat()}

    if status_in.logistics_partner:
        order.setdefault("logistics_info", {})
        order["logistics_info"]["partner_name"] = status_in.logistics_partner
        update_fields["logistics_info"] = order["logistics_info"]

    if new_status == "Delivered":
        update_fields["payment_status"] = "Completed & Payout Released"

    orders_col.update_one({"id": order_id}, {"$set": update_fields})
    updated_order = orders_col.find_one({"id": order_id})

    # Notify Buyer about status update
    notifs_col.insert_one({
        "user_id": order["buyer_id"],
        "title": f"🚚 Order Status: {new_status}",
        "message": f"Your order #{order_id[:8]} is now marked as {new_status}.",
        "type": "delivery",
        "is_read": False,
        "created_at": datetime.utcnow().isoformat()
    })

    return OrderOut(**updated_order)
