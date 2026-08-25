import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import settings
from backend.app.seed_data import seed_database
from backend.app.database import get_users_col
from backend.app.routes import (
    auth_routes,
    product_routes,
    order_routes,
    ai_routes,
    logistics_routes,
    admin_routes,
    notification_routes
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-seed database if empty
    users_col = get_users_col()
    if users_col.count_documents() == 0:
        print("🌱 Initializing AgriLink AI database with initial demo data...")
        seed_database()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AI-Powered Farmer-to-Market Digital Marketplace Platform (FastAPI + React + AI/ML)",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_routes.router, prefix=settings.API_V1_STR)
app.include_router(product_routes.router, prefix=settings.API_V1_STR)
app.include_router(order_routes.router, prefix=settings.API_V1_STR)
app.include_router(ai_routes.router, prefix=settings.API_V1_STR)
app.include_router(logistics_routes.router, prefix=settings.API_V1_STR)
app.include_router(admin_routes.router, prefix=settings.API_V1_STR)
app.include_router(notification_routes.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "Online & Healthy",
        "description": "Connecting Farmers directly with Consumers, Retailers, and Bulk Buyers with AI-Powered Demand, Fair Pricing, and Smart Route Optimization.",
        "api_docs": "/docs",
        "demo_mode": True
    }

@app.post("/api/reset-seed-data")
def reset_seed_data():
    seed_database()
    return {"message": "Database successfully reset and seeded with fresh realistic data."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
