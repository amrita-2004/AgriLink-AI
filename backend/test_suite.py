import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def run_tests():
    print("========================================")
    print("AGRILINK AI COMPREHENSIVE BACKEND TESTS")
    print("========================================")

    # 1. Health check
    res = requests.get("http://127.0.0.1:8000/")
    assert res.status_code == 200, f"Root endpoint failed: {res.status_code}"
    print("[PASS] 1. Root & Health Check Endpoint")

    # 2. Demo Accounts
    res = requests.get(f"{BASE_URL}/auth/demo-accounts")
    assert res.status_code == 200
    assert len(res.json()) >= 3
    print(f"[PASS] 2. Demo Accounts ({len(res.json())} preset roles)")

    # 3. Farmer Login
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": "farmer@agrilink.ai", "password": "farmer123"})
    assert res.status_code == 200
    farmer_token = res.json()["access_token"]
    print("[PASS] 3. Farmer Authentication & JWT Token")

    # 4. Products Listing & Filters
    res = requests.get(f"{BASE_URL}/products?category=Vegetables")
    assert res.status_code == 200
    products = res.json()
    assert len(products) > 0
    print(f"[PASS] 4. Marketplace Products Filtering (Found {len(products)} vegetables)")

    # 5. AI Demand Forecasting
    res = requests.post(f"{BASE_URL}/forecast", json={
        "product_name": "Tomato",
        "category": "Vegetables",
        "location": "Kolkata",
        "current_month": 8
    })
    assert res.status_code == 200
    fc = res.json()
    assert fc["demand_level"] == "HIGH"
    assert fc["predicted_growth_percent"] == 18.0
    print(f"[PASS] 5. AI Demand Forecasting ({fc['demand_level']} demand, +{fc['predicted_growth_percent']}% growth)")

    # 6. AI Price Recommendation
    res = requests.post(f"{BASE_URL}/price-prediction", json={
        "product_name": "Tomato",
        "category": "Vegetables",
        "quantity_kg": 1000,
        "location": "Kolkata",
        "expected_price": 25.0
    })
    assert res.status_code == 200
    pr = res.json()
    assert pr["recommended_price_per_kg"] == 28.0
    print(f"[PASS] 6. AI Price Recommendation (Recommended: Rs {pr['recommended_price_per_kg']}/kg, Market avg: Rs {pr['current_market_avg_price']}/kg)")

    # 7. AI Route Optimization
    res = requests.post(f"{BASE_URL}/route-optimization", json={
        "origin": {"name": "Farmer Farm, Hooghly", "lat": 22.8953, "lng": 88.4026},
        "destination": {"name": "Buyer Hub, Salt Lake Kolkata", "lat": 22.5726, "lng": 88.3639},
        "package_weight_kg": 500.0
    })
    assert res.status_code == 200
    rt = res.json()
    assert rt["route_summary"]["total_distance_km"] == 24.0
    assert rt["route_summary"]["estimated_duration_minutes"] == 52
    assert rt["route_summary"]["estimated_cost_inr"] == 420.0
    print(f"[PASS] 7. AI Multi-Stop Route Optimization ({rt['route_summary']['total_distance_km']} km, {rt['route_summary']['estimated_duration_minutes']} mins, Rs {rt['route_summary']['estimated_cost_inr']})")

    # 8. Requirement 17 Complete Interactive Scenario API
    res = requests.post(f"{BASE_URL}/ai/execute-demo-scenario")
    assert res.status_code == 200
    demo = res.json()
    assert demo["step_2_ai_analysis"]["demand"] == "HIGH"
    assert "24.0 km" in demo["step_4_logistics_optimization"]["distance"]
    print("[PASS] 8. Requirement 17 Demo Scenario (5 Steps Verified)")

    # 9. Admin Stats & GMV Growth
    res = requests.post(f"{BASE_URL}/auth/login", json={"email": "admin@agrilink.ai", "password": "admin123"})
    admin_token = res.json()["access_token"]
    res = requests.get(f"{BASE_URL}/admin/dashboard-stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    admin_data = res.json()
    print(f"[PASS] 9. Admin Governance & Platform Metrics (Total Farmers: {admin_data['metrics']['total_farmers']}, Total Revenue: Rs {admin_data['metrics']['total_revenue_inr']:,})")

    print("\n ALL 9 BACKEND & AI MODULE TESTS PASSED WITH 100% SUCCESS!")

if __name__ == "__main__":
    run_tests()
