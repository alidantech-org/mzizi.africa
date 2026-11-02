"""
Base Search Engine Class
"""

import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from playwright.sync_api import Page, Browser, BrowserContext


class BaseSearchEngine(ABC):
    """Base class for search engine implementations"""

    def __init__(self, config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        self.browser: Optional[Browser] = None
        self.context: Optional[BrowserContext] = None

    @abstractmethod
    def get_search_url(self, query: str) -> str:
        """Get the search URL for a query"""
        pass

    @abstractmethod
    def parse_search_results(self, page: Page) -> List[Dict[str, Any]]:
        """Parse search results from the page"""
        pass

    @abstractmethod
    def get_engine_name(self) -> str:
        """Get the name of the search engine"""
        pass

    def search(self, page: Page, query: str) -> List[Dict[str, Any]]:
        """
        Perform a search and return results
        """
        try:
            search_url = self.get_search_url(query)
            self.logger.info(f"Searching {self.get_engine_name()}: {query}")

            # Navigate to search URL
            page.goto(
                search_url,
                wait_until="networkidle",
                timeout=self.config.navigation_timeout,
            )

            # Wait for results to load
            page.wait_for_timeout(2000)

            # Parse results
            results = self.parse_search_results(page)

            # Save HTML snapshot for debugging
            if (
                hasattr(self.config, "save_html_snapshots")
                and self.config.save_html_snapshots
            ):
                self._save_html_snapshot(page, query)

            self.logger.info(f"Found {len(results)} results for: {query}")
            return results

        except Exception as e:
            self.logger.error(
                f"Error searching {self.get_engine_name()} for '{query}': {e}"
            )
            return []

    def _save_html_snapshot(self, page: Page, query: str):
        """Save HTML snapshot of search results page"""
        try:
            from pathlib import Path
            import re

            # Create snapshots directory
            snapshots_dir = Path("_data/output/html_snapshots")
            snapshots_dir.mkdir(parents=True, exist_ok=True)

            # Create safe filename from query
            safe_query = re.sub(r"[^\w\s-]", "", query).strip().replace(" ", "_")[:50]
            filename = f"{self.get_engine_name().lower()}_{safe_query}.html"
            filepath = snapshots_dir / filename

            # Save HTML content
            html_content = page.content()
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(html_content)

            self.logger.info(f"💾 Saved HTML snapshot: {filepath}")

        except Exception as e:
            self.logger.warning(f"Failed to save HTML snapshot: {e}")

    def extract_tables(self, page: Page) -> List[str]:
        """Extract tables from page as markdown"""
        tables_md = []

        try:
            # Find all tables
            table_elements = page.query_selector_all("table")

            for idx, table in enumerate(table_elements, 1):
                try:
                    # Get table rows
                    rows = table.query_selector_all("tr")
                    if not rows:
                        continue

                    table_data = []
                    headers = []

                    for row_idx, row in enumerate(rows):
                        # Check for headers
                        ths = row.query_selector_all("th")
                        if ths and not headers:
                            headers = [th.inner_text().strip() for th in ths]
                            continue

                        # Get data cells
                        tds = row.query_selector_all("td")
                        if tds:
                            row_data = [td.inner_text().strip() for td in tds]
                            if row_data:
                                table_data.append(row_data)

                    if not table_data:
                        continue

                    # Format as markdown table
                    md_table = f"\n### Table {idx}\n\n"

                    if headers:
                        # Add header row
                        md_table += "| " + " | ".join(headers) + " |\n"
                        md_table += "| " + " | ".join(["---"] * len(headers)) + " |\n"

                        # Add data rows
                        for row in table_data:
                            # Pad row if needed
                            while len(row) < len(headers):
                                row.append("")
                            md_table += "| " + " | ".join(row[: len(headers)]) + " |\n"
                    else:
                        # No headers, just data
                        if table_data:
                            max_cols = max(len(row) for row in table_data)
                            headers = [f"Col {i+1}" for i in range(max_cols)]

                            md_table += "| " + " | ".join(headers) + " |\n"
                            md_table += (
                                "| " + " | ".join(["---"] * len(headers)) + " |\n"
                            )

                            for row in table_data:
                                while len(row) < max_cols:
                                    row.append("")
                                md_table += "| " + " | ".join(row) + " |\n"

                    tables_md.append(md_table)

                except Exception as e:
                    self.logger.debug(f"Error extracting table {idx}: {e}")
                    continue

        except Exception as e:
            self.logger.warning(f"Error extracting tables: {e}")

        return tables_md

    def extract_text_content(self, page: Page) -> str:
        """Extract main text content from a page"""
        try:
            # Try to find main content areas
            selectors = [
                "article",
                "main",
                '[role="main"]',
                ".content",
                "#content",
                "body",
            ]

            for selector in selectors:
                try:
                    element = page.query_selector(selector)
                    if element:
                        text = element.inner_text()
                        if text and len(text.strip()) > 100:
                            return text.strip()
                except:
                    continue

            # Fallback to body text
            return page.inner_text("body")

        except Exception as e:
            self.logger.warning(f"Error extracting text content: {e}")
            return ""

    def extract_metadata(self, page: Page) -> Dict[str, str]:
        """Extract metadata from a page"""
        metadata = {
            "title": "",
            "description": "",
            "keywords": "",
            "author": "",
            "published_date": "",
        }

        try:
            # Title
            metadata["title"] = page.title()

            # Meta tags
            meta_tags = {
                "description": ['name="description"', 'property="og:description"'],
                "keywords": ['name="keywords"'],
                "author": ['name="author"'],
                "published_date": [
                    'property="article:published_time"',
                    'name="publish_date"',
                ],
            }

            for key, selectors in meta_tags.items():
                for selector in selectors:
                    try:
                        element = page.query_selector(f"meta[{selector}]")
                        if element:
                            content = element.get_attribute("content")
                            if content:
                                metadata[key] = content
                                break
                    except:
                        continue

        except Exception as e:
            self.logger.warning(f"Error extracting metadata: {e}")

        return metadata

    def take_screenshot(self, page: Page, filepath: str) -> bool:
        """Take a screenshot of the page"""
        try:
            page.screenshot(
                path=filepath,
                full_page=self.config.full_page_screenshot,
                type=self.config.screenshot_format,
            )
            self.logger.info(f"Screenshot saved: {filepath}")
            return True
        except Exception as e:
            self.logger.error(f"Error taking screenshot: {e}")
            return False

    def detect_pdf_links(self, page: Page) -> List[Dict[str, str]]:
        """Detect PDF links on the page"""
        pdf_links = []

        try:
            # Check if page mentions PDF
            page_text = page.inner_text("body").lower()
            if "pdf" not in page_text:
                return pdf_links

            # Find all links
            all_links = page.query_selector_all("a[href]")

            for link in all_links:
                try:
                    href = link.get_attribute("href")
                    text = link.inner_text().strip()

                    if not href:
                        continue

                    # Check if link points to PDF
                    href_lower = href.lower()
                    text_lower = text.lower()

                    is_pdf = (
                        href_lower.endswith(".pdf")
                        or ".pdf?" in href_lower
                        or ".pdf#" in href_lower
                        or "pdf" in text_lower
                    )

                    if is_pdf:
                        # Make absolute URL
                        absolute_url = page.evaluate(
                            f"(href) => new URL(href, document.baseURI).href", href
                        )

                        pdf_links.append(
                            {"url": absolute_url, "text": text, "type": "pdf"}
                        )

                except Exception as e:
                    self.logger.debug(f"Error processing link: {e}")
                    continue

            if pdf_links:
                self.logger.info(f"Found {len(pdf_links)} PDF link(s)")

        except Exception as e:
            self.logger.warning(f"Error detecting PDF links: {e}")

        return pdf_links

    def find_search_bar(self, page: Page) -> Optional[str]:
        """Find search bar on the page"""
        try:
            # Common search input selectors
            search_selectors = [
                'input[type="search"]',
                'input[name*="search" i]',
                'input[name*="query" i]',
                'input[name*="q" i]',
                'input[placeholder*="search" i]',
                'input[id*="search" i]',
                "input.search",
                "#search",
                ".search-input",
            ]

            for selector in search_selectors:
                try:
                    element = page.query_selector(selector)
                    if element and element.is_visible():
                        self.logger.info(f"Found search bar: {selector}")
                        return selector
                except:
                    continue

            return None

        except Exception as e:
            self.logger.debug(f"Error finding search bar: {e}")
            return None

    def search_on_page(self, page: Page, keywords: List[str]) -> bool:
        """Search for keywords using site's search bar"""
        try:
            search_selector = self.find_search_bar(page)

            if not search_selector:
                self.logger.debug("No search bar found on page")
                return False

            # Try each keyword
            for keyword in keywords:
                try:
                    self.logger.info(f"Searching for: {keyword}")

                    # Fill search input
                    page.fill(search_selector, keyword)

                    # Try to submit (press Enter or find submit button)
                    page.press(search_selector, "Enter")

                    # Wait for navigation or results
                    page.wait_for_timeout(2000)

                    # Check if we got results
                    return True

                except Exception as e:
                    self.logger.debug(f"Error searching for '{keyword}': {e}")
                    continue

            return False

        except Exception as e:
            self.logger.warning(f"Error in search_on_page: {e}")
            return False
