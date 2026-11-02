"""
Core Web Search Scraper - Async Version
"""

import logging
import time
import csv
import random
from pathlib import Path
from typing import List, Dict, Any, Optional
from playwright.async_api import async_playwright, Browser, BrowserContext, Page

from .config import SearchConfig
from .search_engines import GoogleSearchEngine, DuckDuckGoSearchEngine, BingSearchEngine
from .markdown_formatter import MarkdownFormatter
from .pdf_downloader import PDFDownloader
from .http_scraper import HTTPScraper
from .constituency_crawler import ConstituencyCrawler
from .table_extractor import TableExtractor
from .anti_detection import AntiDetectionEngine
from .browser_trust_manager_new import BrowserTrustManager


class AsyncWebSearchScraper:
    """Main web search scraper using Playwright Async API"""

    def __init__(
        self, config: Optional[SearchConfig] = None, search_engine: str = "duckduckgo"
    ):
        """
        Initialize the web search scraper

        Args:
            config: SearchConfig instance
            search_engine: Search engine to use ('google' or 'duckduckgo')
        """
        self.config = config or SearchConfig()
        self.logger = logging.getLogger(__name__)

        # Initialize search engine
        if search_engine.lower() == "google":
            self.search_engine = GoogleSearchEngine(self.config)
        elif search_engine.lower() == "duckduckgo":
            self.search_engine = DuckDuckGoSearchEngine(self.config)
        elif search_engine.lower() == "bing":
            self.search_engine = BingSearchEngine(self.config)
        else:
            raise ValueError(f"Unsupported search engine: {search_engine}")

        self.formatter = MarkdownFormatter()
        self.pdf_downloader = PDFDownloader(max_workers=3)
        self.http_scraper = HTTPScraper(
            delay_range=(10, 20)
        )  # Slower for government sites
        self.constituency_crawler = ConstituencyCrawler()
        self.table_extractor = TableExtractor()
        self.anti_detection = AntiDetectionEngine()
        self.trust_manager = BrowserTrustManager()
        self.playwright = None
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

        logging.basicConfig(level=logging.INFO)
        self.logger.info(
            f"Initialized Web Search Scraper with {self.search_engine.get_engine_name()}"
        )

    async def start_browser(self):
        """Start Playwright browser with advanced anti-detection"""
        try:
            self.playwright = await async_playwright().start()

            # Use stealth launch arguments if enabled
            if self.config.enable_stealth:
                launch_args = self.anti_detection.get_stealth_launch_args()
            else:
                launch_args = ["--disable-blink-features=AutomationControlled"]

            if self.config.browser_type == "chromium":
                if self.config.brave_executable_path:
                    # Use Brave browser
                    self.logger.info(
                        f"Using Brave browser: {self.config.brave_executable_path}"
                    )
                    self.browser = await self.playwright.chromium.launch(
                        headless=self.config.headless,
                        executable_path=self.config.brave_executable_path,
                        args=launch_args,
                    )
                elif self.config.use_real_chrome:
                    # Use real Chrome browser
                    self.browser = await self.playwright.chromium.launch(
                        headless=self.config.headless,
                        channel=self.config.chrome_channel,
                        args=launch_args,
                    )
                else:
                    self.browser = await self.playwright.chromium.launch(
                        headless=self.config.headless, args=launch_args
                    )
            elif self.config.browser_type == "firefox":
                self.browser = await self.playwright.firefox.launch(
                    headless=self.config.headless,
                    args=["--disable-blink-features=AutomationControlled"],
                )
            elif self.config.browser_type == "webkit":
                self.browser = await self.playwright.webkit.launch(
                    headless=self.config.headless
                )
            else:
                raise ValueError(
                    f"Unsupported browser type: {self.config.browser_type}"
                )

            # Create stealth context if enabled, otherwise basic context
            if self.config.enable_stealth:
                self.context = self.anti_detection.create_stealth_context(
                    self.browser, self.config.headless
                )
                stealth_status = "with stealth features"
            else:
                self.context = await self.browser.new_context(
                    user_agent=self.config.user_agent,
                    viewport=None,
                    ignore_https_errors=True,
                )
                stealth_status = "without stealth features"

            # Load browser trust profile
            profile_name = (
                f"scraper_profile_{self.search_engine.get_engine_name().lower()}"
            )
            if self.config.enable_stealth:
                await self.trust_manager.load_profile_to_context(
                    self.context, profile_name
                )
                stealth_status += " + trust profile"

            self.logger.info(
                f"Browser started {stealth_status}: {self.config.browser_type} (headless={self.config.headless})"
            )

        except Exception as e:
            self.logger.error(f"Error starting browser: {e}")
            raise

    async def close_browser(self):
        """Close Playwright browser"""
        try:
            if self.context:
                try:
                    await self.context.close()
                except Exception:
                    pass
            if self.browser:
                try:
                    await self.browser.close()
                except Exception:
                    pass
            if self.playwright:
                try:
                    await self.playwright.stop()
                except Exception:
                    pass

            self.logger.info("Browser closed")
        except Exception as e:
            self.logger.error(f"Error closing browser: {e}")

    async def search_query(self, query: str) -> List[Dict[str, Any]]:
        """
        Perform a search query

        Args:
            query: Search query string

        Returns:
            List of search results
        """
        if not self.browser:
            await self.start_browser()

        try:
            # Use query exactly as provided from CSV
            self.logger.info(f"Searching for: {query}")

            page = await self.context.new_page()
            
            # Warm up browser with realistic activity if stealth is enabled
            if self.config.enable_stealth:
                profile_name = f"scraper_profile_{self.search_engine.get_engine_name().lower()}"
                await self.trust_manager.warm_up_browser(page, profile_name)
            
            results = self.search_engine.search(page, query)

            # Keep tab open if configured
            if not self.config.retain_tabs:
                await page.close()

            return results

        except Exception as e:
            self.logger.error(f"Error searching for '{query}': {e}")
            # Add delay after failure
            if self.config.delay_after_failure > 0:
                self.logger.info(
                    f"Waiting {self.config.delay_after_failure}s after failure..."
                )
                time.sleep(self.config.delay_after_failure)
            return []

    async def scrape_page(
        self,
        url: str,
        output_dir: Path,
        query_name: str,
        page_index: int,
        keywords: List[str] = None,
    ) -> Dict[str, Any]:
        """
        Scrape a single page with automatic fallback to HTTP scraper

        Args:
            url: URL to scrape
            output_dir: Output directory
            query_name: Name of the query (for file naming)
            page_index: Index of the page
            keywords: Keywords for site search

        Returns:
            Dictionary with scraping results
        """
        # Try browser-based scraping first
        result = await self._scrape_with_browser(
            url, output_dir, query_name, page_index, keywords
        )

        # Check if browser scraping failed due to blocking/timeout
        if not result["success"] and result.get("error"):
            error_msg = str(result.get("error", "")).lower()

            # Detect errors that indicate blocking or network issues
            should_fallback = any(
                [
                    "timeout" in error_msg,
                    "err_name_not_resolved" in error_msg,
                    "cloudflare" in error_msg,
                    "net::" in error_msg,
                    "blocked" in error_msg,
                ]
            )

            if should_fallback:
                self.logger.warning(
                    f"Browser scraping failed, trying HTTP fallback for {url}"
                )
                result = await self._scrape_with_http(url, output_dir, query_name, page_index)

        return result

    async def _scrape_with_browser(
        self,
        url: str,
        output_dir: Path,
        query_name: str,
        page_index: int,
        keywords: List[str] = None,
    ) -> Dict[str, Any]:
        """Scrape using Playwright browser"""
        if not self.browser:
            await self.start_browser()

        result = {
            "url": url,
            "success": False,
            "title": "",
            "metadata": {},
            "content": "",
            "tables": [],
            "screenshot": None,
            "markdown_file": None,
            "pdfs": [],
            "method": "browser",
        }

        try:
            page = await self.context.new_page()

            # Simulate human behavior if enabled
            if self.config.enable_stealth and self.config.human_delays:
                self.anti_detection.simulate_human_behavior(page)

            # Navigate to page
            self.logger.info(f"[BROWSER] Scraping: {url}")
            await page.goto(
                url, wait_until="networkidle", timeout=self.config.navigation_timeout
            )

            # Wait for content to load with realistic delay if enabled
            if self.config.human_delays:
                realistic_delay = self.anti_detection.add_realistic_delays(2.0)
                await page.wait_for_timeout(int(realistic_delay * 1000))
            else:
                await page.wait_for_timeout(2000)

            # Enhanced Cloudflare detection and handling
            if await self._is_cloudflare_challenge(page):
                self.logger.warning(f"Cloudflare challenge detected on {url}")

                # Skip if configured to do so
                if self.config.skip_cloudflare_sites:
                    self.logger.warning(f"Skipping Cloudflare-protected site: {url}")
                    result["error"] = "Cloudflare challenge - skipped"
                    await page.close()
                    return result

                # Use advanced Cloudflare handling if stealth is enabled
                if self.config.enable_stealth:
                    if not self.anti_detection.wait_for_cloudflare_challenge(
                        page, self.config.cloudflare_wait_time
                    ):
                        # Try manual CAPTCHA handling if enabled
                        if self.config.manual_captcha:
                            if not self.anti_detection.handle_captcha_manually(page, 60000):
                                self.logger.error(f"Failed to bypass Cloudflare challenge on {url}")
                                result["error"] = "Cloudflare challenge failed"
                                await page.close()
                                return result
                        else:
                            self.logger.error(f"Failed to bypass Cloudflare challenge on {url}")
                            result["error"] = "Cloudflare challenge failed"
                            await page.close()
                            return result
                else:
                    # Basic Cloudflare handling
                    self.logger.info("Waiting for Cloudflare challenge (basic mode)...")
                    await page.wait_for_timeout(30000)

            # Additional human behavior simulation if enabled
            if self.config.enable_stealth and self.config.human_delays:
                self.anti_detection.simulate_human_behavior(page)

            # Try to use site search if keywords provided
            if keywords:
                self.search_engine.search_on_page(page, keywords)
                await page.wait_for_timeout(2000)

            # Extract metadata
            metadata = self.search_engine.extract_metadata(page)
            result["metadata"] = metadata
            result["title"] = metadata.get("title", "Untitled")

            # Extract content
            content = self.search_engine.extract_text_content(page)
            result["content"] = content

            # Create safe filename
            safe_name = "".join(
                c for c in query_name if c.isalnum() or c in (" ", "-", "_")
            ).strip()
            safe_name = safe_name.replace(" ", "_")[:50]

            # Extract tables using new TableExtractor if enabled
            if self.config.extract_tables_as_csv:
                self.table_extractor.output_dir = output_dir
                tables_info = self.table_extractor.extract_tables_as_csv(page, safe_name)
                
                # Convert to legacy format for compatibility
                tables_markdown = [table["markdown"] for table in tables_info]
                result["tables"] = tables_markdown
                result["tables_info"] = tables_info  # New detailed info with CSV paths
            else:
                # Use legacy table extraction
                tables = self.search_engine.extract_tables(page)
                result["tables"] = tables
                result["tables_info"] = []

            # Take screenshot
            if self.config.take_screenshots:
                screenshot_filename = (
                    f"{safe_name}_page{page_index}.{self.config.screenshot_format}"
                )
                screenshot_path = output_dir / "screenshots" / screenshot_filename
                screenshot_path.parent.mkdir(parents=True, exist_ok=True)

                if self.search_engine.take_screenshot(page, str(screenshot_path)):
                    result["screenshot"] = str(screenshot_path)

            # Save as markdown
            if self.config.output_format in ["markdown", "both"]:
                markdown_filename = f"{safe_name}_page{page_index}.md"
                markdown_path = output_dir / "pages" / markdown_filename
                markdown_path.parent.mkdir(parents=True, exist_ok=True)

                markdown_content = self.formatter.format_page_content(
                    url,
                    metadata,
                    content,
                    tables=result.get("tables", []),
                    screenshot_path=result.get("screenshot"),
                )

                if self.formatter.save_markdown(markdown_content, str(markdown_path)):
                    result["markdown_file"] = str(markdown_path)

            # Detect and download PDFs (non-blocking)
            pdf_links = self.search_engine.detect_pdf_links(page)
            if pdf_links:
                pdf_dir = output_dir / "pdfs"
                pdf_results = self.pdf_downloader.download_pdfs(pdf_links, pdf_dir)
                result["pdfs"] = pdf_results

            result["success"] = True
            await page.close()

        except Exception as e:
            error_str = str(e)
            self.logger.error(f"[BROWSER] Error scraping {url}: {error_str}")
            result["error"] = error_str

        return result

    async def _scrape_with_http(
        self,
        url: str,
        output_dir: Path,
        query_name: str,
        page_index: int,
    ) -> Dict[str, Any]:
        """Scrape using HTTP requests (fallback method)"""
        self.logger.info(f"[HTTP] Attempting HTTP scrape: {url}")

        # Use HTTP scraper
        http_result = self.http_scraper.scrape_page(url)

        # Convert to our result format
        result = {
            "url": url,
            "success": http_result["success"],
            "title": http_result.get("title", ""),
            "metadata": {"title": http_result.get("title", "")},
            "content": http_result.get("content", ""),
            "tables": http_result.get("tables", []),
            "tables_info": [],  # Will be populated below
            "screenshot": None,
            "markdown_file": None,
            "pdfs": [],
            "method": "http",
            "error": http_result.get("error"),
        }

        if result["success"]:
            # Create safe filename
            safe_name = "".join(
                c for c in query_name if c.isalnum() or c in (" ", "-", "_")
            ).strip()
            safe_name = safe_name.replace(" ", "_")[:50]

            # Extract tables from HTML content using new TableExtractor if enabled
            if self.config.extract_tables_as_csv:
                self.table_extractor.output_dir = output_dir
                tables_info = self.table_extractor.extract_tables_from_html_content(
                    http_result.get("content", ""), safe_name
                )
                
                # Update result with table information
                result["tables_info"] = tables_info
                result["tables"] = [table["markdown"] for table in tables_info]
            else:
                # Use legacy table extraction from HTTP scraper
                result["tables_info"] = []
                result["tables"] = http_result.get("tables", [])

        if result["success"]:
            # Save as markdown
            if self.config.output_format in ["markdown", "both"]:
                markdown_filename = f"{safe_name}_page{page_index}_http.md"
                markdown_path = output_dir / "pages" / markdown_filename
                markdown_path.parent.mkdir(parents=True, exist_ok=True)

                markdown_content = self.formatter.format_page_content(
                    url,
                    result["metadata"],
                    result["content"],
                    tables=result.get("tables", []),
                    screenshot_path=None,
                )

                if self.formatter.save_markdown(markdown_content, str(markdown_path)):
                    result["markdown_file"] = str(markdown_path)
                    self.logger.info(f"✓ [HTTP] Successfully scraped and saved: {url}")

        return result

    async def _is_cloudflare_challenge(self, page: Page) -> bool:
        """Check if page is showing Cloudflare challenge"""
        try:
            page_text = await page.inner_text("body")
            page_text = page_text.lower()
            cloudflare_indicators = [
                "checking your browser",
                "cloudflare",
                "security verification",
                "verify you are not a bot",
                "challenges.cloudflare.com",
                "just a moment",
            ]
            return any(indicator in page_text for indicator in cloudflare_indicators)
        except:
            return False

    async def scrape_from_csv(
        self,
        csv_path: Path,
        output_dir: Path = Path("_data/output/web_search"),
        csv_name: str = None,
    ) -> Dict[str, Any]:
        """
        Scrape from a CSV file containing search queries

        Args:
            csv_path: Path to CSV file with queries
            output_dir: Output directory for results
            csv_name: Name of the CSV file

        Returns:
            Dictionary with all results
        """
        csv_path = Path(csv_path)
        output_dir = Path(output_dir)

        # Use CSV filename for grouping if not provided
        if not csv_name:
            csv_name = csv_path.stem  # Get filename without extension

        if not csv_path.exists():
            self.logger.error(f"CSV file not found: {csv_path}")
            return {}

        try:
            await self.start_browser()

            # Read CSV
            with open(csv_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                queries = list(reader)

            self.logger.info(f"Processing {len(queries)} queries from {csv_path.name}")

            all_results = {}

            for idx, row in enumerate(queries, 1):
                query = row.get("query", "").strip()
                if not query:
                    continue

                # Get additional fields from CSV
                category = row.get("category", "").strip()
                description = row.get("description", "").strip()
                keywords_str = row.get("keywords", "").strip()
                keywords = (
                    [k.strip() for k in keywords_str.split(";")] if keywords_str else []
                )

                self.logger.info(f"\n[{idx}/{len(queries)}] Processing query: {query}")
                if category:
                    self.logger.info(f"Category: {category}")
                if description:
                    self.logger.info(f"Description: {description}")
                if keywords:
                    self.logger.info(f"Keywords: {', '.join(keywords)}")

                # Build enhanced search query with all CSV data
                search_parts = [query]
                if category:
                    search_parts.append(category)
                if description:
                    search_parts.append(description)
                if keywords:
                    search_parts.extend(keywords)

                enhanced_query = " ".join(search_parts)
                self.logger.info(f"Enhanced search query: {enhanced_query}")

                # Create CSV-based folder grouping
                csv_folder = output_dir / csv_name

                # Create search engine specific output directory under CSV folder
                engine_name = self.search_engine.get_engine_name().lower()
                engine_output_dir = csv_folder / engine_name

                # Create query-specific output directory under search engine folder
                safe_query_name = "".join(
                    c for c in query if c.isalnum() or c in (" ", "-", "_")
                ).strip()
                safe_query_name = safe_query_name.replace(" ", "_")[:50]
                query_output_dir = engine_output_dir / safe_query_name
                query_output_dir.mkdir(parents=True, exist_ok=True)

                # Search with enhanced query
                search_results = await self.search_query(enhanced_query)

                # Download PDFs directly from search results
                pdf_links = []
                pdf_dir = query_output_dir / "pdfs"
                pdf_dir.mkdir(parents=True, exist_ok=True)

                for result in search_results:
                    url = result.get("url", "")
                    if url.lower().endswith(".pdf"):
                        # Check if PDF already exists
                        pdf_filename = url.split("/")[-1]
                        existing_pdfs = list(
                            pdf_dir.glob(f"{pdf_filename.replace('.pdf', '')}*.pdf")
                        )

                        if existing_pdfs:
                            self.logger.info(
                                f"⏭️  PDF already exists, skipping: {pdf_filename}"
                            )
                            continue

                        pdf_links.append(url)
                        self.logger.info(f"📄 Found PDF in search results: {url}")

                if pdf_links:
                    self.logger.info(
                        f"Downloading {len(pdf_links)} new PDFs from search results..."
                    )
                    pdf_results = self.pdf_downloader.download_pdfs(pdf_links, pdf_dir)
                    self.logger.info(
                        f"✓ Downloaded {len([p for p in pdf_results if p.get('success')])} PDFs"
                    )

                # Save search results as markdown
                if search_results:
                    search_results_md = self.formatter.format_search_results(
                        query, search_results, self.search_engine.get_engine_name()
                    )
                    search_results_file = query_output_dir / "search_results.md"
                    self.formatter.save_markdown(
                        search_results_md, str(search_results_file)
                    )
                    self.logger.info(f"Saved search results: {search_results_file}")

                # Scrape each result (skip PDFs as they're already downloaded)
                scraped_count = 0
                pages_dir = query_output_dir / "pages"
                pages_dir.mkdir(parents=True, exist_ok=True)

                for result_idx, result in enumerate(
                    search_results[: self.config.max_pages_to_visit], 1
                ):
                    url = result.get("url")
                    if not url:
                        continue

                    # Skip PDFs as they're already downloaded
                    if url.lower().endswith(".pdf"):
                        self.logger.info(f"⏭️  Skipping PDF (already downloaded): {url}")
                        continue

                    # Check if page already scraped
                    page_md_file = pages_dir / f"{safe_query_name}_page{result_idx}.md"
                    if page_md_file.exists():
                        self.logger.info(f"⏭️  Page already scraped, skipping: {url}")
                        scraped_count += 1  # Count as scraped
                        continue

                    # Scrape the page
                    scrape_result = await self.scrape_page(
                        url, query_output_dir, safe_query_name, result_idx, keywords
                    )

                    if scrape_result.get("success"):
                        scraped_count += 1

                    # Delay between requests with realistic human timing if enabled
                    if result_idx < len(search_results):
                        if self.config.human_delays:
                            delay = self.anti_detection.add_realistic_delays(
                                self.config.delay_between_requests
                            )
                            self.logger.info(f"Waiting {delay:.1f}s before next request...")
                            time.sleep(delay)
                        else:
                            # Basic delay
                            delay = self.config.delay_between_requests
                            self.logger.info(f"Waiting {delay}s before next request...")
                            time.sleep(delay)

                self.logger.info(
                    f"✓ Completed: {len(search_results)} results, {scraped_count} pages scraped"
                )

                all_results[query] = {
                    "search_results": search_results,
                    "scraped_count": scraped_count,
                    "output_dir": str(query_output_dir),
                }

            engine_name = self.search_engine.get_engine_name()
            self.logger.info(
                f"\n✅ All queries processed! Output: {output_dir}/{csv_name}/{engine_name.lower()}"
            )
            return all_results

        except KeyboardInterrupt:
            self.logger.warning("\n⚠️ Scraping interrupted by user")
            return {}
        except Exception as e:
            self.logger.error(f"Error processing CSV: {e}")
            import traceback

            self.logger.error(traceback.format_exc())
            return {}
        finally:
            if not self.config.keep_browser_open:
                await self.close_browser()
            else:
                self.logger.info("Browser kept open (keep_browser_open=True)")


# For backward compatibility, provide a sync wrapper
WebSearchScraper = AsyncWebSearchScraper
