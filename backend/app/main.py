from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import engine, Base
from app.routers import auth, boards, lists, cards, comments, activity
from app.core.security import get_current_user

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(boards.router, prefix="/boards", dependencies=[Depends(get_current_user)])
app.include_router(lists.router, dependencies=[Depends(get_current_user)])
app.include_router(cards.router, dependencies=[Depends(get_current_user)])
app.include_router(comments.router, dependencies=[Depends(get_current_user)])
app.include_router(activity.router, dependencies=[Depends(get_current_user)])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[int, list[WebSocket]] = {}

    async def connect(self, board_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.setdefault(board_id, []).append(websocket)

    def disconnect(self, board_id: int, websocket: WebSocket):
        self.active_connections[board_id].remove(websocket)

    async def broadcast(self, board_id: int, message: dict):
        for connection in self.active_connections.get(board_id, []):
            await connection.send_json(message)

manager = ConnectionManager()

@app.websocket("/ws/boards/{board_id}")
async def board_ws(board_id: int, websocket: WebSocket):
    await manager.connect(board_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.broadcast(board_id, data)
    except WebSocketDisconnect:
        manager.disconnect(board_id, websocket)
