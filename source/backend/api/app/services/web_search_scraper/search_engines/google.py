"""
Google Search Engine Implementation
"""

import urllib.parse
from typing import List, Dict, Any
from playwright.sync_api import Page
from .base import BaseSearchEngine


class GoogleSearchEngine(BaseSearchEngine):
    """Google search engine implementation"""

    def get_engine_name(self) -> str:
        return "Google"

    def get_search_url(self, query: str) -> str:
        """Get Google search URL"""
        encoded_query = urllib.parse.quote_plus(query)
        return f"https://www.google.com/search?q={encoded_query}&num={self.config.max_results_per_query}"

    def parse_search_results(self, page: Page) -> List[Dict[str, Any]]:
        """Parse Google search results"""
        results = []

        try:
            # Wait for search results with multiple selectors
            try:
                page.wait_for_selector(
                    "div#search, div#rso, div#center_col",
                    timeout=self.config.wait_timeout,
                )
                page.wait_for_timeout(3000)  # Extra wait for dynamic content
            except:
                self.logger.warning("Search results container not found")
                return results

            # Try multiple selector strategies for Google's changing structure
            selectors = [
                "div.g",  # Standard result container
                "div.Gx5Zad",  # Another variant
                "div[data-hveid]",  # Alternative container
                "div[jscontroller]",  # JS-controlled divs
                "div.MjjYud",  # New Google structure
            ]

            result_elements = []
            for selector in selectors:
                result_elements = page.query_selector_all(selector)
                if result_elements:
                    self.logger.info(
                        f"✓ Found {len(result_elements)} elements with selector: {selector}"
                    )
                    break
                else:
                    self.logger.debug(f"✗ No elements found with selector: {selector}")

            if not result_elements:
                self.logger.error("No result elements found with any selector")
                # Debug: Log page structure
                self.logger.error(f"Page URL: {page.url}")
                self.logger.error(f"Page title: {page.title()}")

                # Save HTML for debugging
                try:
                    html_content = page.content()
                    self.logger.error(f"HTML length: {len(html_content)} chars")
                    # Log first 500 chars of body
                    body = page.query_selector("body")
                    if body:
                        body_text = body.inner_text()[:500]
                        self.logger.error(f"Body preview: {body_text}")
                except:
                    pass

                return results

            for idx, element in enumerate(result_elements):
                if len(results) >= self.config.max_results_per_query:
                    break

                try:
                    # Try multiple ways to extract title and URL
                    title_element = element.query_selector("h3")

                    # Try multiple link selectors
                    link_element = element.query_selector('a[href^="http"]')
                    if not link_element:
                        link_element = element.query_selector("a[href]")
                    if not link_element:
                        # Try finding link in parent or child
                        all_links = element.query_selector_all("a")
                        for link in all_links:
                            href = link.get_attribute("href")
                            if href and href.startswith("http"):
                                link_element = link
                                break

                    if not title_element or not link_element:
                        self.logger.debug(
                            f"Result {idx}: Missing title or link (title={title_element is not None}, link={link_element is not None})"
                        )
                        continue

                    title = title_element.inner_text().strip()
                    url = link_element.get_attribute("href")

                    # Skip if URL is not valid
                    if not url or not url.startswith("http"):
                        self.logger.debug(f"Result {idx}: Invalid URL: {url}")
                        continue

                    # Skip Google's own links and unwanted domains
                    skip_domains = [
                        "google.com/search",
                        "google.com/url",
                        "webcache.googleusercontent.com",
                        "translate.google.com",
                    ]
                    if any(domain in url for domain in skip_domains):
                        self.logger.debug(
                            f"Result {idx}: Skipping Google domain: {url}"
                        )
                        continue

                    # Try multiple snippet selectors
                    snippet = ""
                    snippet_selectors = [
                        'div[data-sncf="1"]',
                        "div.VwiC3b",
                        "div.s",
                        "span.st",
                        "div.IsZvec",
                        'div[style*="-webkit-line-clamp"]',
                        "div.lEBKkf",
                    ]
                    for snippet_sel in snippet_selectors:
                        snippet_element = element.query_selector(snippet_sel)
                        if snippet_element:
                            snippet = snippet_element.inner_text().strip()
                            if snippet:
                                break

                    results.append(
                        {
                            "title": title,
                            "url": url,
                            "snippet": snippet,
                            "position": len(results) + 1,
                            "source": "google",
                        }
                    )

                    self.logger.info(
                        f"✓ Extracted result {len(results)}: {title[:60]}... -> {url[:80]}"
                    )

                except Exception as e:
                    self.logger.debug(f"Error parsing result {idx}: {e}")
                    continue

        except Exception as e:
            self.logger.error(f"Error parsing Google results: {e}")

        return results
