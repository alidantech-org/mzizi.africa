"""
Web Search Scraper Package - Search engine scraping with Playwright, markdown output, and screenshots
"""

from .core import WebSearchScraper
from .config import SearchConfig

__version__ = "1.0.0"
__all__ = ["WebSearchScraper", "SearchConfig"]
