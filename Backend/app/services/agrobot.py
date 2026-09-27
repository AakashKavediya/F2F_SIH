from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from app.services.bot_service import bot_service
from app.services.mongodb_service import mongodb_service
from app.models.task import TaskType
from app.config.logging_config import logger
import traceback
from datetime import datetime


router = APIRouter()

class AssignTaskRequest(BaseModel):
    bot_id: str = Field(..., description="ID of the bot to assign the task to")
    task_type: str = Field(..., description="Type of task to assign")
    parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional parameters for the task")

@router.get("/bots")
async def get_all_bots():
    """Get all bots with their current status"""
    try:
        bots = bot_service.get_all_bots()
        return {"success": True, "bots": bots}
    except Exception as e:
        logger.error(f"Error getting bots: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bots/{bot_id}")
async def get_bot_status(bot_id: str):
    """Get status of a specific bot"""
    try:
        bot = bot_service.get_bot_status(bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot {bot_id} not found")
        return {"success": True, "bot": bot}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting bot status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/tasks/assign")
async def assign_task(request: AssignTaskRequest):
    """Assign a task to a bot"""
    try:
        # Validate task type
        valid_task_types = [t.value for t in TaskType]
        if request.task_type not in valid_task_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid task type. Must be one of: {', '.join(valid_task_types)}"
            )
        
        result = bot_service.assign_task(
            request.bot_id,
            request.task_type,
            request.parameters if request.parameters is not None else {}
        )
        
        if result and "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        
        return {
            "success": True,
            "message": "Task assigned successfully",
            "task": result
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error assigning task: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/history")
async def get_task_history(bot_id: Optional[str] = None, limit: int = Query(50, ge=1, le=100)):
    """Get task history"""
    try:
        history = mongodb_service.get_task_history(bot_id, limit)
        return {"success": True, "history": history, "count": len(history)}
    except Exception as e:
        logger.error(f"Error getting task history: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/pending")
async def get_pending_tasks():
    """Get all pending tasks"""
    try:
        tasks = mongodb_service.get_pending_tasks()
        return {"success": True, "tasks": tasks, "count": len(tasks)}
    except Exception as e:
        logger.error(f"Error getting pending tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/task-types")
async def get_task_types():
    """Get all available task types"""
    return {
        "success": True,
        "task_types": [
            {
                "id": TaskType.WATER_PLANTS.value,
                "name": "Water Plants",
                "description": "Water the plants in the designated area",
                "icon": "water-outline",
                "color": "#4ECDC4"
            },
            {
                "id": TaskType.DISEASE_DETECTION.value,
                "name": "Disease Detection",
                "description": "Scan plants for disease symptoms",
                "icon": "bug-outline",
                "color": "#FF6B6B"
            },
            {
                "id": TaskType.CHECKUP_MODE.value,
                "name": "Checkup Mode",
                "description": "Perform comprehensive plant health checkup",
                "icon": "medkit-outline",
                "color": "#FFB347"
            },
            {
                "id": TaskType.SURVEY.value,
                "name": "Survey",
                "description": "Survey and map the field area",
                "icon": "map-outline",
                "color": "#A29BFE"
            },
            {
                "id": TaskType.SENSOR_READING.value,
                "name": "Sensor Reading",
                "description": "Read and report all sensor data",
                "icon": "speedometer-outline",
                "color": "#4A90D9"
            },
            {
                "id": TaskType.SPRAY_PESTICIDES.value,
                "name": "Spray Pesticides",
                "description": "Spray pesticides on crops",
                "icon": "cloudy-outline",
                "color": "#A29BFE"
            }
        ]
    }


@router.post("/bots/{bot_id}/reset")
async def reset_bot_status(bot_id: str):
    """Reset a bot's status to Idle"""
    try:
        bot = mongodb_service.get_bot_status(bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot {bot_id} not found")
        
        # Reset status
        mongodb_service.update_bot_status({
            "bot_id": bot_id,
            "status": "Idle",
            "task": "Standby",
            "current_task_id": None,
            "last_updated": datetime.utcnow()
        })
        
        return {"success": True, "message": f"Bot {bot_id} reset to Idle"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error resetting bot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))