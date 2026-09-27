from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from pymongo import MongoClient, ASCENDING, DESCENDING
from pymongo.errors import PyMongoError
from bson import ObjectId
import uuid
from app.config.settings import MONGODB_CONFIG
from app.config.logging_config import logger

def convert_objectid(obj: Any) -> Any:
    """Convert ObjectId to string recursively"""
    if isinstance(obj, dict):
        return {k: convert_objectid(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_objectid(item) for item in obj]
    elif isinstance(obj, ObjectId):
        return str(obj)
    elif isinstance(obj, datetime):
        return obj.isoformat()
    return obj

class MongoDBService:
    def __init__(self):
        self.client: Optional[MongoClient] = None
        self.db: Optional[Any] = None
        self.connect()
    
    def connect(self) -> None:
        """Connect to MongoDB"""
        try:
            connection_string = MONGODB_CONFIG["url"]
            
            if "?" in connection_string:
                base, query = connection_string.split("?", 1)
                if not base.endswith("/"):
                    base = base.rstrip("/")
                connection_string = f"{base}/{MONGODB_CONFIG['database']}?{query}"
            else:
                connection_string = f"{connection_string.rstrip('/')}/{MONGODB_CONFIG['database']}"
            
            self.client = MongoClient(connection_string)
            self.db = self.client[MONGODB_CONFIG["database"]]
            
            if self.client is not None:
                self.client.admin.command('ping')
                logger.info(f"Connected to MongoDB: {MONGODB_CONFIG['database']}")
            
            self._create_indexes()
            
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise
    
    def _create_indexes(self) -> None:
        """Create necessary indexes"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return
                
            # Tasks collection indexes
            tasks_col = self.db["tasks"]
            tasks_col.create_index([("title", ASCENDING)])
            tasks_col.create_index([("status", ASCENDING)])
            tasks_col.create_index([("created_at", DESCENDING)])
            tasks_col.create_index([("assigned_to", ASCENDING)])
            
            # Alerts collection indexes
            alerts_col = self.db["alerts"]
            alerts_col.create_index([("is_read", ASCENDING)])
            alerts_col.create_index([("created_at", DESCENDING)])
            alerts_col.create_index([("type", ASCENDING)])
            
            # Plots collection indexes
            plots_col = self.db["plots"]
            plots_col.create_index([("title", ASCENDING)])
            
            # Bot status indexes
            status_col = self.db["bot_status"]
            status_col.create_index([("bot_id", ASCENDING)], unique=True)
            
            logger.info("MongoDB indexes created")
            
        except Exception as e:
            logger.error(f"Failed to create indexes: {str(e)}")
    
    # ── Task Methods ──────────────────────────────────────────────────────
    
    def create_task(self, task_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new task"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            tasks_col = self.db["tasks"]
            task_data["_id"] = str(uuid.uuid4())
            task_data["created_at"] = datetime.utcnow()
            task_data["updated_at"] = datetime.utcnow()
            
            tasks_col.insert_one(task_data)
            task_data["id"] = task_data["_id"]
            return convert_objectid(task_data)
            
        except Exception as e:
            logger.error(f"Failed to create task: {str(e)}")
            return None

    def get_task(self, task_id: str) -> Optional[Dict[str, Any]]:
        """Get a task by ID"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            tasks_col = self.db["tasks"]
            task = tasks_col.find_one({"_id": task_id})
            if task:
                task["id"] = task["_id"]
                return convert_objectid(task)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get task: {str(e)}")
            return None

    def get_tasks(self, limit: int = 50, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all tasks with optional status filter"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            tasks_col = self.db["tasks"]
            query = {}
            if status:
                query["status"] = status
            
            tasks = list(tasks_col.find(query).sort("created_at", DESCENDING).limit(limit))
            return convert_objectid(tasks)
            
        except Exception as e:
            logger.error(f"Failed to get tasks: {str(e)}")
            return []

    def get_pending_tasks(self, bot_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all pending tasks"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            tasks_col = self.db["tasks"]
            query: Dict[str, Any] = {"status": {"$in": ["pending", "in_progress"]}}
            if bot_id:
                query["assigned_to"] = bot_id
            
            tasks = list(tasks_col.find(query).sort("created_at", ASCENDING))
            for task in tasks:
                task["id"] = task["_id"]
            return convert_objectid(tasks)
            
        except Exception as e:
            logger.error(f"Failed to get pending tasks: {str(e)}")
            return []

    def update_task(self, task_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a task"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            tasks_col = self.db["tasks"]
            update_data["updated_at"] = datetime.utcnow()
            
            result = tasks_col.update_one(
                {"_id": task_id},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                return self.get_task(task_id)
            return None
            
        except Exception as e:
            logger.error(f"Failed to update task: {str(e)}")
            return None

    def delete_task(self, task_id: str) -> bool:
        """Delete a task"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return False
                
            tasks_col = self.db["tasks"]
            result = tasks_col.delete_one({"_id": task_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Failed to delete task: {str(e)}")
            return False
    
    # ── Alert Methods ──────────────────────────────────────────────────────
    
    def create_alert(self, alert_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new alert"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            alerts_col = self.db["alerts"]
            alert_data["_id"] = str(uuid.uuid4())
            alert_data["created_at"] = datetime.utcnow()
            alert_data["is_read"] = False
            alert_data["read_at"] = None
            
            alerts_col.insert_one(alert_data)
            alert_data["id"] = alert_data["_id"]
            return convert_objectid(alert_data)
            
        except Exception as e:
            logger.error(f"Failed to create alert: {str(e)}")
            return None

    def get_alert(self, alert_id: str) -> Optional[Dict[str, Any]]:
        """Get an alert by ID"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            alerts_col = self.db["alerts"]
            alert = alerts_col.find_one({"_id": alert_id})
            if alert:
                alert["id"] = alert["_id"]
                return convert_objectid(alert)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get alert: {str(e)}")
            return None

    def get_alerts(self, limit: int = 50, unread_only: bool = False) -> List[Dict[str, Any]]:
        """Get all alerts"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            alerts_col = self.db["alerts"]
            query = {}
            if unread_only:
                query["is_read"] = False
            
            alerts = list(alerts_col.find(query).sort("created_at", DESCENDING).limit(limit))
            return convert_objectid(alerts)
            
        except Exception as e:
            logger.error(f"Failed to get alerts: {str(e)}")
            return []

    def mark_alert_read(self, alert_id: str) -> bool:
        """Mark an alert as read"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return False
                
            alerts_col = self.db["alerts"]
            result = alerts_col.update_one(
                {"_id": alert_id},
                {"$set": {"is_read": True, "read_at": datetime.utcnow()}}
            )
            return result.matched_count > 0
            
        except Exception as e:
            logger.error(f"Failed to mark alert as read: {str(e)}")
            return False

    def delete_alert(self, alert_id: str) -> bool:
        """Delete an alert"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return False
                
            alerts_col = self.db["alerts"]
            result = alerts_col.delete_one({"_id": alert_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Failed to delete alert: {str(e)}")
            return False
    
    # ── Plot Methods ──────────────────────────────────────────────────────
    
    def create_plot(self, plot_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new plot"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            plots_col = self.db["plots"]
            plot_data["_id"] = str(uuid.uuid4())
            
            plots_col.insert_one(plot_data)
            plot_data["id"] = plot_data["_id"]
            return convert_objectid(plot_data)
            
        except Exception as e:
            logger.error(f"Failed to create plot: {str(e)}")
            return None

    def get_plot(self, plot_id: str) -> Optional[Dict[str, Any]]:
        """Get a plot by ID"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            plots_col = self.db["plots"]
            plot = plots_col.find_one({"_id": plot_id})
            if plot:
                plot["id"] = plot["_id"]
                return convert_objectid(plot)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get plot: {str(e)}")
            return None

    def get_plots(self) -> List[Dict[str, Any]]:
        """Get all plots"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            plots_col = self.db["plots"]
            plots = list(plots_col.find())
            return convert_objectid(plots)
            
        except Exception as e:
            logger.error(f"Failed to get plots: {str(e)}")
            return []

    def update_plot(self, plot_id: str, update_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update a plot"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            plots_col = self.db["plots"]
            result = plots_col.update_one(
                {"_id": plot_id},
                {"$set": update_data}
            )
            
            if result.matched_count > 0:
                return self.get_plot(plot_id)
            return None
            
        except Exception as e:
            logger.error(f"Failed to update plot: {str(e)}")
            return None

    def delete_plot(self, plot_id: str) -> bool:
        """Delete a plot"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return False
                
            plots_col = self.db["plots"]
            result = plots_col.delete_one({"_id": plot_id})
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Failed to delete plot: {str(e)}")
            return False
    
    # ── Bot Status Methods ──────────────────────────────────────────────
    
    def update_bot_status(self, bot_status: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update bot status in MongoDB"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            status_col = self.db["bot_status"]
            bot_id = bot_status["bot_id"]
            bot_status["last_updated"] = datetime.utcnow()
            
            status_col.update_one(
                {"bot_id": bot_id},
                {"$set": bot_status},
                upsert=True
            )
            
            return convert_objectid(bot_status)
            
        except Exception as e:
            logger.error(f"Failed to update bot status: {str(e)}")
            return None
    
    def get_bot_status(self, bot_id: str) -> Optional[Dict[str, Any]]:
        """Get bot status by ID"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            status_col = self.db["bot_status"]
            status = status_col.find_one({"bot_id": bot_id})
            return convert_objectid(status)
            
        except Exception as e:
            logger.error(f"Failed to get bot status: {str(e)}")
            return None
    
    def get_all_bots_status(self) -> List[Dict[str, Any]]:
        """Get all bots status"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            status_col = self.db["bot_status"]
            statuses = list(status_col.find())
            return convert_objectid(statuses)
            
        except Exception as e:
            logger.error(f"Failed to get all bots status: {str(e)}")
            return []
    
    # ── Archive Methods ──────────────────────────────────────────────────
    
    def archive_task(self, task_id: str) -> bool:
        """Archive a completed task to history"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return False
                
            task = self.get_task(task_id)
            if not task:
                return False
            
            history_col = self.db["task_history"]
            task["archived_at"] = datetime.utcnow()
            history_col.insert_one(task)
            
            tasks_col = self.db["tasks"]
            tasks_col.delete_one({"_id": task_id})
            
            return True
            
        except Exception as e:
            logger.error(f"Failed to archive task: {str(e)}")
            return False
    
    def get_task_history(self, bot_id: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get task history"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            history_col = self.db["task_history"]
            query: Dict[str, Any] = {}
            if bot_id:
                query["bot_id"] = bot_id
            
            tasks = list(history_col.find(query).sort("archived_at", DESCENDING).limit(limit))
            return convert_objectid(tasks)
            
        except Exception as e:
            logger.error(f"Failed to get task history: {str(e)}")
            return []
    
    def disconnect(self) -> None:
        """Disconnect from MongoDB"""
        if self.client is not None:
            self.client.close()
            logger.info("Disconnected from MongoDB")

# Add to app/services/mongodb_service.py

    # ── History Methods ──────────────────────────────────────────────────────
    
    def create_history_entry(self, entry_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new history entry"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            history_col = self.db["history"]
            entry_data["_id"] = str(uuid.uuid4())
            entry_data["created_at"] = datetime.utcnow()
            
            history_col.insert_one(entry_data)
            entry_data["id"] = entry_data["_id"]
            return convert_objectid(entry_data)
            
        except Exception as e:
            logger.error(f"Failed to create history entry: {str(e)}")
            return None

    def get_history_entries(self, start_date: Optional[str] = None, end_date: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
        """Get history entries with optional date range"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            history_col = self.db["history"]
            query = {}
            
            if start_date and end_date:
                # Convert string dates to datetime for comparison
                try:
                    start = datetime.strptime(start_date, "%Y-%m-%d")
                    end = datetime.strptime(end_date, "%Y-%m-%d")
                    query["created_at"] = {"$gte": start, "$lte": end}
                except ValueError:
                    pass
            
            entries = list(history_col.find(query).sort("created_at", DESCENDING).limit(limit))
            return convert_objectid(entries)
            
        except Exception as e:
            logger.error(f"Failed to get history entries: {str(e)}")
            return []

    def get_history_by_date(self, date_str: str) -> Optional[Dict[str, Any]]:
        """Get history entry for a specific date"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            history_col = self.db["history"]
            # Try to find by date string
            entry = history_col.find_one({"date": date_str})
            if entry:
                entry["id"] = entry["_id"]
                return convert_objectid(entry)
            return None
            
        except Exception as e:
            logger.error(f"Failed to get history by date: {str(e)}")
            return None

    def get_weekly_activity(self, start_date: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get weekly activity data"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            # If no date provided, use last 7 days
            if not start_date:
                today = datetime.utcnow()
                start_date = (today - timedelta(days=7)).strftime("%Y-%m-%d")
            
            # Get activities from the last 7 days
            activities_col = self.db["bot_activities"]
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                end = start + timedelta(days=7)
                
                query = {"created_at": {"$gte": start, "$lte": end}}
                activities = list(activities_col.find(query).sort("created_at", ASCENDING))
                
                # Group by day
                day_names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
                result = []
                
                for i, day in enumerate(day_names):
                    day_date = start + timedelta(days=i)
                    day_activities = [a for a in activities if a.get("created_at", datetime.utcnow()).date() == day_date.date()]
                    
                    # Count activities by priority/type
                    high = sum(1 for a in day_activities if a.get("priority", "medium") == "high")
                    medium = sum(1 for a in day_activities if a.get("priority", "medium") == "medium")
                    low = sum(1 for a in day_activities if a.get("priority", "medium") == "low")
                    
                    result.append({
                        "day": day,
                        "low": low,
                        "medium": medium,
                        "high": high,
                        "date": day_date.strftime("%Y-%m-%d")
                    })
                
                return result
            except ValueError:
                # Return default weekly data if date parsing fails
                return [
                    {"day": "Mon", "low": 10, "medium": 20, "high": 15},
                    {"day": "Tue", "low": 8, "medium": 25, "high": 20},
                    {"day": "Wed", "low": 12, "medium": 18, "high": 22},
                    {"day": "Thu", "low": 15, "medium": 22, "high": 18},
                    {"day": "Fri", "low": 20, "medium": 15, "high": 10},
                    {"day": "Sat", "low": 18, "medium": 12, "high": 8},
                    {"day": "Sun", "low": 22, "medium": 20, "high": 15},
                ]
            
        except Exception as e:
            logger.error(f"Failed to get weekly activity: {str(e)}")
            return []

    def create_bot_activity(self, activity_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new bot activity"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            activities_col = self.db["bot_activities"]
            activity_data["_id"] = str(uuid.uuid4())
            activity_data["created_at"] = datetime.utcnow()
            
            activities_col.insert_one(activity_data)
            activity_data["id"] = activity_data["_id"]
            return convert_objectid(activity_data)
            
        except Exception as e:
            logger.error(f"Failed to create bot activity: {str(e)}")
            return None

    def get_bot_activities(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Get recent bot activities"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            activities_col = self.db["bot_activities"]
            activities = list(activities_col.find().sort("created_at", DESCENDING).limit(limit))
            return convert_objectid(activities)
            
        except Exception as e:
            logger.error(f"Failed to get bot activities: {str(e)}")
            return []

    def get_reports(self) -> List[Dict[str, Any]]:
        """Get available report types"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return []
                
            reports_col = self.db["reports"]
            reports = list(reports_col.find())
            return convert_objectid(reports)
            
        except Exception as e:
            logger.error(f"Failed to get reports: {str(e)}")
            return []

    def create_report(self, report_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Create a new report entry"""
        try:
            if self.db is None:
                logger.error("Database connection not established")
                return None
                
            reports_col = self.db["reports"]
            report_data["_id"] = str(uuid.uuid4())
            report_data["created_at"] = datetime.utcnow()
            
            reports_col.insert_one(report_data)
            report_data["id"] = report_data["_id"]
            return convert_objectid(report_data)
            
        except Exception as e:
            logger.error(f"Failed to create report: {str(e)}")
            return None

# Singleton instance
mongodb_service = MongoDBService()