from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set, Optional
import json
from app.services.bot_service import bot_service
from app.config.logging_config import logger

router = APIRouter()

# WebSocket connections manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, bot_id: Optional[str] = None) -> None:
        await websocket.accept()
        key: str = bot_id if bot_id is not None else "global"
        if key not in self.active_connections:
            self.active_connections[key] = set()
        self.active_connections[key].add(websocket)
    
    def disconnect(self, websocket: WebSocket, bot_id: Optional[str] = None) -> None:
        key: str = bot_id if bot_id is not None else "global"
        if key in self.active_connections:
            self.active_connections[key].discard(websocket)
            if not self.active_connections[key]:
                del self.active_connections[key]
    
    async def send_message(self, message: dict, bot_id: Optional[str] = None) -> None:
        key: str = bot_id if bot_id is not None else "global"
        if key in self.active_connections:
            for connection in self.active_connections[key]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logger.error(f"Failed to send WebSocket message: {str(e)}")

manager = ConnectionManager()

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket, None)
    try:
        # Send initial data
        await websocket.send_json({
            "type": "connection_established",
            "message": "Connected to AgroBot WebSocket",
            "timestamp": str(__import__('datetime').datetime.utcnow())
        })
        
        while True:
            # Receive messages from client
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                
                # Handle different message types
                msg_type = message.get("type")
                if msg_type == "get_status":
                    bots = bot_service.get_all_bots()
                    await websocket.send_json({
                        "type": "status_update",
                        "bots": bots
                    })
                elif msg_type == "get_history":
                    bot_id = message.get("bot_id")
                    history = bot_service.get_task_history(bot_id)
                    await websocket.send_json({
                        "type": "history_update",
                        "history": history
                    })
                    
            except json.JSONDecodeError:
                await websocket.send_json({
                    "type": "error",
                    "message": "Invalid JSON format"
                })
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, None)
        logger.info("WebSocket disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        manager.disconnect(websocket, None)