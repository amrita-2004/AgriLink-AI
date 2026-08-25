from fastapi import APIRouter, HTTPException, Depends, status
from backend.app.database import get_users_col
from backend.app.schemas import UserCreate, UserLogin, UserOut, Token
from backend.app.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user,
    get_required_user
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=Token)
def register_user(user_in: UserCreate):
    users_col = get_users_col()
    existing = users_col.find_one({"email": user_in.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    user_dict = user_in.model_dump()
    user_dict["email"] = user_dict["email"].lower()
    raw_pwd = user_dict.pop("password")
    user_dict["password"] = get_password_hash(raw_pwd)
    
    # Assign default avatars based on role
    if not user_dict.get("avatar"):
        if user_dict.get("role") == "farmer":
            user_dict["avatar"] = "https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80"
        elif user_dict.get("role") == "admin":
            user_dict["avatar"] = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        else:
            user_dict["avatar"] = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"

    created = users_col.insert_one(user_dict)
    
    # Generate token
    token = create_access_token({"sub": created["id"], "role": created["role"], "name": created["name"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**created)
    }

@router.post("/login", response_model=Token)
def login_user(creds: UserLogin):
    users_col = get_users_col()
    user = users_col.find_one({"email": creds.email.lower()})
    if not user or not verify_password(creds.password, user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token({"sub": user["id"], "role": user.get("role", "buyer"), "name": user.get("name")})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**user)
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: dict = Depends(get_required_user)):
    return UserOut(**user)

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns quick demo credential presets for easy 1-click login during reviews/presentations."""
    return [
        {"role": "farmer", "name": "Ramesh Sharma (Hooghly FPO)", "email": "farmer@agrilink.ai", "password": "farmer123", "tag": "Farmer / FPO"},
        {"role": "buyer", "name": "Pooja Verma (FreshBites Retail)", "email": "buyer@agrilink.ai", "password": "buyer123", "tag": "Consumer / Bulk Buyer"},
        {"role": "admin", "name": "System Administrator", "email": "admin@agrilink.ai", "password": "admin123", "tag": "Platform Admin"}
    ]
