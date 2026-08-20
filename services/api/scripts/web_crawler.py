#!/usr/bin/env python3
"""
Web Crawler with Link Extraction and CSV Tracking

A Python script that:
1. Extracts links from a seed URL and saves to CSV
2. Reads each link from CSV, visits it, and extracts links
3. Creates individual CSV files for each visited page in directory structure
4. Maintains a master CSV to track visited links
5. Avoids revisiting links and stays within root domain
6. Tracks and filters out persistent header/footer links
"""

import argparse
import csv
import os
import re
import sys
import time
from urllib.parse import urljoin, urlparse, parse_qs
from collections import defaultdict
import requests
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install with: pip install beautifulsoup4 requests")
    sys.exit(1)


class WebCrawler:
    """Web crawler with domain restriction and link tracking."""

    def __init__(self, encoding: str = "utf-8", delay: float = 1.0):
        self.encoding = encoding
        self.delay = delay
        self.visited_links = set()
        self.seed_domain = ""
        self.master_csv_path = ""
        self.output_dir = ""
        self.persistent_links = set()  # Links found in header/footer
        self.index_links = set()  # Links from index page for reference
        self.link_frequency = defaultdict(int)  # Track how often links appear

    def get_directory_path(self, url: str) -> str:
        """Create directory structure based on URL path."""
        parsed = urlparse(url)
        path = parsed.path.strip("/")

        if not path:
            return "root"

        # Convert path to directory structure
        path_parts = [part for part in path.split("/") if part]

        # Clean each part
        cleaned_parts = []
        for part in path_parts:
            cleaned_part = re.sub(r"[^\w\-_.]", "_", part)
            if cleaned_part:
                cleaned_parts.append(cleaned_part)

        return os.path.join(*cleaned_parts) if cleaned_parts else "root"

    def normalize_filename(self, url: str) -> str:
        """Convert URL to a safe filename."""
        parsed = urlparse(url)

        # Get the last part of path as filename base
        path_parts = [part for part in parsed.path.strip("/").split("/") if part]
        if path_parts:
            filename_base = path_parts[-1]
        else:
            filename_base = "index"

        # Handle query parameters
        query_part = ""
        if parsed.query:
            query_params = parse_qs(parsed.query)
            if query_params:
                sorted_params = sorted(query_params.items())
                query_part = "_" + "_".join(f"{k}_{v[0]}" for k, v in sorted_params if v)

        # Clean filename
        filename = re.sub(r"[^\w\-_.]", "_", filename_base)
        filename = f"{filename}{query_part}_links.csv"

        # Limit length
        if len(filename) > 100:
            filename = filename[:100] + "_links.csv"

        return filename

    def load_html_from_url(self, url: str) -> BeautifulSoup | None:
        """Load HTML content from a URL."""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }

            # Disable SSL verification for government sites with certificate issues
            response = requests.get(url, headers=headers, timeout=30, verify=False)  # Bypass SSL certificate verification
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except requests.RequestException as e:
            print(f"❌ Error fetching URL {url}: {e}")
            return None

    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""

        text = re.sub(r"\s+", " ", text.strip())
        text = text.replace("&nbsp;", " ")
        text = text.replace("&amp;", "&")
        text = text.replace("&lt;", "<")
        text = text.replace("&gt;", ">")
        text = text.replace("&quot;", '"')
        text = text.replace("&#39;", "'")

        return text.strip()

    def is_same_domain(self, url: str) -> bool:
        """Check if URL belongs to the seed domain."""
        if not url.startswith("http"):
            return True  # Relative URLs are same domain

        try:
            link_domain = urlparse(url).netloc
            return link_domain == self.seed_domain
        except Exception:
            return False

    def extract_links(self, soup: BeautifulSoup, base_url: str, is_index_page: bool = False) -> list:
        """Extract all links from the HTML, filtering out persistent links."""
        if not soup:
            return []

        all_links = []

        for a_tag in soup.find_all("a", href=True):
            href = str(a_tag["href"])
            text = self.clean_text(a_tag.get_text())

            if not href.strip():
                continue

            # Skip unwanted link types
            href_lower = href.lower()
            if href_lower.startswith(("javascript:", "mailto:", "tel:", "#")):
                continue

            # Convert to absolute URL
            if href.startswith("http"):
                absolute_url = href
            else:
                absolute_url = urljoin(base_url, href)

            # Only include links from same domain
            if not self.is_same_domain(absolute_url):
                continue

            all_links.append(
                {
                    "href": absolute_url,
                    "text": text,
                    "title": a_tag.get("title", ""),
                    "target": a_tag.get("target", ""),
                    "rel": (
                        " ".join(str(item) for item in a_tag.get("rel") or [])
                        if isinstance(a_tag.get("rel") or [], list)
                        else str(a_tag.get("rel") or "")
                    ),
                }
            )

        # Track link frequency
        for link in all_links:
            self.link_frequency[link["href"]] += 1

        # If this is the index page, store all links as reference
        if is_index_page:
            self.index_links = {link["href"] for link in all_links}
            return all_links

        # Filter out persistent links (those that appear frequently or were in index)
        filtered_links = []
        for link in all_links:
            link_url = link["href"]

            # Skip if it's a persistent link (appears in >50% of pages or was in index)
            if (
                link_url in self.index_links
                or self.link_frequency[link_url] > 3  # Appears on more than 3 pages
                or self.is_persistent_navigation_link(link)
            ):
                continue

            filtered_links.append(link)

        return filtered_links

    def is_persistent_navigation_link(self, link: dict) -> bool:
        """Identify persistent navigation links based on common patterns."""
        url = link["href"]
        text = link["text"].lower()

        # Common navigation patterns
        persistent_patterns = [
            "home",
            "about",
            "contact",
            "services",
            "products",
            "news",
            "media",
            "blog",
            "projects",
            "reports",
            "publications",
            "mandate",
            "management",
            "commission",
            "board",
            "department",
        ]

        # Check if URL contains persistent patterns
        url_lower = url.lower()
        for pattern in persistent_patterns:
            if pattern in url_lower or pattern in text:
                return True

        return False

    def save_links_to_csv(self, links: list, output_path: str) -> None:
        """Save links to a CSV file."""
        try:
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            with open(output_path, "w", newline="", encoding=self.encoding) as csvfile:
                fieldnames = ["href", "text", "title", "target", "rel"]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
                writer.writeheader()
                writer.writerows(links)

        except Exception as e:
            print(f"❌ Error writing CSV file {output_path}: {e}")

    def update_master_csv(self, url: str, status: str, filename: str = "") -> None:
        """Update the master CSV with visited link information."""
        try:
            file_exists = os.path.exists(self.master_csv_path)

            with open(self.master_csv_path, "a", newline="", encoding=self.encoding) as csvfile:
                fieldnames = ["url", "status", "filename", "timestamp"]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                if not file_exists:
                    writer.writeheader()

                writer.writerow({"url": url, "status": status, "filename": filename, "timestamp": time.strftime("%Y-%m-%d %H:%M:%S")})
        except Exception as e:
            print(f"❌ Error updating master CSV: {e}")

    def load_master_csv(self) -> set:
        """Load visited links from master CSV."""
        visited = set()
        if not os.path.exists(self.master_csv_path):
            return visited

        try:
            with open(self.master_csv_path, "r", encoding=self.encoding) as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    if row["status"] == "visited":
                        visited.add(row["url"])
        except Exception as e:
            print(f"❌ Error reading master CSV: {e}")

        return visited

    def get_directory_path(self, url: str) -> str:
        """Get directory path from URL."""
        parsed_url = urlparse(url)
        path = parsed_url.path.strip("/")
        return path

    def crawl_page(self, url: str, is_index_page: bool = False) -> list:
        """Crawl a single page and extract links."""
        print(f"🔍 Crawling: {url}")

        soup = self.load_html_from_url(url)
        if not soup:
            self.update_master_csv(url, "failed")
            return []

        links = self.extract_links(soup, url, is_index_page)

        # Create directory structure based on URL path
        dir_path = self.get_directory_path(url)
        full_dir_path = os.path.join(self.output_dir, dir_path)

        # Save links to individual file
        filename = self.normalize_filename(url)
        output_path = os.path.join(full_dir_path, filename)
        self.save_links_to_csv(links, output_path)

        # Update master CSV
        relative_path = os.path.join(dir_path, filename)
        self.update_master_csv(url, "visited", relative_path)

        print(f"✅ Extracted {len(links)} {'new' if not is_index_page else 'reference'} links from {url}")
        return links

    def crawl(self, seed_url: str, output_dir: str = "./crawled_links") -> None:
        """Main crawling function with recursive depth-first exploration."""
        # Setup
        self.seed_domain = urlparse(seed_url).netloc
        self.output_dir = output_dir
        self.master_csv_path = os.path.join(output_dir, "master_tracking.csv")

        # Create output directory
        os.makedirs(output_dir, exist_ok=True)

        # Load previously visited links
        self.visited_links = self.load_master_csv()
        print(f"📂 Loaded {len(self.visited_links)} previously visited links")

        # Start with seed URL as index page
        crawled_count = 0

        # Recursive depth-first crawling function
        def crawl_recursive(url: str, depth: int = 0, max_depth: int = 10):
            nonlocal crawled_count

            if depth > max_depth or url in self.visited_links or crawled_count >= 500:
                return []

            # Crawl the current page
            is_index = crawled_count == 0
            new_links = self.crawl_page(url, is_index)
            self.visited_links.add(url)
            crawled_count += 1

            # If no new links, return
            if not new_links:
                return []

            # Recursively crawl each discovered link immediately (depth-first)
            for link in new_links:
                link_url = link["href"]
                if link_url not in self.visited_links:
                    # Respect delay between requests
                    time.sleep(self.delay)

                    # Recursively crawl this link to maximum depth
                    crawl_recursive(link_url, depth + 1, max_depth)

            return new_links

        # Start recursive crawling from seed URL
        print(f"🚀 Starting recursive depth-first crawling from: {seed_url}")
        crawl_recursive(seed_url)

        print(f"\n🎉 Recursive crawling completed!")
        print(f"📊 Pages crawled: {crawled_count}")
        print(f"📁 Output directory: {output_dir}")
        print(f"📋 Master tracking: {self.master_csv_path}")
        print(f"🔗 Persistent links identified: {len(self.index_links)}")
        print(f"🆕 New unique links discovered: {sum(1 for count in self.link_frequency.values() if count <= 3)}")


def main():
    """Main function to handle command line interface."""
    parser = argparse.ArgumentParser(
        description="Web crawler with domain restriction and CSV tracking",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Crawl a website
  python web_crawler.py https://example.com
  
  # Crawl with custom output directory
  python web_crawler.py https://example.com --output-dir my_crawl
  
  # Crawl with custom delay between requests
  python web_crawler.py https://example.com --delay 2.0
        """,
    )

    parser.add_argument("seed_url", help="Starting URL for crawling")
    parser.add_argument("--output-dir", "-o", default="./crawled_links", help="Output directory for CSV files (default: ./crawled_links)")
    parser.add_argument("--delay", "-d", type=float, default=1.0, help="Delay between requests in seconds (default: 1.0)")

    args = parser.parse_args()

    # Initialize and run crawler
    crawler = WebCrawler(delay=args.delay)
    crawler.crawl(args.seed_url, args.output_dir)


if __name__ == "__main__":
    main()
