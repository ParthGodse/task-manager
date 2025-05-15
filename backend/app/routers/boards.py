from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import BoardCreate, BoardRead
from app.models import Board
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/boards", tags=["boards"])

@router.get("/", response_model=List[BoardRead])
def read_boards(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    return db.query(Board).filter(Board.owner_id == current_user.id).all()

@router.post("/", response_model=BoardRead)
def create_board(
    board: BoardCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_board = Board(title=board.title, owner_id=current_user.id)
    db.add(new_board)
    db.commit()
    db.refresh(new_board)
    return new_board

@router.delete("/{board_id}")
def delete_board(
    board_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    board = db.query(Board).filter(Board.id == board_id, Board.owner_id == current_user.id).first()
    if not board:
        raise HTTPException(status_code=404, detail="Board not found")
    db.delete(board)
    db.commit()
    return {"detail": "Board deleted"}
