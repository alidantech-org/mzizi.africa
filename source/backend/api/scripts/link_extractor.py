#!/usr/bin/env python3
"""
Link Extractor

A Python script that extracts all links from a web page and saves them to a CSV file.
Supports both URLs and local HTML files.

Usage:
    python link_extractor.py https://example.com
    python link_extractor.py https://example.com --output links.csv
    python link_extractor.py input.html --output links.csv
"""

import argparse
import csv
import os
import re
import sys
from urllib.parse import urljoin, urlparse
import requests

try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install with: pip install beautifulsoup4 requests")
    sys.exit(1)


class LinkExtractor:
    """Extract links from web pages with filtering and deduplication capabilities."""

    def __init__(self, encoding: str = "utf-8"):
        self.encoding = encoding
        self.extracted_links = set()

    def load_html_from_file(self, file_path: str) -> BeautifulSoup:
        """Load HTML content from a local file."""
        try:
            with open(file_path, "r", encoding=self.encoding) as file:
                content = file.read()
            return BeautifulSoup(content, "html.parser")
        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error reading file {file_path}: {e}")
            sys.exit(1)

    def load_html_from_url(self, url: str) -> BeautifulSoup:
        """Load HTML content from a URL."""
        try:
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except requests.RequestException as e:
            print(f"❌ Error fetching URL {url}: {e}")
            sys.exit(1)

    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""

        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text.strip())

        # Remove common HTML entities
        text = text.replace("&nbsp;", " ")
        text = text.replace("&amp;", "&")
        text = text.replace("&lt;", "<")
        text = text.replace("&gt;", ">")
        text = text.replace("&quot;", '"')
        text = text.replace("&#39;", "'")

        return text.strip()

    def extract_links(
        self,
        soup: BeautifulSoup,
        base_url: str = "",
        include_external: bool = True,
        include_internal: bool = True,
        include_anchors: bool = False,
        include_mailto: bool = False,
        include_tel: bool = False,
        include_javascript: bool = False,
        convert_to_absolute: bool = True,
    ) -> list:
        """Extract all links from the HTML."""
        links = []

        for a_tag in soup.find_all("a", href=True):
            href = str(a_tag["href"])
            text = self.clean_text(a_tag.get_text())

            # Skip empty hrefs
            if not href.strip():
                continue

            # Filter by link type
            href_lower = href.lower()

            if not include_anchors and href.startswith("#"):
                continue
            if not include_mailto and href_lower.startswith("mailto:"):
                continue
            if not include_tel and href_lower.startswith("tel:"):
                continue
            if not include_javascript and href_lower.startswith("javascript:"):
                continue

            # Convert relative URLs to absolute
            if convert_to_absolute and base_url and not href.startswith(("http", "#", "mailto:", "tel:", "javascript:")):
                absolute_url = urljoin(base_url, href)
            else:
                absolute_url = href

            # Check if internal or external
            if base_url and href.startswith("http"):
                try:
                    base_domain = urlparse(base_url).netloc
                    link_domain = urlparse(absolute_url).netloc

                    is_internal = link_domain == base_domain or not link_domain

                    if not include_internal and is_internal:
                        continue
                    if not include_external and not is_internal:
                        continue
                except Exception:
                    # If URL parsing fails, include the link
                    pass

            # Avoid duplicates
            link_key = (absolute_url, text)
            if link_key in self.extracted_links:
                continue

            self.extracted_links.add(link_key)

            links.append(
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

        return links

    def save_to_csv(self, links: list, output_path: str) -> None:
        """Save links to a CSV file."""
        try:
            # Ensure output directory exists
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)

            with open(output_path, "w", newline="", encoding=self.encoding) as csvfile:
                fieldnames = ["href", "text", "title", "target", "rel"]
                writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

                writer.writeheader()
                writer.writerows(links)

            print(f"✅ Links saved to: {output_path}")

        except Exception as e:
            print(f"❌ Error writing CSV file {output_path}: {e}")
            sys.exit(1)

    def print_summary(self, links: list, source: str) -> None:
        """Print extraction summary."""
        print(f"\n🎉 Link extraction completed successfully!")
        print(f"📄 Source: {source}")
        print(f"🔗 Total links extracted: {len(links)}")

        # Count link types
        external_links = sum(
            1 for link in links if link["href"].startswith("http") and urlparse(link["href"]).netloc != urlparse(source).netloc
        )
        internal_links = sum(
            1 for link in links if link["href"].startswith("http") and urlparse(link["href"]).netloc == urlparse(source).netloc
        )
        anchor_links = sum(1 for link in links if link["href"].startswith("#"))
        mailto_links = sum(1 for link in links if link["href"].lower().startswith("mailto:"))

        print(f"📊 Link types:")
        print(f"   - External: {external_links}")
        print(f"   - Internal: {internal_links}")
        print(f"   - Anchors: {anchor_links}")
        print(f"   - Mailto: {mailto_links}")


