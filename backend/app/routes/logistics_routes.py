from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from backend.app.database import get_orders_col, get_deliveries_col
from backend.app.auth import get_required_user
from backend.app.ml.route_optimizer import optimize_route

router = APIRouter(prefix="/deliveries", tags=["Logistics & Fleet Management"])

@router.get("/active-fleet")
def get_active_deliveries(user: dict = Depends(get_required_user)):
    orders_col = get_orders_col()
    orders = orders_col.find({"status": {"$in": ["Confirmed", "Picked Up", "In Transit"]}})
    
    fleet = []
    for o in orders:
        fleet.append({
            "order_id": o["id"],
            "buyer_name": o.get("buyer_name"),
            "delivery_address": o.get("delivery_address"),
            "items_count": len(o.get("items", [])),
            "status": o.get("status"),
            "logistics_info": o.get("logistics_info"),
            "created_at": o.get("created_at")
        })
    return fleet

@router.get("/track/{order_id}")
def track_delivery(order_id: str):
    orders_col = get_orders_col()
    order = orders_col.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    logistics = order.get("logistics_info", {})
    if not logistics:
        # Generate on-the-fly if missing
        calc = optimize_route(
            origin={"name": "Farmer Collection Hub", "lat": 22.8953, "lng": 88.4026},
            destination={"name": order.get("delivery_address", "Buyer Point"), "lat": 22.5726, "lng": 88.3639}
        )
        logistics = {
            "partner_name": "GreenFleet Express",
            "vehicle_number": "WB-02-AG-8821",
            "distance_km": calc["route_summary"]["total_distance_km"],
            "duration_minutes": calc["route_summary"]["estimated_duration_minutes"],
            "estimated_cost": calc["route_summary"]["estimated_cost_inr"],
            "eta": f"{calc['route_summary']['estimated_duration_minutes']} mins",
            "stops": calc["stops"],
            "waypoints": calc["waypoints"]
        }

    return {
        "order_id": order["id"],
        "status": order.get("status", "In Transit"),
        "payment_status": order.get("payment_status"),
        "delivery_address": order.get("delivery_address"),
        "buyer_name": order.get("buyer_name"),
        "items": order.get("items", []),
        "logistics": logistics,
        "telemetry": {
            "vehicle_temp_celsius": 4.1,
            "vehicle_speed_kmh": 36.5,
            "battery_and_fuel": "88%",
            "driver_contact": "+91 94331 77650",
            "driver_name": "Rajesh Kumar (Partner #402)"
        }
    }
