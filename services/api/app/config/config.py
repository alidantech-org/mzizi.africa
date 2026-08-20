"""
Production Environment Variables
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # Database settings
    database_url: str
    redis_url: str
    mongodb_url: Optional[str] = None

    # S3 settings
    s3_endpoint: str
    s3_access_key: str
    s3_secret_key: str
    s3_files_bucket: str
    s3_public_url_base: str

    # Redis settings
    redis_password: Optional[str] = None
    redis_db: int = 0
    redis_max_connections: int = 10
    redis_decode_responses: bool = True
    redis_socket_timeout: int = 5
    redis_socket_connect_timeout: int = 5
    redis_retry_on_timeout: bool = True
    redis_health_check_interval: int = 30

    # JWT settings
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    # Application settings
    environment: str = "production"
    debug: bool = False
    log_level: str = "INFO"
    api_v1_str: str = "/"
    allowed_origins: Optional[str] = None

    # File upload settings
    max_file_size: str = "100MB"
    upload_dir: Optional[str] = None

    # Rate limiting
    rate_limit_per_minute: int = 60
    rate_limit_burst: int = 10

    # Monitoring
    prometheus_enabled: bool = False
    sentry_dsn: Optional[str] = None

    # Email settings
    smtp_host: Optional[str] = None
    smtp_port: Optional[int] = None
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None

    # Mistral AI settings
    mistral_url: Optional[str] = None
    mistral_api_key: Optional[str] = None

    # Blockchain settings
    blockchain_enabled: bool = False
    ethereum_rpc_url: Optional[str] = None
    contract_address: Optional[str] = None

    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields from .env to prevent errors


settings = Settings()
