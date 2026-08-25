# AgriLink AI – System Architecture & Technical Specifications

## 1. High-Level Architecture

```mermaid
graph TD
    subgraph Client [Frontend Layer - React 18 + Vite + Tailwind CSS]
        Landing[Landing Page & Value Pitch]
        Market[Direct Marketplace & Filters]
        FarmerPortal[Farmer/FPO Inventory & Pricing Portal]
        BuyerPortal[Buyer Dashboard & Order Tracker]
        AdminPortal[Admin Governance & Supply-Demand Analytics]
        AILab[AI Interactive Prediction Playground]
    end

    subgraph API_Layer [Backend API Layer - FastAPI + Uvicorn]
        Auth[/api/auth - JWT & RBAC]
        Products[/api/products - Inventory & Reviews]
        Orders[/api/orders - Lifecycle & Escrow]
        Logistics[/api/deliveries - Fleet & Tracking]
        AI_Endpoints[/api/forecast, /api/price-prediction, /api/route-optimization]
        Admin[/api/admin - Moderation & Audit]
    end

    subgraph AI_Core [Machine Learning & Optimization Core]
        DemandML[AI Demand Forecasting Engine]
        PriceML[Dynamic Fair Price Recommender]
        RouteOpt[Multi-Stop Logistics Optimizer]
    end

    subgraph Data_Layer [Data & Storage Tier]
        MongoDriver[MongoDB Connector / Pymongo]
        LocalFallback[Persistent JSON Document Store Fallback]
    end

    Client --> API_Layer
    API_Layer --> AI_Core
    API_Layer --> Data_Layer
```

## 2. Machine Learning Formulations

### A. AI Demand Forecasting Engine
The demand model computes projected percentage shift $\Delta D$ over $T=7$ days using:
$$\Delta D = \left(S_{\text{category, season}} \times W_{\text{region}} \times \left(1 + 0.12 \sin\left(\frac{m \pi}{6}\right)\right) \times F_{\text{festivals}}\right) - 1.0$$
- $S_{\text{category, season}}$: Seasonal harvest coefficient for the produce.
- $W_{\text{region}}$: Regional consumption velocity weighting (e.g. Kolkata: 1.22, Delhi NCR: 1.35).
- $m$: Current calendar month.
- $F_{\text{festivals}}$: Upcoming cultural festival multiplier (e.g., Durga Puja +18%, Diwali +22%).

### B. Dynamic Price Recommender
The recommended selling price $P_{\text{rec}}$ protects the farmer against middleman price suppression:
$$P_{\text{rec}} = P_{\text{mandi\_benchmark}} \times Q_{\text{grade}} \times L_{\text{location}} \times F_{\text{freshness}}$$
$$\text{Additional Profit} = (P_{\text{rec}} - P_{\text{farmer\_expected}}) \times \text{Quantity}_{\text{kg}}$$
- Quality grade multiplier $Q_{\text{grade}}$ (Grade A: 1.08x, Organic Premium: 1.25x, Export: 1.30x).
- Freshness multiplier $F_{\text{freshness}}$ (Harvested $\le 24$h: 1.08x).

### C. Multi-Stop Route Optimizer
Calculates the shortest cold-chain delivery corridor between **Farm Gate** $\to$ **Regional Quality Hub** $\to$ **Buyer Facility**:
$$d = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right) \times 1.28$$
$$\text{Cost} = \text{Base} + (d \times \text{Rate}_{\text{km}}) + \left(\frac{\text{Payload}_{\text{kg}}}{100} \times \text{Rate}_{\text{weight}}\right)$$

## 3. Database Schema Design

### Collections
1. **`users`**:
   - `id`, `name`, `email`, `password_hash`, `role` (`farmer`, `buyer`, `admin`, `logistics`), `location`, `fpo_name`, `coordinates`, `avatar`, `created_at`.
2. **`products`**:
   - `id`, `farmer_id`, `farmer_name`, `name`, `category`, `variety`, `quantity_kg`, `price_per_kg`, `expected_price`, `quality_grade`, `harvest_date`, `location`, `coordinates`, `image_url`, `organic_certified`, `shelf_life_days`, `rating`, `review_count`, `ai_demand_score`, `ai_predicted_growth`.
3. **`orders`**:
   - `id`, `buyer_id`, `buyer_name`, `items` (array of produce items), `total_amount`, `status` (`Pending`, `Confirmed`, `Picked Up`, `In Transit`, `Delivered`), `payment_status`, `payment_method`, `delivery_address`, `delivery_coordinates`, `logistics_info` (stops, waypoints, driver, vehicle temp, ETA), `created_at`.
4. **`notifications`**:
   - `id`, `user_id`, `title`, `message`, `type` (`demand_alert`, `price_alert`, `order`, `delivery`), `is_read`, `created_at`.
5. **`reviews`**:
   - `id`, `product_id`, `order_id`, `buyer_id`, `buyer_name`, `rating`, `comment`, `created_at`.

## 4. Security & Role-Based Authorization
- **JWT (JSON Web Tokens)**: Signed using `HS256` with configurable expiration.
- **Passlib SHA-256 / Bcrypt**: Secure password hashing with cryptographic salt.
- **Role Guards**: FastAPI dependencies enforcing role constraints (`require_role(["farmer", "admin"])`).
- **Zero API Key Leakage**: Environment variables loaded via `python-dotenv`.
