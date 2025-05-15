from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.models import User
from app.core.config import settings
from app.core.database import get_db

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# JWT configuration
@AuthJWT.load_config
def get_jwt_config():
    return settings

# Dependency to get current user
def get_current_user(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
) -> User:
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = Authorize.get_jwt_subject()
    user = db.query(User).get(int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
