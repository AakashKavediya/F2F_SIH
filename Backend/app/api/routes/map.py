from fastapi import APIRouter, HTTPException, Query
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from app.services.mongodb_service import mongodb_service
from app.services.bot_service import bot_service
from app.config.logging_config import logger
from app.models.task import TaskPriority
from app.models.alert import AlertType, AlertPriority
import traceback
import asyncio

router = APIRouter()

# ── Task Routes ──────────────────────────────────────────────────────

class TaskCreateRequest(BaseModel):
    title: str = Field(..., description="Task title")
    time: str = Field(..., description="Scheduled time (e.g., 6:00pm)")
    description: Optional[str] = Field(None, description="Task description")
    priority: str = Field("medium", description="Task priority: low, medium, high")
    assigned_to: Optional[str] = Field(None, description="Bot ID assigned to task")
    plot_id: Optional[str] = Field(None, description="Plot ID for the task")

class TaskUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, description="Task title")
    time: Optional[str] = Field(None, description="Scheduled time")
    description: Optional[str] = Field(None, description="Task description")
    priority: Optional[str] = Field(None, description="Task priority: low, medium, high")
    status: Optional[str] = Field(None, description="Task status: pending, in_progress, completed, cancelled")
    assigned_to: Optional[str] = Field(None, description="Bot ID assigned to task")
    plot_id: Optional[str] = Field(None, description="Plot ID for the task")

@router.post("/tasks")
async def create_task(request: TaskCreateRequest):
    """Create a new task"""
    try:
        # Validate priority
        valid_priorities = [p.value for p in TaskPriority]
        if request.priority not in valid_priorities:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid priority. Must be one of: {', '.join(valid_priorities)}"
            )
        
        task_data = {
            "title": request.title,
            "time": request.time,
            "description": request.description or "",
            "priority": request.priority,
            "assigned_to": request.assigned_to,
            "plot_id": request.plot_id,
            "status": "pending"
        }
        
        task = mongodb_service.create_task(task_data)
        if not task:
            raise HTTPException(status_code=500, detail="Failed to create task")
        
        return {"success": True, "message": "Task created successfully", "task": task}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks")
async def get_tasks(status: Optional[str] = None, limit: int = Query(50, ge=1, le=100)):
    """Get all tasks with optional status filter"""
    try:
        tasks = mongodb_service.get_tasks(limit, status)
        return {"success": True, "tasks": tasks, "count": len(tasks)}
        
    except Exception as e:
        logger.error(f"Error getting tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tasks/{task_id}")
async def get_task(task_id: str):
    """Get a specific task by ID"""
    try:
        task = mongodb_service.get_task(task_id)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"success": True, "task": task}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting task: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/tasks/{task_id}")
async def update_task(task_id: str, request: TaskUpdateRequest):
    """Update a task"""
    try:
        # Build update data from non-None fields
        update_data = {}
        if request.title is not None:
            update_data["title"] = request.title
        if request.time is not None:
            update_data["time"] = request.time
        if request.description is not None:
            update_data["description"] = request.description
        if request.priority is not None:
            # Validate priority
            valid_priorities = [p.value for p in TaskPriority]
            if request.priority not in valid_priorities:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid priority. Must be one of: {', '.join(valid_priorities)}"
                )
            update_data["priority"] = request.priority
        if request.status is not None:
            valid_statuses = ["pending", "in_progress", "completed", "cancelled"]
            if request.status not in valid_statuses:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}"
                )
            update_data["status"] = request.status
            if request.status == "completed":
                update_data["completed_at"] = datetime.utcnow()
        if request.assigned_to is not None:
            update_data["assigned_to"] = request.assigned_to
        if request.plot_id is not None:
            update_data["plot_id"] = request.plot_id
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        task = mongodb_service.update_task(task_id, update_data)
        if not task:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"success": True, "message": "Task updated successfully", "task": task}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating task: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    """Delete a task"""
    try:
        deleted = mongodb_service.delete_task(task_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Task not found")
        
        return {"success": True, "message": "Task deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting task: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Alert Routes ──────────────────────────────────────────────────────

class AlertCreateRequest(BaseModel):
    title: str = Field(..., description="Alert title")
    type: str = Field("general", description="Alert type: weather, disease, buyer, general, system")
    priority: str = Field("medium", description="Alert priority: low, medium, high, urgent")
    color: str = Field("#DDEFF7", description="Alert color")
    message: Optional[str] = Field(None, description="Alert message")

@router.post("/alerts")
async def create_alert(request: AlertCreateRequest):
    """Create a new alert"""
    try:
        # Validate type
        valid_types = [t.value for t in AlertType]
        if request.type not in valid_types:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid alert type. Must be one of: {', '.join(valid_types)}"
            )
        
        # Validate priority
        valid_priorities = [p.value for p in AlertPriority]
        if request.priority not in valid_priorities:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid priority. Must be one of: {', '.join(valid_priorities)}"
            )
        
        alert_data = {
            "title": request.title,
            "type": request.type,
            "priority": request.priority,
            "color": request.color,
            "message": request.message or "",
            "time": "Just now"
        }
        
        alert = mongodb_service.create_alert(alert_data)
        if not alert:
            raise HTTPException(status_code=500, detail="Failed to create alert")
        
        return {"success": True, "message": "Alert created successfully", "alert": alert}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating alert: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts")
async def get_alerts(unread_only: bool = False, limit: int = Query(50, ge=1, le=100)):
    """Get all alerts"""
    try:
        alerts = mongodb_service.get_alerts(limit, unread_only)
        return {"success": True, "alerts": alerts, "count": len(alerts)}
        
    except Exception as e:
        logger.error(f"Error getting alerts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/alerts/{alert_id}")
