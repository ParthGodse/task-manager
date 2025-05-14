from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
import datetime

# Declarative base for all ORM models\ n
Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    name = Column(String)

    # Relationships
    boards = relationship('Board', back_populates='owner', cascade='all, delete-orphan')
    comments = relationship('Comment', back_populates='author', cascade='all, delete-orphan')
    activity_logs = relationship('ActivityLog', back_populates='user', cascade='all, delete-orphan')

class Board(Base):
    __tablename__ = 'boards'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    # Relationships
    owner = relationship('User', back_populates='boards')
    lists = relationship('List', back_populates='board', cascade='all, delete-orphan')
    activity_logs = relationship('ActivityLog', back_populates='board', cascade='all, delete-orphan')

class List(Base):
    __tablename__ = 'lists'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    position = Column(Integer, nullable=False)
    board_id = Column(Integer, ForeignKey('boards.id'), nullable=False)

    # Relationships
    board = relationship('Board', back_populates='lists')
    cards = relationship('Card', back_populates='list', cascade='all, delete-orphan')

class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    due_date = Column(DateTime)
    position = Column(Integer, nullable=False)
    list_id = Column(Integer, ForeignKey('lists.id'), nullable=False)

    # Relationships
    list = relationship('List', back_populates='cards')
    comments = relationship('Comment', back_populates='card', cascade='all, delete-orphan')

class Comment(Base):
    __tablename__ = 'comments'

    id = Column(Integer, primary_key=True)
    card_id = Column(Integer, ForeignKey('cards.id'), nullable=False)
    author_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    card = relationship('Card', back_populates='comments')
    author = relationship('User', back_populates='comments')

class ActivityLog(Base):
    __tablename__ = 'activity_logs'

    id = Column(Integer, primary_key=True)
    board_id = Column(Integer, ForeignKey('boards.id'), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    board = relationship('Board', back_populates='activity_logs')
    user = relationship('User', back_populates='activity_logs')
