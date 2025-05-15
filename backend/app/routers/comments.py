from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import CommentCreate, CommentRead
from app.models import Comment
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/comments", tags=["comments"])

@router.get("/cards/{card_id}", response_model=List[CommentRead])
def get_comments(
    card_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Comment).filter(Comment.card_id == card_id).all()

@router.post("/cards/{card_id}", response_model=CommentRead)
def create_comment(
    card_id: int,
    comment_in: CommentCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_comment = Comment(
        card_id=card_id,
        author_id=current_user.id,
        content=comment_in.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment