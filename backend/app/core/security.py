from fastapi import Depends, HTTPException
from fastapi_jwt_auth import AuthJWT
from sqlalchemy.orm import Session

from app.models import User
from app.core.config import settings
from app.database import get_db

# Hook AuthJWT to read your secret + algorithm from settings
@AuthJWT.load_config
def get_jwt_config():
    return settings  # AuthJWT will look for attributes named JWT_SECRET and JWT_ALGORITHM

def get_current_user(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db),
) -> User:
    """
    Dependency to inject the authenticated User instance.
    - Verifies the JWT in the Authorization header.
    - Fetches the corresponding User from the DB.
    """
    try:
        Authorize.jwt_required()
    except Exception:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = Authorize.get_jwt_subject()
    user = db.query(User).get(int(user_id))
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user
