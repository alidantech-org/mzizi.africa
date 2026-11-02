"""
Async wrapper for web search scraper to handle asyncio issues
"""

import asyncio
from pathlib import Path
from app.services.web_search_scraper.core_async import AsyncWebSearchScraper
from app.services.web_search_scraper import SearchConfig


class AsyncWebSearchScraper:
    """Async wrapper for WebSearchScraper"""

    def __init__(self, config: SearchConfig = None, search_engine: str = "duckduckgo"):
        self.scraper = AsyncWebSearchScraper(config, search_engine)

    async def scrape_from_csv(
        self,
        csv_path: str,
        output_dir: str = "_data/output/web_search",
        csv_name: str = None,
    ):
        """Async wrapper for scrape_from_csv"""
        return await self.scraper.scrape_from_csv(csv_path, output_dir, csv_name)

    def run_scrape_from_csv(
        self,
        csv_path: str,
        output_dir: str = "_data/output/web_search",
        csv_name: str = None,
    ):
        """Run async scrape_from_csv in sync context"""
        return asyncio.run(self.scrape_from_csv(csv_path, output_dir, csv_name))
