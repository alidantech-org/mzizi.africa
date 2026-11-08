from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from .config import settings
import logging
import colorlog

# Set up colored logging
handler = colorlog.StreamHandler()
handler.setFormatter(colorlog.ColoredFormatter(
    '%(log_color)s%(levelname)-8s%(reset)s %(blue)s%(name)s%(reset)s - %(message)s',
    log_colors={
        'DEBUG': 'cyan',
        'INFO': 'green',
        'WARNING': 'yellow',
        'ERROR': 'red',
        'CRITICAL': 'red,bg_white',
    }
))

# Configure SQLAlchemy logger - DISABLED to prevent query logging
sqlalchemy_logger = logging.getLogger('sqlalchemy.engine')
sqlalchemy_logger.addHandler(handler)
sqlalchemy_logger.setLevel(logging.WARNING)  # Only show warnings and errors, not queries

# Configure app database logger
logger = colorlog.getLogger(__name__)
logger.addHandler(handler)
logger.setLevel(logging.INFO)

# Log database connection attempt
logger.info(f"Attempting to connect to database: {settings.database_url}")

try:
    engine = create_engine(settings.database_url, echo=False)  # echo=False to disable SQL query logging
    logger.info("Database engine created successfully")
    
    # Test connection
    with engine.connect() as connection:
        logger.info("Database connection test successful")
        
except Exception as e:
    logger.error(f"Database connection failed: {str(e)}")
    raise

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
