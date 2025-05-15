from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas import ActivityLogRead
from app.models import ActivityLog
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/activity", tags=["activity"])

@router.get("/boards/{board_id}", response_model=List[ActivityLogRead])
def get_activity_logs(
    board_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(ActivityLog).filter(ActivityLog.board_id == board_id).order_by(ActivityLog.created_at.desc()).all()
