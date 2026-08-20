#!/usr/bin/env python3
"""
Website to Markdown Converter

A robust Python script that converts websites to clean, formatted markdown.
Supports content cleaning, table extraction, and various output options.

Usage:
    python website_to_markdown_converter.py https://example.com output.md
    python website_to_markdown_converter.py https://example.com --clean-ads --output-dir ./markdown/
    python website_to_markdown_converter.py input.html --table-only --output tables.md
"""

import argparse
import os
import re
import sys
from typing import Dict
from urllib.parse import urljoin, urlparse
import requests

try:
    from bs4 import BeautifulSoup, Comment
    import markdownify
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install with: pip install beautifulsoup4 markdownify requests")
    sys.exit(1)


class WebsiteToMarkdownConverter:
    """Convert websites to clean, formatted markdown with content cleaning capabilities."""

    def __init__(self, encoding: str = "utf-8"):
        self.encoding = encoding
        self.markdown_converter = markdownify.Markdownify(heading_style="ATX", bullets="-", strong_em_symbol="*", strip=["script", "style"])

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

        # Remove non-printable characters except newlines and tabs
        text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)

        return text.strip()

    def remove_unwanted_elements(
        self,
        soup: BeautifulSoup,
        base_url: str = "",
        include_images: bool = True,
        include_links: bool = True,
        include_tables: bool = True,
        remove_ads: bool = True,
    ) -> BeautifulSoup:
        """Remove unwanted elements from the HTML."""

        # Elements to always remove
        elements_to_remove = ["script", "style", "noscript", "iframe", "embed", "object", "meta", "link", "title", "head"]

        # Navigation and layout elements
        nav_selectors = ["nav", "header", "footer", "aside", ".navigation", ".menu", ".sidebar", ".nav", ".navbar", ".header", ".footer"]

        # Ad and promotional content
        ad_selectors = [
            ".advertisement",
            ".ads",
            ".sponsored",
            ".popup",
            ".modal",
            ".banner",
            ".promo",
            ".promotion",
            '[class*="ad"]',
            '[class*="advertisement"]',
            '[id*="ad"]',
            '[class*="sponsored"]',
            "[data-ad]",
            "[data-advertisement]",
            ".google-ads",
            ".adsense",
        ]

        # Remove unwanted elements
        all_selectors = elements_to_remove + nav_selectors
        if remove_ads:
            all_selectors.extend(ad_selectors)

        for selector in all_selectors:
            try:
                for element in soup.select(selector):
                    element.decompose()
            except Exception as e:
                print(f"⚠️  Could not remove elements with selector '{selector}': {e}")

        # Remove comments
        for comment in soup.find_all(string=lambda text: isinstance(text, Comment)):
            comment.extract()

        # Process images
        if not include_images:
            for img in soup.find_all("img"):
                img.decompose()
        else:
            # Convert relative image URLs to absolute
            for img in soup.find_all("img"):
                src = img.get("src")
                if src and base_url and isinstance(src, str) and not src.startswith(("http", "data:")):
                    img["src"] = urljoin(base_url, src)
                # Add alt text if missing
                if not img.get("alt"):
                    img["alt"] = "Image"

        # Process links
        if not include_links:
            for a in soup.find_all("a"):
                a.replace_with(a.get_text())
        else:
            # Convert relative URLs to absolute
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if base_url and isinstance(href, str) and not href.startswith(("http", "#", "mailto:", "tel:")):
                    a["href"] = urljoin(base_url, href)

        # Process tables
        if not include_tables:
            for table in soup.find_all("table"):
                table.decompose()

        return soup

    def extract_main_content(self, soup: BeautifulSoup) -> BeautifulSoup:
        """Extract the main content from the page."""

        # Try to find main content using common selectors
        content_selectors = [
            "main",
            '[role="main"]',
            ".content",
            "#content",
            "article",
            ".article",
            ".post",
            ".entry-content",
            ".main-content",
            "#main",
            ".page-content",
        ]

        for selector in content_selectors:
            content = soup.select_one(selector)
            if content:
                # Create a new soup with just this content
                new_soup = BeautifulSoup("<div></div>", "html.parser")
                div = new_soup.find("div")
                if div:
                    div.replace_with(content.extract())
                return new_soup

        # If no main content found, return body
        body = soup.find("body")
        if body:
            new_soup = BeautifulSoup("<div></div>", "html.parser")
            div = new_soup.find("div")
            if div:
                div.replace_with(body.extract())
            return new_soup

        # Fallback to entire soup
        return soup

    def extract_tables_as_markdown(self, soup: BeautifulSoup) -> str:
        """Extract all tables and convert them to markdown."""
        tables_markdown = []

        for i, table in enumerate(soup.find_all("table")):
            table_md = self.markdown_converter.convert_tags(table)
            tables_markdown.append(f"## Table {i + 1}\n\n{table_md}\n")

        return "\n".join(tables_markdown)

    def convert_to_markdown(
        self,
        soup: BeautifulSoup,
        base_url: str = "",
        include_images: bool = True,
        include_links: bool = True,
        include_tables: bool = True,
        remove_ads: bool = True,
        tables_only: bool = False,
    ) -> str:
        """Convert HTML to clean markdown."""

        # Clean the HTML
        soup = self.remove_unwanted_elements(soup, base_url, include_images, include_links, include_tables, remove_ads)

        if tables_only:
            return self.extract_tables_as_markdown(soup)

        # Extract main content
        soup = self.extract_main_content(soup)

        # Convert to markdown
        markdown_content = self.markdown_converter.convert_tags(soup)

        # Clean up the markdown
        markdown_content = self.clean_markdown(markdown_content)

        return markdown_content

    def clean_markdown(self, markdown: str) -> str:
        """Clean up the generated markdown."""

        # Remove excessive empty lines
        markdown = re.sub(r"\n{3,}", "\n\n", markdown)

        # Fix common markdownify issues
        markdown = re.sub(r"\n+\s*-\n", "\n- ", markdown)
        markdown = re.sub(r"\n+\s*\d+\.\n", "\n1. ", markdown)

        # Clean up headings
        markdown = re.sub(r"#+\s*\n", "", markdown)
        markdown = re.sub(r"\n#+\s*$", "", markdown)

        # Remove leading/trailing whitespace
        markdown = markdown.strip()

        return markdown

    def save_markdown(self, content: str, output_path: str) -> None:
        """Save markdown content to file."""
        try:
            # Ensure output directory exists
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)

            with open(output_path, "w", encoding=self.encoding) as file:
                file.write(content)

            print(f"✅ Markdown saved to: {output_path}")

        except Exception as e:
            print(f"❌ Error writing markdown file {output_path}: {e}")
            sys.exit(1)

    def get_page_metadata(self, soup: BeautifulSoup) -> Dict[str, str]:
        """Extract metadata from the page."""
        metadata = {}

        # Title
        title = soup.find("title")
        if title:
            metadata["title"] = self.clean_text(title.get_text())

        # Meta description
        description = soup.find("meta", attrs={"name": "description"})
        if description:
            metadata["description"] = description.get("content", "")

        # Meta keywords
        keywords = soup.find("meta", attrs={"name": "keywords"})
        if keywords:
            metadata["keywords"] = keywords.get("content", "")

        return metadata

    def add_metadata_header(self, markdown: str, metadata: Dict[str, str], source_url: str = "") -> str:
        """Add metadata header to markdown."""
        header_lines = ["---"]

        if metadata.get("title"):
            header_lines.append(f"title: {metadata['title']}")

        if source_url:
            header_lines.append(f"source: {source_url}")

        if metadata.get("description"):
            header_lines.append(f"description: {metadata['description']}")

        if metadata.get("keywords"):
            header_lines.append(f"keywords: {metadata['keywords']}")

        header_lines.append("---")
        header_lines.append("")

        return "\n".join(header_lines) + markdown


