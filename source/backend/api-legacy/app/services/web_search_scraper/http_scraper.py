"""
HTTP-based scraper fallback for sites that block browser automation
"""

import requests
import logging
from bs4 import BeautifulSoup
from typing import Dict, Any, List
from pathlib import Path
import time
import random


class HTTPScraper:
    """Simple HTTP scraper using requests + BeautifulSoup"""

    def __init__(self, delay_range=(5, 15)):
        self.logger = logging.getLogger(__name__)
        self.session = requests.Session()
        self.delay_range = delay_range
        
        # Mimic real browser headers
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
        })

    def scrape_page(self, url: str) -> Dict[str, Any]:
        """
        Scrape a page using HTTP requests
        
        Args:
            url: URL to scrape
            
        Returns:
            Dictionary with scraping results
        """
        result = {
            "url": url,
            "success": False,
            "title": "",
            "content": "",
            "tables": [],
            "links": [],
            "error": None
        }

        try:
            # Random delay to be polite
            delay = random.uniform(*self.delay_range)
            self.logger.info(f"Waiting {delay:.1f}s before request...")
            time.sleep(delay)

            # Make request
            self.logger.info(f"HTTP GET: {url}")
            response = self.session.get(url, timeout=30, verify=False)
            response.raise_for_status()

            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')

            # Extract title
            title_tag = soup.find('title')
            result["title"] = title_tag.get_text(strip=True) if title_tag else "Untitled"

            # Extract main content
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()

            # Get text
            text = soup.get_text(separator='\n', strip=True)
            result["content"] = text

            # Extract tables
            tables = self._extract_tables(soup)
            result["tables"] = tables

            # Extract links
            links = []
            for a in soup.find_all('a', href=True):
                href = a['href']
                text = a.get_text(strip=True)
                if href and text:
                    links.append({"url": href, "text": text})
            result["links"] = links

            result["success"] = True
            self.logger.info(f"✓ HTTP scrape successful: {len(tables)} tables, {len(links)} links")

        except requests.exceptions.Timeout:
            result["error"] = "Request timeout"
            self.logger.error(f"Timeout scraping {url}")
        except requests.exceptions.RequestException as e:
            result["error"] = str(e)
            self.logger.error(f"HTTP error scraping {url}: {e}")
        except Exception as e:
            result["error"] = str(e)
            self.logger.error(f"Error scraping {url}: {e}")

        return result

    def _extract_tables(self, soup: BeautifulSoup) -> List[str]:
        """Extract tables and format as markdown"""
        tables = []
        
        for idx, table in enumerate(soup.find_all('table'), 1):
            try:
                # Extract headers
                headers = []
                header_row = table.find('thead')
                if header_row:
                    headers = [th.get_text(strip=True) for th in header_row.find_all(['th', 'td'])]
                else:
                    # Try first row
                    first_row = table.find('tr')
                    if first_row:
                        headers = [th.get_text(strip=True) for th in first_row.find_all(['th', 'td'])]

                # Extract rows
                rows = []
                tbody = table.find('tbody') or table
                for tr in tbody.find_all('tr')[1 if not table.find('thead') else 0:]:
                    cells = [td.get_text(strip=True) for td in tr.find_all(['td', 'th'])]
                    if cells and any(cell for cell in cells):  # Skip empty rows
                        rows.append(cells)

                if not rows:
                    continue

                # Format as markdown
                md = f"\n### Table {idx}\n\n"
                
                if headers and len(headers) > 0:
                    md += "| " + " | ".join(headers) + " |\n"
                    md += "| " + " | ".join(["---"] * len(headers)) + " |\n"
                    
                    for row in rows:
                        # Pad row to match header length
                        while len(row) < len(headers):
                            row.append("")
                        md += "| " + " | ".join(row[:len(headers)]) + " |\n"
                else:
                    # No headers, just data
                    for row in rows:
                        md += "| " + " | ".join(row) + " |\n"

                tables.append(md)

            except Exception as e:
                self.logger.warning(f"Error extracting table {idx}: {e}")
                continue

        return tables

    def is_cloudflare_blocked(self, response_text: str) -> bool:
        """Check if response indicates Cloudflare block"""
        indicators = [
            'checking your browser',
            'cloudflare',
            'security verification',
            'verify you are not a bot',
            'challenges.cloudflare.com',
            'just a moment',
            'enable javascript and cookies'
        ]
        text_lower = response_text.lower()
        return any(indicator in text_lower for indicator in indicators)