def main():
    """Main function to handle command line interface."""
    parser = argparse.ArgumentParser(
        description="Extract links from web pages and save to CSV",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Extract links from website
  python link_extractor.py https://example.com
  
  # Extract with custom output file
  python link_extractor.py https://example.com --output links.csv
  
  # Extract from local HTML file
  python link_extractor.py input.html --output links.csv
  
  # Extract only external links
  python link_extractor.py https://example.com --no-internal
  
  # Extract all link types including mailto and anchors
  python link_extractor.py https://example.com --include-mailto --include-anchors
        """,
    )

    parser.add_argument("input", help="Website URL or HTML file path")
    parser.add_argument("--output", "-o", help="Output CSV file path")
    parser.add_argument("--output-dir", "-d", default="./extracted_links", help="Output directory (default: ./extracted_links)")
    parser.add_argument("--encoding", "-e", default="utf-8", help="File encoding (default: utf-8)")
    parser.add_argument("--no-internal", action="store_true", help="Exclude internal links")
    parser.add_argument("--no-external", action="store_true", help="Exclude external links")
    parser.add_argument("--include-anchors", action="store_true", help="Include anchor links (#)")
    parser.add_argument("--include-mailto", action="store_true", help="Include mailto links")
    parser.add_argument("--include-tel", action="store_true", help="Include telephone links")
    parser.add_argument("--include-javascript", action="store_true", help="Include javascript links")
    parser.add_argument("--no-absolute", action="store_true", help="Don't convert relative URLs to absolute")

    args = parser.parse_args()

    # Initialize extractor
    extractor = LinkExtractor(encoding=args.encoding)

    # Load HTML content
    print(f"📄 Loading HTML from: {args.input}")
    if args.input.startswith(("http://", "https://")):
        soup = extractor.load_html_from_url(args.input)
        base_url = args.input
    else:
        soup = extractor.load_html_from_file(args.input)
        base_url = ""

    # Extract links
    print("🔗 Extracting links...")
    links = extractor.extract_links(
        soup,
        base_url=base_url,
        include_external=not args.no_external,
        include_internal=not args.no_internal,
        include_anchors=args.include_anchors,
        include_mailto=args.include_mailto,
        include_tel=args.include_tel,
        include_javascript=args.include_javascript,
        convert_to_absolute=not args.no_absolute,
    )

    # Determine output path
    if args.output:
        output_path = args.output
    else:
        # Generate filename from URL or file path
        if args.input.startswith(("http://", "https://")):
            filename = re.sub(r"[^\w\-_.]", "_", urlparse(args.input).netloc + urlparse(args.input).path)
            if not filename or filename == "_":
                filename = "links"
        else:
            filename = os.path.splitext(os.path.basename(args.input))[0]

        output_path = os.path.join(args.output_dir, f"{filename}_links.csv")

    # Save to CSV
    extractor.save_to_csv(links, output_path)

    # Print summary
    extractor.print_summary(links, args.input)


if __name__ == "__main__":
    main()
