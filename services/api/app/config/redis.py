"""
Redis Configuration
Redis connection and caching setup
"""

import redis
from typing import Optional
from app.config.config import settings


class RedisManager:
    """Redis connection manager for caching"""

    def __init__(self):
        self.redis_client = None
        self._connect()

    def _connect(self):
        """Establish Redis connection"""
        try:
            # Build connection pool with all settings
            connection_pool = redis.ConnectionPool.from_url(
                settings.redis_url,
                password=settings.redis_password,
                db=settings.redis_db,
                max_connections=settings.redis_max_connections,
                socket_timeout=settings.redis_socket_timeout,
                socket_connect_timeout=settings.redis_socket_connect_timeout,
                retry_on_timeout=settings.redis_retry_on_timeout,
                health_check_interval=settings.redis_health_check_interval,
                decode_responses=settings.redis_decode_responses,
            )

            self.redis_client = redis.Redis(connection_pool=connection_pool)

            # Test connection
            self.redis_client.ping()
            print("✅ Redis connection established")
        except Exception as e:
            print(f"❌ Redis connection failed: {e}")
            self.redis_client = None

    def get(self, key: str) -> Optional[str]:
        """Get value from Redis"""
        if not self.redis_client:
            return None

        try:
            return self.redis_client.get(key)
        except Exception as e:
            print(f"❌ Redis get error: {e}")
            return None

    def set(self, key: str, value: str, ttl: int = None) -> bool:
        """Set value in Redis with TTL"""
        if not self.redis_client:
            return False

        try:
            if ttl:
                return self.redis_client.setex(key, ttl, value)
            else:
                return self.redis_client.set(key, value)
        except Exception as e:
            print(f"❌ Redis set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete key from Redis"""
        if not self.redis_client:
            return False

        try:
            return self.redis_client.delete(key)
        except Exception as e:
            print(f"❌ Redis delete error: {e}")
            return False

    def exists(self, key: str) -> bool:
        """Check if key exists in Redis"""
        if not self.redis_client:
            return False

        try:
            return self.redis_client.exists(key)
        except Exception as e:
            print(f"❌ Redis exists error: {e}")
            return False

    def close(self):
        """Close Redis connection"""
        if self.redis_client:
            self.redis_client.close()


# Global Redis instance
redis_manager = RedisManager()
