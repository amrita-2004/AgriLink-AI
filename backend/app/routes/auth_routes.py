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
        role = user_dict.get("role", "buyer")
        avatars = {
            "farmer": "https://images.unsplash.com/photo-1592417817098-8f3d6ef23992?w=150&auto=format&fit=crop&q=80",
            "admin":  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            "logistics": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80",
        }
        user_dict["avatar"] = avatars.get(role, "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")

    created = users_col.insert_one(user_dict)

    # Build clean dict for UserOut (strip internal Mongo _id / password)
    clean = {k: v for k, v in created.items() if k not in ("_id", "password")}

    token = create_access_token({
        "sub": clean.get("id", ""),
        "role": clean.get("role", "buyer"),
        "name": clean.get("name", ""),
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**clean),
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

    # Strip internal fields before returning
    clean = {k: v for k, v in user.items() if k not in ("_id", "password")}
    token = create_access_token({
        "sub": clean.get("id", ""),
        "role": clean.get("role", "buyer"),
        "name": clean.get("name", ""),
    })
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserOut(**clean),
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(user: dict = Depends(get_required_user)):
    clean = {k: v for k, v in user.items() if k not in ("_id", "password")}
    return UserOut(**clean)

@router.get("/demo-accounts")
def get_demo_accounts():
    """Returns quick demo credential presets for easy 1-click login during reviews/presentations."""
    return [
        {"role": "farmer", "name": "Ramesh Sharma (Hooghly FPO)", "email": "farmer@agrilink.ai", "password": "farmer123", "tag": "Farmer / FPO"},
        {"role": "buyer", "name": "Pooja Verma (FreshBites Retail)", "email": "buyer@agrilink.ai", "password": "buyer123", "tag": "Consumer / Bulk Buyer"},
        {"role": "admin", "name": "System Administrator", "email": "admin@agrilink.ai", "password": "admin123", "tag": "Platform Admin"}
    ]
