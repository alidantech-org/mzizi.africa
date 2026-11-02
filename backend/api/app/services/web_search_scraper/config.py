"""
Configuration for Web Search Scraper
"""

from dataclasses import dataclass
from typing import Optional
import random


@dataclass
class SearchConfig:
    """Configuration for search scraper"""

    # Browser settings
    headless: bool = True
    browser_type: str = "chromium"  # chromium, firefox, webkit

    # Search settings
    max_results_per_query: int = 20
    max_pages_to_visit: int = 5
    delay_between_requests: float = 2.0
    random_delay: bool = True  # Add random variation to delays
    min_delay: float = 1.0
    max_delay: float = 4.0
    skip_cloudflare_sites: bool = False  # Skip sites with Cloudflare challenges
    cloudflare_wait_time: int = 30000  # Time to wait for Cloudflare (ms)

    # Screenshot settings
    take_screenshots: bool = True
    screenshot_format: str = "png"  # png or jpeg
    full_page_screenshot: bool = True

    # Output settings
    output_format: str = "markdown"  # markdown, json, both
    save_html: bool = False

    # Anti-detection settings
    user_agent: Optional[str] = None
    viewport_width: int = 1920
    viewport_height: int = 1080
    use_real_chrome: bool = False  # Use real Chrome instead of Chromium
    chrome_channel: str = "chrome"  # chrome, msedge, chrome-beta
    brave_executable_path: Optional[str] = None  # Path to Brave browser executable

    # Timeout settings
    navigation_timeout: int = 60000  # 60 seconds
    wait_timeout: int = 20000  # 20 seconds

    # Browser persistence settings
    keep_browser_open: bool = False  # Keep browser open after completion
    retain_tabs: bool = True  # Keep search result tabs open
    delay_after_failure: float = 5.0  # Delay after failed requests

    # Debug settings
    save_html_snapshots: bool = (
        True  # Save HTML snapshots of search results for debugging
    )

    def __post_init__(self):
        """Set default user agent if not provided"""
        if not self.user_agent:
            # Rotate between different user agents
            import random

            user_agents = [
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15",
            ]
            self.user_agent = random.choice(user_agents)
