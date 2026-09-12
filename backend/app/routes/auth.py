import os
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt
import bcrypt
from dotenv import load_dotenv

from app.database.database import get_db
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest


load_dotenv()


router = APIRouter(prefix="/auth", tags=["Authentication"])


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


@router.post("/register")
def register(
    user_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    if user_data.role not in ["buyer", "supplier"]:
        raise HTTPException(
            status_code=400,
            detail="Role must be buyer or supplier"
        )

    existing_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email is already registered"
        )

    hashed_password = bcrypt.hashpw(
        user_data.password.encode("utf-8"),
        bcrypt.gensalt()
    ).decode("utf-8")

    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_password,
        role=user_data.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Account created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "role": new_user.role
        }
    }


@router.post("/login")
def login(
    user_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    password_matches = bcrypt.checkpw(
        user_data.password.encode("utf-8"),
        user.password.encode("utf-8")
    )

    if not password_matches:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token_data = {
    "user_id": user.id,
    "role": user.role,
    "exp": datetime.utcnow() + timedelta(hours=2)
}

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }