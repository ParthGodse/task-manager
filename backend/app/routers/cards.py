from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas import CardCreate, CardRead
from app.models import Card
from app.core.database import get_db
from app.core.security import get_current_user

router = APIRouter(prefix="/cards", tags=["cards"])

@router.post("/", response_model=CardRead)
def create_card(
    card_in: CardCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    new_card = Card(
        title=card_in.title,
        description=card_in.description,
        due_date=card_in.due_date,
        position=card_in.position,
        list_id=card_in.list_id
    )
    db.add(new_card)
    db.commit()
    db.refresh(new_card)
    return new_card

@router.patch("/{card_id}", response_model=CardRead)
def update_card(
    card_id: int,
    card_in: CardCreate,
    db: Session = Depends(get_get_db),
    current_user = Depends(get_current_user)
):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    for field, value in card_in.dict().items():
        setattr(card, field, value)
    db.commit()
    db.refresh(card)
    return card

@router.delete("/{card_id}")
def delete_card(
    card_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    card = db.query(Card).filter(Card.id == card_id).first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    db.delete(card)
    db.commit()
    return {"detail": "Card deleted"}