async def get_alert(alert_id: str):
    """Get a specific alert by ID"""
    try:
        alert = mongodb_service.get_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"success": True, "alert": alert}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting alert: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/alerts/{alert_id}/read")
async def mark_alert_read(alert_id: str):
    """Mark an alert as read"""
    try:
        marked = mongodb_service.mark_alert_read(alert_id)
        if not marked:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"success": True, "message": "Alert marked as read"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error marking alert as read: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/alerts/{alert_id}")
async def delete_alert(alert_id: str):
    """Delete an alert"""
    try:
        deleted = mongodb_service.delete_alert(alert_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Alert not found")
        
        return {"success": True, "message": "Alert deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting alert: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Plot Routes ──────────────────────────────────────────────────────

class PlotCreateRequest(BaseModel):
    title: str = Field(..., description="Plot title")
    latitude: float = Field(..., description="Plot latitude")
    longitude: float = Field(..., description="Plot longitude")
    area: Optional[float] = Field(None, description="Plot area in hectares")
    crop: Optional[str] = Field(None, description="Current crop")

class PlotUpdateRequest(BaseModel):
    title: Optional[str] = Field(None, description="Plot title")
    latitude: Optional[float] = Field(None, description="Plot latitude")
    longitude: Optional[float] = Field(None, description="Plot longitude")
    area: Optional[float] = Field(None, description="Plot area in hectares")
    crop: Optional[str] = Field(None, description="Current crop")

@router.post("/plots")
async def create_plot(request: PlotCreateRequest):
    """Create a new plot"""
    try:
        plot_data = {
            "title": request.title,
            "latitude": request.latitude,
            "longitude": request.longitude,
            "area": request.area,
            "crop": request.crop
        }
        
        plot = mongodb_service.create_plot(plot_data)
        if not plot:
            raise HTTPException(status_code=500, detail="Failed to create plot")
        
        return {"success": True, "message": "Plot created successfully", "plot": plot}
        
    except Exception as e:
        logger.error(f"Error creating plot: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/plots")
async def get_plots():
    """Get all plots"""
    try:
        plots = mongodb_service.get_plots()
        return {"success": True, "plots": plots, "count": len(plots)}
        
    except Exception as e:
        logger.error(f"Error getting plots: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/plots/{plot_id}")
async def get_plot(plot_id: str):
    """Get a specific plot by ID"""
    try:
        plot = mongodb_service.get_plot(plot_id)
        if not plot:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        return {"success": True, "plot": plot}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting plot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/plots/{plot_id}")
async def update_plot(plot_id: str, request: PlotUpdateRequest):
    """Update a plot"""
    try:
        update_data = {}
        if request.title is not None:
            update_data["title"] = request.title
        if request.latitude is not None:
            update_data["latitude"] = request.latitude
        if request.longitude is not None:
            update_data["longitude"] = request.longitude
        if request.area is not None:
            update_data["area"] = request.area
        if request.crop is not None:
            update_data["crop"] = request.crop
        
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        plot = mongodb_service.update_plot(plot_id, update_data)
        if not plot:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        return {"success": True, "message": "Plot updated successfully", "plot": plot}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating plot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/plots/{plot_id}")
async def delete_plot(plot_id: str):
    """Delete a plot"""
    try:
        deleted = mongodb_service.delete_plot(plot_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Plot not found")
        
        return {"success": True, "message": "Plot deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting plot: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Bot Routes ──────────────────────────────────────────────────────

@router.get("/bots")
async def get_bots():
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

@router.put("/bots/{bot_id}/status")
async def update_bot_status(bot_id: str, status_data: Dict[str, Any]):
    """Update bot status"""
    try:
        bot = bot_service.get_bot_status(bot_id)
        if not bot:
            raise HTTPException(status_code=404, detail=f"Bot {bot_id} not found")
        
        # Merge existing status with updates
        if "status" in status_data:
            bot["status"] = status_data["status"]
        if "battery" in status_data:
            bot["battery"] = status_data["battery"]
        if "speed" in status_data:
            bot["speed"] = status_data["speed"]
        if "plot" in status_data:
            bot["plot"] = status_data["plot"]
        if "process" in status_data:
            bot["process"] = status_data["process"]
        if "location" in status_data:
            bot["location"] = status_data["location"]
        
        updated = mongodb_service.update_bot_status(bot)
        if not updated:
            raise HTTPException(status_code=500, detail="Failed to update bot status")
        
        return {"success": True, "message": "Bot status updated", "bot": updated}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating bot status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Map Data Route ──────────────────────────────────────────────────

@router.get("/map-data")
async def get_map_data():
    """Get all map data in one request (tasks, alerts, bots, plots)"""
    try:
        # Get all data in parallel using asyncio.gather with run_in_executor
        def fetch_all():
            return {
                "tasks": mongodb_service.get_tasks(50) or [],
                "alerts": mongodb_service.get_alerts(50) or [],
                "bots": bot_service.get_all_bots() or [],
                "plots": mongodb_service.get_plots() or []
            }
        
        # Run the blocking function in a thread pool
        loop = asyncio.get_event_loop()
        data = await loop.run_in_executor(None, fetch_all)
        
        return {
            "success": True,
            "tasks": data["tasks"],
            "alerts": data["alerts"],
            "bots": data["bots"],
            "plots": data["plots"]
        }
        
    except Exception as e:
        logger.error(f"Error getting map data: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Health Check ──────────────────────────────────────────────────

@router.get("/health")
async def map_health_check():
    """Health check for map routes"""
    return {
        "status": "ok",
        "service": "map",
        "timestamp": datetime.utcnow().isoformat()
    }