def main():
    """Main function to handle command line interface."""
    parser = argparse.ArgumentParser(
        description="Convert websites to clean, formatted markdown",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Convert website to markdown
  python website_to_markdown_converter.py https://example.com
  
  # Convert with custom output file
  python website_to_markdown_converter.py https://example.com --output article.md
  
  # Convert local HTML file
  python website_to_markdown_converter.py input.html --output article.md
  
  # Extract only tables
  python website_to_markdown_converter.py https://example.com --tables-only --output tables.md
  
  # Convert without images and ads
  python website_to_markdown_converter.py https://example.com --no-images --no-ads
        """,
    )

    parser.add_argument("input", help="Website URL or HTML file path")
    parser.add_argument("--output", "-o", help="Output markdown file path")
    parser.add_argument("--output-dir", "-d", default="./markdown", help="Output directory (default: ./markdown)")
    parser.add_argument("--encoding", "-e", default="utf-8", help="File encoding (default: utf-8)")
    parser.add_argument("--no-images", action="store_true", help="Exclude images from conversion")
    parser.add_argument("--no-links", action="store_true", help="Convert links to plain text")
    parser.add_argument("--no-tables", action="store_true", help="Exclude tables from conversion")
    parser.add_argument("--no-ads", action="store_true", help="Don't remove advertisements (default: remove ads)")
    parser.add_argument("--tables-only", action="store_true", help="Extract only tables as markdown")
    parser.add_argument("--no-metadata", action="store_true", help="Don't add metadata header")

    args = parser.parse_args()

    # Initialize converter
    converter = WebsiteToMarkdownConverter(encoding=args.encoding)

    # Load HTML content
    print(f"📄 Loading HTML from: {args.input}")
    if args.input.startswith(("http://", "https://")):
        soup = converter.load_html_from_url(args.input)
        base_url = args.input
    else:
        soup = converter.load_html_from_file(args.input)
        base_url = ""

    # Get metadata
    metadata = converter.get_page_metadata(soup) if not args.no_metadata else {}

    # Convert to markdown
    print("🔄 Converting to markdown...")
    markdown_content = converter.convert_to_markdown(
        soup,
        base_url=base_url,
        include_images=not args.no_images,
        include_links=not args.no_links,
        include_tables=not args.no_tables,
        remove_ads=not args.no_ads,
        tables_only=args.tables_only,
    )

    # Add metadata header
    if not args.no_metadata and not args.tables_only:
        markdown_content = converter.add_metadata_header(markdown_content, metadata, base_url)

    # Determine output path
    if args.output:
        output_path = args.output
    else:
        # Generate filename from URL or file path
        if args.input.startswith(("http://", "https://")):
            filename = re.sub(r"[^\w\-_.]", "_", urlparse(args.input).path)
            if not filename or filename == "_":
                filename = "page"
        else:
            filename = os.path.splitext(os.path.basename(args.input))[0]

        if args.tables_only:
            filename += "_tables"

        output_path = os.path.join(args.output_dir, f"{filename}.md")

    # Save markdown
    converter.save_markdown(markdown_content, output_path)

    # Print summary
    print(f"\n🎉 Conversion completed successfully!")
    if metadata.get("title"):
        print(f"📝 Title: {metadata['title']}")
    print(f"📊 Content length: {len(markdown_content)} characters")
    print(f"📁 Output: {output_path}")


if __name__ == "__main__":
    main()
