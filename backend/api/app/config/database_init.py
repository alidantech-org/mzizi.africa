"""
Database Initialization Module
Handles database table creation and model registration
"""

from sqlalchemy import inspect
from .database import engine, Base


def create_database_tables():
    """
    Create all database tables if they don't exist
    
    Returns:
        tuple: (success: bool, tables: list, error: str or None)
    """
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        # Get list of created tables
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        return True, tables, None
        
    except Exception as e:
        return False, [], str(e)


def get_database_status():
    """
    Get current database connection status and table information
    
    Returns:
        dict: Database status information
    """
    try:
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        return {
            "status": "connected",
            "tables_count": len(tables),
            "tables": tables
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "error": str(e)
        }
