from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str = "buyer"  # "farmer", "buyer", "admin", "logistics"
    phone: Optional[str] = None
    location: Optional[str] = None
    fpo_name: Optional[str] = None
    coordinates: Optional[Dict[str, float]] = None  # {"lat": 22.5726, "lng": 88.3639}

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: str
    avatar: Optional[str] = None
    created_at: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# Product Schemas
class ProductBase(BaseModel):
    name: str
    category: str  # "Vegetables", "Fruits", "Rice", "Wheat", "Pulses", "Spices", "Dairy", "Other"
    variety: Optional[str] = None
    quantity_kg: float
    price_per_kg: float
    expected_price: Optional[float] = None
    quality_grade: str = "Grade A"  # "Grade A", "Grade B", "Organic Premium"
    harvest_date: str
    location: str
    coordinates: Optional[Dict[str, float]] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    organic_certified: bool = False
    shelf_life_days: int = 7
    min_order_kg: float = 1.0

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    quantity_kg: Optional[float] = None
    price_per_kg: Optional[float] = None
    quality_grade: Optional[str] = None
    description: Optional[str] = None
    is_available: Optional[bool] = None

class ProductOut(ProductBase):
    id: str
    farmer_id: str
    farmer_name: str
    farmer_phone: Optional[str] = None
    farmer_location: Optional[str] = None
    rating: float = 4.8
    review_count: int = 12
    is_available: bool = True
    ai_demand_score: Optional[str] = "HIGH"
    ai_predicted_growth: Optional[float] = 18.0
    created_at: Optional[str] = None

# Order Schemas
class OrderItem(BaseModel):
    product_id: str
    product_name: str
    farmer_id: str
    farmer_name: str
    price_per_kg: float
    quantity_kg: float
    item_total: float
    image_url: Optional[str] = None
    farmer_location: Optional[str] = None

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: str
    delivery_coordinates: Optional[Dict[str, float]] = None
    payment_method: str = "Online Payment"
    notes: Optional[str] = None

class OrderStatusUpdate(BaseModel):
    status: str  # "Pending", "Confirmed", "Picked Up", "In Transit", "Delivered", "Cancelled"
    logistics_partner: Optional[str] = None
    tracking_notes: Optional[str] = None

class OrderOut(BaseModel):
    id: str
    buyer_id: str
    buyer_name: str
    buyer_phone: Optional[str] = None
    items: List[OrderItem]
    total_amount: float
    status: str
    payment_status: str
    payment_method: str
    delivery_address: str
    delivery_coordinates: Optional[Dict[str, float]] = None
    logistics_info: Optional[Dict[str, Any]] = None
    created_at: str
    updated_at: Optional[str] = None

# AI Prediction Schemas
class DemandForecastRequest(BaseModel):
    product_name: str
    category: str
    location: str
    current_month: Optional[int] = None
    season: Optional[str] = None

class PriceRecommendationRequest(BaseModel):
    product_name: str
    category: str
    quantity_kg: float
    location: str
    quality_grade: str = "Grade A"
    expected_price: Optional[float] = None
    harvest_date: Optional[str] = None

class RouteOptimizationRequest(BaseModel):
    origin: Dict[str, Any]  # {"name": "Farmer Farm, Hooghly", "lat": 22.8953, "lng": 88.4026}
    destination: Dict[str, Any]  # {"name": "Buyer Hub, Kolkata", "lat": 22.5726, "lng": 88.3639}
    collection_points: Optional[List[Dict[str, Any]]] = None
    package_weight_kg: Optional[float] = 500.0
    vehicle_type: Optional[str] = "Refrigerated Mini-Truck"

# Review Schema
class ReviewCreate(BaseModel):
    product_id: str
    order_id: str
    rating: int = Field(ge=1, le=5)
    comment: str

# Notification Schema
class NotificationOut(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: str  # "order", "demand_alert", "price_alert", "delivery", "system"
    is_read: bool = False
    created_at: str
