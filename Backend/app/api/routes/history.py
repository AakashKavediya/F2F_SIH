from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from pydantic import BaseModel, Field
from app.services.mongodb_service import mongodb_service
from app.config.logging_config import logger
import traceback
import uuid

router = APIRouter()

# ── History Routes ──────────────────────────────────────────────────────

class HistoryEntryCreate(BaseModel):
    day: str = Field(..., description="Day name")
    date: str = Field(..., description="Date string")
    score: int = Field(..., ge=0, le=100)
    status: str = Field(..., description="Status: excellent, good, needs_attention")
    soil_moisture: Optional[int] = None
    temperature: Optional[int] = None
    crop_health: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

@router.post("/history")
async def create_history_entry(entry: HistoryEntryCreate):
    """Create a new history entry"""
    try:
        entry_data = entry.model_dump()
        # Determine color based on status
        status_colors = {
            "excellent": "#D8F0D1",
            "good": "#F4EDC8",
            "needs_attention": "#FFD3D3"
        }
        entry_data["score_color"] = status_colors.get(entry.status, "#F0F0F0")
        
        result = mongodb_service.create_history_entry(entry_data)
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create history entry")
        
        return {"success": True, "message": "History entry created", "data": result}
        
    except Exception as e:
        logger.error(f"Error creating history entry: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    limit: int = Query(50, ge=1, le=100)
):
    """Get history entries with optional date range"""
    try:
        entries = mongodb_service.get_history_entries(start_date, end_date, limit)
        return {"success": True, "data": entries, "count": len(entries)}
        
    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history/{date}")
async def get_history_by_date(date: str):
    """Get history entry for a specific date"""
    try:
        entry = mongodb_service.get_history_by_date(date)
        if not entry:
            raise HTTPException(status_code=404, detail="No history found for this date")
        
        return {"success": True, "data": entry}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting history by date: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Weekly Activity Routes ─────────────────────────────────────────────

