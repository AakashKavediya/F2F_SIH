from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import ALLOWED_ORIGINS
from app.config.logging_config import logger

def setup_middleware(app):
    """Setup CORS and exception handlers"""
    
    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
        max_age=600,
    )
    
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception: {type(exc).__name__}: {str(exc)}")
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred."}
        )