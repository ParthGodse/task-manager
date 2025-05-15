from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    password: str
    name: Optional[str]

class UserRead(BaseModel):
    id: int
    email: str
    name: Optional[str]

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class BoardCreate(BaseModel):
    title: str

class BoardRead(BaseModel):
    id: int
    title: str
    owner_id: int

    class Config:
        orm_mode = True

class ListCreate(BaseModel):
    title: str
    position: int
    board_id: int

class ListRead(BaseModel):
    id: int
    title: str
    position: int
    board_id: int

    class Config:
        orm_mode = True

class CardCreate(BaseModel):
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    position: int
    list_id: int

class CardRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    due_date: Optional[datetime]
    position: int
    list_id: int

    class Config:
        orm_mode = True

class CommentCreate(BaseModel):
    content: str

class CommentRead(BaseModel):
    id: int
    card_id: int
    author_id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True

class ActivityLogRead(BaseModel):
    id: int
    board_id: int
    user_id: int
    message: str
    created_at: datetime

    class Config:
        orm_mode = True
