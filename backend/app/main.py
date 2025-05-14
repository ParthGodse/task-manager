from fastapi import WebSocket, WebSocketDisconnect

@app.websocket("/ws/boards/{board_id}")
async def board_ws(board_id: int, ws: WebSocket):
    await manager.connect(board_id, ws)
    try:
      while True:
        data = await ws.receive_json()
        # data: { "type": "card_moved", "payload": {…} }
        await manager.broadcast(board_id, data)
    except WebSocketDisconnect:
      manager.disconnect(board_id, ws)
