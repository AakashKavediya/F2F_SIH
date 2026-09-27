# Export all route modules
from . import agrobot
from . import tasks
from . import map as map_routes
from . import models as model_routes
from . import crop_recommendation
from . import crop_yield
from . import irrigation
from . import fertilizer
from . import disease
from . import soil_analysis  # Add new model

__all__ = [
    'agrobot', 
    'tasks', 
    'map_routes', 
    'model_routes',
    'crop_recommendation', 
    'crop_yield', 
    'irrigation', 
    'fertilizer', 
    'disease',
    'soil_analysis'  # Add new model
]