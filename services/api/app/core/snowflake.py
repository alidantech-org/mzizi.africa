import time
import threading

class SnowflakeGenerator:
    """
    Snowflake ID generator - creates better-than-auto-increment integers.
    Structure: 64-bit integer
    - 41 bits: timestamp (milliseconds since epoch)
    - 10 bits: worker/machine ID (0-1023)
    - 12 bits: sequence number (0-4095)
    """
    
    def __init__(self, worker_id: int = 1):
        if worker_id < 0 or worker_id > 1023:
            raise ValueError("Worker ID must be between 0 and 1023")
        
        self.worker_id = worker_id
        self.sequence = 0
        self.last_timestamp = -1
        self.lock = threading.Lock()
        
        # Snowflake epoch (custom epoch)
        self.epoch = 1609459200000  # 2021-01-01 00:00:00 UTC
    
    def _current_timestamp(self) -> int:
        return int(time.time() * 1000)
    
    def _wait_next_millis(self, last_timestamp: int) -> int:
        timestamp = self._current_timestamp()
        while timestamp <= last_timestamp:
            timestamp = self._current_timestamp()
        return timestamp
    
    def next_id(self) -> int:
        with self.lock:
            timestamp = self._current_timestamp()
            
            if timestamp < self.last_timestamp:
                raise ValueError("Clock moved backwards!")
            
            if timestamp == self.last_timestamp:
                self.sequence = (self.sequence + 1) & 0xFFF
                if self.sequence == 0:
                    timestamp = self._wait_next_millis(self.last_timestamp)
            else:
                self.sequence = 0
            
            self.last_timestamp = timestamp
            
            # Shift bits to create the ID
            snowflake_id = (
                ((timestamp - self.epoch) << 22) |
                (self.worker_id << 12) |
                self.sequence
            )
            
            return snowflake_id

# Global instance
snowflake = SnowflakeGenerator(worker_id=1)
