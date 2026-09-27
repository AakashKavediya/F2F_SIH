import time
import threading
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from app.services.mqtt_service import mqtt_service
from app.services.mongodb_service import mongodb_service
from app.config.settings import TASK_CONFIG, MQTT_CONFIG
from app.config.logging_config import logger
from app.models.task import TaskStatus, TaskType

class BotService:
    def __init__(self):
        self.active_tasks: Dict[str, Dict[str, Any]] = {}
        self.task_timers: Dict[str, threading.Timer] = {}
        self.running = True
        
        # Start the task monitor thread
        self.monitor_thread = threading.Thread(target=self._monitor_tasks, daemon=True)
        self.monitor_thread.start()
        
        # Register MQTT callbacks
        mqtt_service.register_callback(
            MQTT_CONFIG["topics"]["task_update"],
            self._handle_task_update
        )
        mqtt_service.register_callback(
            MQTT_CONFIG["topics"]["status"],
            self._handle_bot_status
        )
        
        # Load initial tasks
        self._load_pending_tasks()
    
    def _load_pending_tasks(self) -> None:
        """Load pending tasks from MongoDB"""
        try:
            tasks = mongodb_service.get_pending_tasks()
            valid_tasks = 0
            invalid_tasks = 0
            
            for task in tasks:
                # Get task_id as string
                task_id = task.get("_id") or task.get("id")
                if not task_id:
                    continue
                task_id_str = str(task_id)
                
                # Check if task has task_type
                task_type = task.get("task_type") or task.get("type")
                
                if not task_type:
                    logger.warning(f"Task {task_id_str} has no task_type - skipping")
                    invalid_tasks += 1
                    # Mark as failed with error
                    if task.get("status") == "pending":
                        self._fail_task(task_id_str, "Missing task_type - task invalid")
                    continue
                
                # Ensure task_type is properly set
                if "task_type" not in task and "type" in task:
                    task["task_type"] = task["type"]
                    mongodb_service.update_task(task_id_str, {"task_type": task["type"]})
                
                valid_tasks += 1
                
                if task["status"] == "pending":
                    # Send to bot
                    self._send_task_to_bot(task)
                elif task["status"] == "in_progress":
                    # Monitor existing tasks
                    self._start_task_monitor(task_id_str)
            
            logger.info(f"Loaded {valid_tasks} valid tasks, {invalid_tasks} invalid tasks skipped")
            
        except Exception as e:
            logger.error(f"Failed to load pending tasks: {str(e)}")
    
    def _send_task_to_bot(self, task: Dict[str, Any]) -> bool:
        """Send a task to the bot via MQTT"""
        try:
            # Check if task has the required fields - convert to string
            task_id = task.get("_id") or task.get("id")
            if not task_id:
                logger.error("Task has no ID")
                return False
            task_id_str = str(task_id)
            
            task_type = task.get("task_type") or task.get("type")
            if not task_type:
                logger.error(f"Task {task_id_str} has no task_type")
                return False
            
            bot_id = task.get("bot_id") or task.get("assigned_to")
            if not bot_id:
                logger.error(f"Task {task_id_str} has no bot_id")
                return False
            
            command = {
                "action": "execute_task",
                "task_id": task_id_str,
                "task_type": task_type,
                "bot_id": bot_id,
                "parameters": task.get("parameters", {}),
                "assigned_by": task.get("assigned_by", "user")
            }
            
            response = mqtt_service.publish_command(command, wait_for_response=False)
            
            if response:
                # Update task status
                mongodb_service.update_task(task_id_str, {
                    "status": "in_progress",
                    "started_at": datetime.utcnow(),
                    "mqtt_message_id": response.get("message_id")
                })
                
                # Start monitoring
                self._start_task_monitor(task_id_str)
                
                logger.info(f"Task {task_id_str} sent to bot {bot_id}")
                return True
            else:
                logger.error(f"Failed to send task {task_id_str} to bot")
                return False
                
        except Exception as e:
            logger.error(f"Error sending task to bot: {str(e)}")
            return False
    
    def _start_task_monitor(self, task_id: str) -> None:
        """Start monitoring a task's progress"""
        if task_id in self.task_timers:
            return
        
        # Set timer for task completion
        timer = threading.Timer(TASK_CONFIG["task_timeout"], self._check_task_completion, args=[task_id])
        timer.daemon = True
        timer.start()
        
        self.task_timers[task_id] = timer
        logger.info(f"Started monitor for task {task_id}")
    
    def _check_task_completion(self, task_id: str) -> None:
        """Check if a task has been completed"""
        try:
            task = mongodb_service.get_task(task_id)
            if not task:
                return
            
            if task["status"] == "in_progress":
                # Task not completed within timeout
                self._fail_task(task_id, "Task timeout - no response from bot")
                
            self.task_timers.pop(task_id, None)
            
        except Exception as e:
            logger.error(f"Error checking task completion: {str(e)}")
    
    def _handle_task_update(self, payload: Dict[str, Any]) -> None:
        """Handle task status updates from bot"""
        try:
            task_id = payload.get("task_id")
            if not task_id:
                return
            task_id_str = str(task_id)
            
            status = payload.get("status")
            result = payload.get("result", {})
            error = payload.get("error")
            
            task = mongodb_service.get_task(task_id_str)
            if not task:
                logger.warning(f"Task {task_id_str} not found")
                return
            
            if status == "completed":
                self._complete_task(task_id_str, result or {})
            elif status == "failed":
                self._fail_task(task_id_str, error or "Task failed")
            elif status == "in_progress":
                # Update progress
                mongodb_service.update_task(task_id_str, {
                    "result": result,
                    "updated_at": datetime.utcnow()
                })
                
        except Exception as e:
            logger.error(f"Error handling task update: {str(e)}")
    
    def _handle_bot_status(self, payload: Dict[str, Any]) -> None:
        """Handle bot status updates from MQTT"""
        try:
            bot_id = payload.get("bot_id")
            if not bot_id:
                return
            
            # Update bot status in MongoDB
            mongodb_service.update_bot_status(payload)
            logger.info(f"Updated status for bot {bot_id}")
            
        except Exception as e:
            logger.error(f"Error handling bot status: {str(e)}")
    
    def _reset_bot_status(self, bot_id: str) -> None:
        """Reset bot status to Idle after task completion"""
        try:
            # Get current bot status
            bot = mongodb_service.get_bot_status(bot_id)
            if bot:
                # Reset status to Idle
                mongodb_service.update_bot_status({
                    "bot_id": bot_id,
                    "status": "Idle",
                    "task": "Standby",
                    "current_task_id": None,
                    "last_updated": datetime.utcnow()
                })
                logger.info(f"Bot {bot_id} status reset to Idle")
        except Exception as e:
            logger.error(f"Error resetting bot status: {str(e)}")
    
    def _complete_task(self, task_id: str, result: Dict[str, Any]) -> None:
        """Complete a task"""
        try:
            task = mongodb_service.get_task(task_id)
            if not task:
                return
            
            bot_id = task.get("bot_id")
            
            # Update task
            update_data: Dict[str, Any] = {
                "status": "completed",
                "completed_at": datetime.utcnow(),
                "result": result or {}
            }
            
            # Calculate duration - FIXED: convert string to datetime
            if task.get("started_at"):
                try:
                    started_at = task["started_at"]
                    if isinstance(started_at, str):
                        started_at = datetime.fromisoformat(started_at.replace('Z', '+00:00'))
                    elif isinstance(started_at, datetime):
                        started_at = started_at
                    else:
                        started_at = None
                    
                    if started_at:
                        duration = (datetime.utcnow() - started_at).total_seconds()
                        update_data["duration"] = duration
                except Exception as e:
                    logger.warning(f"Could not calculate duration for task {task_id}: {str(e)}")
            
            mongodb_service.update_task(task_id, update_data)
            
            # Archive task to history
            archived = mongodb_service.archive_task(task_id)
            if archived:
                logger.info(f"Task {task_id} archived to history")
            
            # Stop monitoring
            self.task_timers.pop(task_id, None)
            
            # Reset bot status
            if bot_id:
                self._reset_bot_status(str(bot_id))
            
            logger.info(f"Task {task_id} completed in {update_data.get('duration', 0)} seconds")
            
        except Exception as e:
            logger.error(f"Error completing task: {str(e)}")

    def _fail_task(self, task_id: str, error: str) -> None:
        """Mark a task as failed"""
        try:
            task = mongodb_service.get_task(task_id)
            if not task:
                return
            
            bot_id = task.get("bot_id")
            
            # Update task
            update_data: Dict[str, Any] = {
                "status": "failed" if "timeout" not in error.lower() else "timeout",
                "completed_at": datetime.utcnow(),
                "error": error
            }
            
            # Calculate duration - FIXED: convert string to datetime
            if task.get("started_at"):
                try:
                    started_at = task["started_at"]
                    if isinstance(started_at, str):
                        started_at = datetime.fromisoformat(started_at.replace('Z', '+00:00'))
                    elif isinstance(started_at, datetime):
                        started_at = started_at
                    else:
                        started_at = None
                    
                    if started_at:
                        duration = (datetime.utcnow() - started_at).total_seconds()
                        update_data["duration"] = duration
                except Exception as e:
                    logger.warning(f"Could not calculate duration for task {task_id}: {str(e)}")
            
            mongodb_service.update_task(task_id, update_data)
            
            # Archive task to history
            archived = mongodb_service.archive_task(task_id)
            if archived:
                logger.info(f"Task {task_id} archived to history")
            
            # Stop monitoring
            self.task_timers.pop(task_id, None)
            
            # Reset bot status
            if bot_id:
                self._reset_bot_status(str(bot_id))
            
            logger.error(f"Task {task_id} failed: {error}")
            
        except Exception as e:
            logger.error(f"Error failing task: {str(e)}")
    
    def _monitor_tasks(self) -> None:
        """Background thread to monitor tasks"""
        while self.running:
            try:
                # Check for tasks that need to be processed
                pending_tasks = mongodb_service.get_pending_tasks()
                
                for task in pending_tasks:
                    # Get task_id as string
                    task_id = task.get("_id") or task.get("id")
                    if not task_id:
                        continue
                    task_id_str = str(task_id)
                    
                    # Check if task has task_type
                    if "task_type" not in task and "type" not in task:
                        logger.warning(f"Task {task_id_str} has no task_type - skipping")
                        continue
                    
                    if task["status"] == "pending":
                        # Send pending tasks to bot
                        self._send_task_to_bot(task)
                
                time.sleep(TASK_CONFIG["check_interval"])
                
            except Exception as e:
                logger.error(f"Error in task monitor: {str(e)}")
                time.sleep(5)
    
    def assign_task(self, bot_id: str, task_type: str, parameters: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """Assign a new task to a bot"""
        try:
            # Check if bot exists
            bot = mongodb_service.get_bot_status(bot_id)
            if not bot:
                # Create default bot status if not exists
                bot = {
                    "bot_id": bot_id,
                    "name": f"AgroBot {bot_id}",
                    "status": "Idle",
                    "battery": 90,
                    "task": "Standby",
                    "connectivity": "Good",
                    "sensor_health": "Good",
                    "speed": "1.0 m/s",
                    "location": "Field A"
                }
                mongodb_service.update_bot_status(bot)
            
            # Check if bot is busy
            if bot.get("status") == "Busy":
                logger.warning(f"Bot {bot_id} is busy with task: {bot.get('task')}")
                return {"error": f"Bot {bot_id} is busy with {bot.get('task', 'another task')}"}
            
            # Create task
            task_data = {
                "bot_id": bot_id,
                "task_type": task_type,
                "type": task_type,  # Add this for compatibility
                "parameters": parameters or {},
                "assigned_by": "user"
            }
            
            task = mongodb_service.create_task(task_data)
            if not task:
                return {"error": "Failed to create task"}
            
            # Update bot status to Busy
            task_name = task_type.replace("_", " ").title()
            mongodb_service.update_bot_status({
                "bot_id": bot_id,
                "status": "Busy",
                "task": task_name,
                "current_task_id": task["_id"],
                "last_updated": datetime.utcnow()
            })
            
            # Send to bot
            self._send_task_to_bot(task)
            
            return task
            
        except Exception as e:
            logger.error(f"Error assigning task: {str(e)}")
            return {"error": str(e)}
    
    def get_bot_status(self, bot_id: str) -> Optional[Dict[str, Any]]:
        """Get bot status"""
        return mongodb_service.get_bot_status(bot_id)
    
    def get_all_bots(self) -> List[Dict[str, Any]]:
        """Get all bots status"""
        bots = mongodb_service.get_all_bots_status()
        return bots if bots is not None else []
    
    def get_task_history(self, bot_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get task history"""
        history = mongodb_service.get_task_history(bot_id)
        return history if history is not None else []
    
    def shutdown(self) -> None:
        """Shutdown the bot service"""
        self.running = False
        for timer in self.task_timers.values():
            timer.cancel()
        self.task_timers.clear()
        
        # Reset all bots to Idle on shutdown
        try:
            bots = self.get_all_bots()
            for bot in bots:
                bot_id = bot.get("bot_id")
                if bot_id:
                    self._reset_bot_status(str(bot_id))
        except Exception as e:
            logger.error(f"Error resetting bots on shutdown: {str(e)}")

# Singleton instance
bot_service = BotService()