@router.get("/weekly-activity")
async def get_weekly_activity(start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)")):
    """Get weekly activity data"""
    try:
        data = mongodb_service.get_weekly_activity(start_date)
        return {"success": True, "data": data}
        
    except Exception as e:
        logger.error(f"Error getting weekly activity: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Bot Activity Routes ────────────────────────────────────────────────

class BotActivityCreate(BaseModel):
    title: str = Field(..., description="Activity title")
    subtitle: str = Field(..., description="Activity subtitle")
    icon: str = Field("leaf-outline", description="Icon name")
    icon_background_color: str = Field("#E8F5E9", description="Icon background color")
    details: Optional[List[str]] = Field(default_factory=list)
    bot_id: Optional[str] = None
    priority: str = Field("medium", description="Activity priority")

@router.post("/bot-activities")
async def create_bot_activity(activity: BotActivityCreate):
    """Create a new bot activity"""
    try:
        activity_data = activity.model_dump()
        result = mongodb_service.create_bot_activity(activity_data)
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create bot activity")
        
        return {"success": True, "message": "Bot activity created", "data": result}
        
    except Exception as e:
        logger.error(f"Error creating bot activity: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/bot-activities")
async def get_bot_activities(limit: int = Query(50, ge=1, le=100)):
    """Get recent bot activities"""
    try:
        activities = mongodb_service.get_bot_activities(limit)
        return {"success": True, "data": activities, "count": len(activities)}
        
    except Exception as e:
        logger.error(f"Error getting bot activities: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Report Routes ──────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    title: str = Field(..., description="Report title")
    description: str = Field(..., description="Report description")
    type: str = Field("pdf", description="Report type")
    data: Optional[Dict[str, Any]] = None

@router.post("/reports")
async def create_report(report: ReportCreate):
    """Create a new report"""
    try:
        report_data = report.model_dump()
        report_data["generated_at"] = datetime.utcnow().isoformat()
        result = mongodb_service.create_report(report_data)
        if not result:
            raise HTTPException(status_code=500, detail="Failed to create report")
        
        return {"success": True, "message": "Report created", "data": result}
        
    except Exception as e:
        logger.error(f"Error creating report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports")
async def get_reports():
    """Get available reports"""
    try:
        reports = mongodb_service.get_reports()
        return {"success": True, "data": reports, "count": len(reports)}
        
    except Exception as e:
        logger.error(f"Error getting reports: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/export/{report_type}")
async def export_report(
    report_type: str,
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)")
):
    """Export report data in specified format"""
    try:
        # Get history data for the report
        history = mongodb_service.get_history_entries(start_date, end_date, 100)
        activities = mongodb_service.get_bot_activities(50)
        weekly = mongodb_service.get_weekly_activity(start_date)
        
        # Calculate statistics
        if history:
            scores = [h.get("score", 0) for h in history if h.get("score")]
            avg_score = sum(scores) / len(scores) if scores else 0
            max_score = max(scores) if scores else 0
            min_score = min(scores) if scores else 0
        else:
            avg_score = max_score = min_score = 0
        
        report_data = {
            "report_type": report_type,
            "generated_at": datetime.utcnow().isoformat(),
            "period": {
                "start": start_date or "N/A",
                "end": end_date or "N/A"
            },
            "summary": {
                "average_score": round(avg_score, 2),
                "max_score": max_score,
                "min_score": min_score,
                "total_activities": len(activities),
                "history_entries": len(history)
            },
            "history": history,
            "activities": activities,
            "weekly_activity": weekly
        }
        
        return {
            "success": True,
            "data": report_data,
            "message": f"Report '{report_type}' generated successfully"
        }
        
    except Exception as e:
        logger.error(f"Error exporting report: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))

# ── Seed Data Route ────────────────────────────────────────────────────

@router.post("/seed")
async def seed_history_data():
    """Seed the database with sample history data"""
    try:
        # Generate 2 months of history data
        from datetime import datetime, timedelta
        import random
        
        today = datetime.utcnow()
        history_entries = []
        bot_activities = []
        
        statuses = ["excellent", "good", "needs_attention"]
        status_colors = {
            "excellent": "#D8F0D1",
            "good": "#F4EDC8",
            "needs_attention": "#FFD3D3"
        }
        
        # Generate history entries for the last 60 days
        for i in range(60, 0, -1):
            date = today - timedelta(days=i)
            day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            day_name = day_names[date.weekday()]
            
            # Generate realistic scores
            base_score = random.randint(60, 95)
            # Add some variation
            score = min(100, max(40, base_score + random.randint(-15, 15)))
            
            if score >= 80:
                status = "excellent"
            elif score >= 60:
                status = "good"
            else:
                status = "needs_attention"
            
            entry = {
                "day": "Today" if i == 1 else ("Yesterday" if i == 2 else day_name),
                "date": date.strftime("%d %B %Y"),
                "score": score,
                "status": status,
                "score_color": status_colors[status],
                "soil_moisture": random.randint(40, 85),
                "temperature": random.randint(25, 38),
                "crop_health": "Good" if score >= 60 else "Needs Attention",
                "details": {
                    "rainfall": round(random.uniform(0, 15), 1),
                    "humidity": random.randint(40, 80),
                    "wind_speed": round(random.uniform(0, 25), 1)
                }
            }
            history_entries.append(entry)
        
        # Insert history entries
        for entry in history_entries:
            mongodb_service.create_history_entry(entry)
        
        # Generate bot activities
        activity_templates = [
            {
                "title": "Bot completed field scan",
                "icon": "bug-outline",
                "icon_background_color": "#E8F5E9",
                "priority": "high"
            },
            {
                "title": "Bot completed watering",
                "icon": "water-outline",
                "icon_background_color": "#E3F2FD",
                "priority": "medium"
            },
            {
                "title": "Bot completed field scan",
                "icon": "camera-outline",
                "icon_background_color": "#FFF3E0",
                "priority": "low"
            },
            {
                "title": "Bot completed field scan",
                "icon": "leaf-outline",
                "icon_background_color": "#E8F5E9",
                "priority": "medium"
            },
            {
                "title": "Disease detection completed",
                "icon": "medkit-outline",
                "icon_background_color": "#FFEBEE",
                "priority": "high"
            },
            {
                "title": "Sensor reading completed",
                "icon": "speedometer-outline",
                "icon_background_color": "#E8EAF6",
                "priority": "medium"
            }
        ]
        
        fields = ["Field A", "Field B", "Field C", "Plot A", "Plot B"]
        times = ["9:15am", "10:45am", "2:30pm", "4:00pm", "11:00am"]
        
        for i in range(30):
            template = random.choice(activity_templates)
            field = random.choice(fields)
            time = random.choice(times)
            date = today - timedelta(days=random.randint(0, 30))
            
            activity = {
                "title": template["title"],
                "subtitle": f"{field} | {time} | {date.strftime('%d %b')}",
                "icon": template["icon"],
                "icon_background_color": template["icon_background_color"],
                "priority": template["priority"],
                "bot_id": f"bot_{random.randint(1, 3)}",
                "details": [
                    f"Area covered: {round(random.uniform(1.5, 5.0), 1)} acres",
                    f"Duration: {random.randint(15, 60)} minutes",
                    f"Status: {'Complete' if random.random() > 0.2 else 'In Progress'}"
                ]
            }
            bot_activities.append(activity)
        
        # Insert bot activities
        for activity in bot_activities:
            mongodb_service.create_bot_activity(activity)
        
        # Create report types
        reports = [
            {
                "title": "Farm Health Report",
                "description": "Summary of farm health and score for the week",
                "type": "pdf"
            },
            {
                "title": "Soil Analysis Report",
                "description": "Weekly soil analysis and recommendations",
                "type": "pdf"
            },
            {
                "title": "Crop Yield Report",
                "description": "Monthly yield statistics and forecast",
                "type": "pdf"
            },
            {
                "title": "Weather Impact Report",
                "description": "Weather analysis and recommendations",
                "type": "pdf"
            },
            {
                "title": "Complete Farm Summary",
                "description": "Full farm report with all metrics",
                "type": "pdf"
            }
        ]
        
        for report in reports:
            mongodb_service.create_report(report)
        
        return {
            "success": True,
            "message": "History data seeded successfully",
            "history_entries": len(history_entries),
            "bot_activities": len(bot_activities),
            "reports": len(reports)
        }
        
    except Exception as e:
        logger.error(f"Error seeding history data: {str(e)}\n{traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))