from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import ListCreate, ListRead
from app.models import List
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/lists", tags=["lists"])

@router.post("/", response_model=ListRead)
def create_list(
    list_in: ListCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_list = List(title=list_in.title, position=list_in.position, board_id=list_in.board_id)
    db.add(new_list)
    db.commit()
    db.refresh(new_list)
    return new_list

@router.patch("/{list_id}", response_model=ListRead)
def update_list(
    list_id: int,
    list_in: ListCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    lst = db.query(List).filter(List.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    lst.title = list_in.title
    lst.position = list_in.position
    db.commit()
    db.refresh(lst)
    return lst

@router.delete("/{list_id}")
def delete_list(
    list_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    lst = db.query(List).filter(List.id == list_id).first()
    if not lst:
        raise HTTPException(status_code=404, detail="List not found")
    db.delete(lst)
    db.commit()
    return {"detail": "List deleted"}