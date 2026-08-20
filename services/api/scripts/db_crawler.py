#!/usr/bin/env python3
"""
Database-Integrated Web Crawler - Fixed Version

A Python script that:
1. Crawls websites and saves data to PostgreSQL database
2. Tracks visited sites and links with status
3. Extracts all content types (PDFs, images, videos, etc.)
4. Maintains separate tables for sites and links
5. Tracks content categories and file types
"""

import argparse
import re
import sys
import time
from urllib.parse import urljoin, urlparse
from collections import defaultdict
import requests
import urllib3
from typing import Optional, List, Dict
import psycopg2

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

try:
    from bs4 import BeautifulSoup
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install with: pip install beautifulsoup4 requests psycopg2-binary")
    sys.exit(1)


class DatabaseCrawler:
    """Database-integrated web crawler with comprehensive content tracking."""

    def __init__(self, delay: float = 1.0):
        self.delay = delay
        self.db_url = "postgresql://admin:strongpassword@192.168.100.13:5432/polifin"
        self.visited_links = set()
        self.processed_sites = set()
        self.link_frequency = defaultdict(int)
        
        # Initialize database connection
        self.init_database()

    def init_database(self):
        """Initialize database tables."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            
            # Sites table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS sites (
                    id SERIAL PRIMARY KEY,
                    domain VARCHAR(255) UNIQUE NOT NULL,
                    base_url TEXT NOT NULL,
                    first_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_visited TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    is_active BOOLEAN DEFAULT TRUE,
                    total_pages_found INTEGER DEFAULT 0,
                    total_links_found INTEGER DEFAULT 0,
                    crawl_status VARCHAR(50) DEFAULT 'pending',
                    error_count INTEGER DEFAULT 0
                )
            """)
            
            # Links table - Fixed file_extension size
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS links (
                    id SERIAL PRIMARY KEY,
                    site_id INTEGER REFERENCES sites(id),
                    url TEXT UNIQUE NOT NULL,
                    path TEXT,
                    full_path TEXT,
                    link_text TEXT,
                    title TEXT,
                    target VARCHAR(50),
                    rel TEXT,
                    content_type VARCHAR(100),
                    file_extension VARCHAR(50),
                    file_size INTEGER,
                    is_internal BOOLEAN DEFAULT TRUE,
                    is_persistent BOOLEAN DEFAULT FALSE,
                    discovery_count INTEGER DEFAULT 1,
                    first_discovered TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    crawl_status VARCHAR(50) DEFAULT 'pending',
                    http_status INTEGER,
                    response_time_ms INTEGER,
                    content_hash VARCHAR(64),
                    meta_description TEXT,
                    meta_keywords TEXT
                )
            """)
            
            # Create indexes separately
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_links_url ON links(url)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_links_content_type ON links(content_type)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_links_file_extension ON links(file_extension)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_links_crawl_status ON links(crawl_status)")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_links_site_id ON links(site_id)")

            # Content categories table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS content_categories (
                    id SERIAL PRIMARY KEY,
                    link_id INTEGER REFERENCES links(id),
                    category VARCHAR(100),
                    subcategory VARCHAR(100),
                    confidence FLOAT DEFAULT 1.0,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            # Media assets table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS media_assets (
                    id SERIAL PRIMARY KEY,
                    link_id INTEGER REFERENCES links(id),
                    src_url TEXT NOT NULL,
                    alt_text TEXT,
                    width INTEGER,
                    height INTEGER,
                    file_type VARCHAR(20),
                    file_size INTEGER,
                    is_internal BOOLEAN DEFAULT TRUE,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            conn.commit()
            conn.close()
            print("✅ Database tables initialized successfully")
            
        except Exception as e:
            print(f"❌ Database initialization error: {e}")
            sys.exit(1)

    def get_site_id(self, domain: str, base_url: str) -> int:
        """Get or create site ID."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            
            cursor.execute("SELECT id FROM sites WHERE domain = %s", (domain,))
            result = cursor.fetchone()
            
            if result:
                site_id = result[0]
                cursor.execute(
                    "UPDATE sites SET last_visited = CURRENT_TIMESTAMP WHERE id = %s",
                    (site_id,)
                )
            else:
                cursor.execute(
                    "INSERT INTO sites (domain, base_url) VALUES (%s, %s) RETURNING id",
                    (domain, base_url)
                )
                site_id = cursor.fetchone()[0]
            
            conn.commit()
            conn.close()
            return site_id
            
        except Exception as e:
            print(f"❌ Error getting site ID: {e}")
            return -1

    def extract_content_type(self, url: str, text: str = "") -> str:
        """Extract content type from URL and text."""
        url_lower = url.lower()
        
        # File extensions
        if url_lower.endswith('.pdf'):
            return 'PDF Document'
        elif url_lower.endswith(('.doc', '.docx')):
            return 'Word Document'
        elif url_lower.endswith(('.xls', '.xlsx')):
            return 'Excel Spreadsheet'
        elif url_lower.endswith(('.ppt', '.pptx')):
            return 'PowerPoint'
        elif url_lower.endswith(('.jpg', '.jpeg', '.png', '.gif', '.webp')):
            return 'Image'
        elif url_lower.endswith(('.mp4', '.avi', '.mov', '.wmv')):
            return 'Video'
        elif url_lower.endswith(('.mp3', '.wav', '.ogg')):
            return 'Audio'
        elif url_lower.endswith('.zip'):
            return 'Archive'
        
        # Content patterns
        if any(pattern in url_lower for pattern in ['bill', 'act', 'law']):
            return 'Legislation'
        elif any(pattern in url_lower for pattern in ['tender', 'procurement', 'bid']):
            return 'Procurement'
        elif any(pattern in url_lower for pattern in ['report', 'publication']):
            return 'Report'
        elif any(pattern in url_lower for pattern in ['news', 'press', 'media']):
            return 'News'
        elif any(pattern in url_lower for pattern in ['vacancy', 'job', 'career']):
            return 'Employment'
        elif any(pattern in url_lower for pattern in ['constitution', 'chapter']):
            return 'Constitution'
        elif any(pattern in url_lower for pattern in ['gallery', 'photo', 'image']):
            return 'Gallery'
        
        return 'Web Page'

    def extract_file_extension(self, url: str) -> str:
        """Extract file extension from URL."""
        parsed = urlparse(url)
        path = parsed.path
        if '.' in path:
            return path.split('.')[-1].lower()
        return ''

    def load_html_from_url(self, url: str) -> Optional[BeautifulSoup]:
        """Load HTML content from a URL with detailed tracking."""
        try:
            start_time = time.time()
            headers = {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
            
            response = requests.get(
                url, 
                headers=headers, 
                timeout=30,
                verify=False
            )
            
            response_time = int((time.time() - start_time) * 1000)
            
            self.update_link_status(url, {
                'http_status': response.status_code,
                'response_time_ms': response_time,
                'crawl_status': 'visited' if response.status_code == 200 else 'error'
            })
            
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
            
        except requests.RequestException as e:
            self.update_link_status(url, {
                'crawl_status': 'failed',
                'error_count': 1
            })
            print(f"❌ Error fetching URL {url}: {e}")
            return None

    def update_link_status(self, url: str, updates: Dict):
        """Update link status in database."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            
            set_clauses = []
            values = []
            
            for key, value in updates.items():
                set_clauses.append(f"{key} = %s")
                values.append(value)
            
            if set_clauses:
                query = f"UPDATE links SET {', '.join(set_clauses)}, last_seen = CURRENT_TIMESTAMP WHERE url = %s"
                values.append(url)
                cursor.execute(query, values)
                conn.commit()
            
            conn.close()
            
        except Exception as e:
            print(f"❌ Error updating link status: {e}")

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

    def extract_meta_data(self, soup: BeautifulSoup) -> Dict:
        """Extract meta data from page."""
        meta_data = {}
        
        desc_tag = soup.find('meta', attrs={'name': 'description'})
        if desc_tag:
            meta_data['meta_description'] = desc_tag.get('content', '')
        
        keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
        if keywords_tag:
            meta_data['meta_keywords'] = keywords_tag.get('content', '')
        
        return meta_data

    def extract_links(self, soup: BeautifulSoup, base_url: str, site_id: int, is_index_page: bool = False) -> List[Dict]:
        """Extract all links from the HTML."""
        if not soup:
            return []

        all_links = []
        domain = urlparse(base_url).netloc

        for a_tag in soup.find_all("a", href=True):
            href = str(a_tag["href"])
            text = self.clean_text(a_tag.get_text())

            if not href.strip():
                continue

            href_lower = href.lower()
            if href_lower.startswith(("javascript:", "mailto:", "tel:", "#")):
                continue

            if href.startswith("http"):
                absolute_url = href
            else:
                absolute_url = urljoin(base_url, href)

            link_domain = urlparse(absolute_url).netloc
            is_internal = link_domain == domain

            if not is_internal:
                continue

            content_type = self.extract_content_type(absolute_url, text)
            file_extension = self.extract_file_extension(absolute_url)

            link_data = {
                "site_id": site_id,
                "url": absolute_url,
                "path": urlparse(absolute_url).path,
                "full_path": absolute_url,
                "link_text": text,
                "title": a_tag.get("title", ""),
                "target": a_tag.get("target", ""),
                "rel": " ".join(str(item) for item in a_tag.get("rel") or []) if a_tag.get("rel") else "",
                "content_type": content_type,
                "file_extension": file_extension,
                "is_internal": is_internal,
                "is_persistent": False,
                "discovery_count": 1,
                "crawl_status": "pending"
            }

            all_links.append(link_data)
            self.link_frequency[absolute_url] += 1

        if not is_index_page:
            for link in all_links:
                if self.link_frequency[link["url"]] > 3:
                    link["is_persistent"] = True

        return all_links

    def save_links_to_db(self, links: List[Dict]):
        """Save links to database with proper error handling."""
        if not links:
            return
            
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            
            saved_count = 0
            for link in links:
                try:
                    # Truncate file_extension to prevent errors
                    file_ext = link['file_extension'][:50] if link['file_extension'] else ''
                    
                    cursor.execute("""
                        INSERT INTO links 
                        (site_id, url, path, full_path, link_text, title, target, rel,
                         content_type, file_extension, is_internal, is_persistent,
                         discovery_count, crawl_status)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (url) DO UPDATE SET
                            discovery_count = links.discovery_count + 1,
                            last_seen = CURRENT_TIMESTAMP,
                            is_persistent = EXCLUDED.is_persistent
                        RETURNING id
                    """, (
                        link['site_id'], link['url'], link['path'], link['full_path'],
                        link['link_text'], link['title'], link['target'], link['rel'],
                        link['content_type'], file_ext, link['is_internal'],
                        link['is_persistent'], link['discovery_count'], link['crawl_status']
                    ))
                    
                    link_id = cursor.fetchone()[0]
                    saved_count += 1
                    
                    # Add content category
                    if link['content_type'] != 'Web Page':
                        cursor.execute("""
                            INSERT INTO content_categories (link_id, category)
                            VALUES (%s, %s) ON CONFLICT DO NOTHING
                        """, (link_id, link['content_type']))
                    
                except Exception as e:
                    print(f"❌ Error saving link {link['url'][:50]}...: {e}")
                    # Continue with next link instead of aborting transaction
                    continue
            
            conn.commit()
            conn.close()
            print(f"✅ Saved {saved_count}/{len(links)} links to database")
            
        except Exception as e:
            print(f"❌ Database error saving links: {e}")

    def crawl_page(self, url: str, site_id: int, is_index_page: bool = False) -> List[Dict]:
        """Crawl a single page and extract all data."""
        print(f"🔍 Crawling: {url}")
        
        soup = self.load_html_from_url(url)
        if not soup:
            return []
        
        meta_data = self.extract_meta_data(soup)
        links = self.extract_links(soup, url, site_id, is_index_page)
        
        # Update meta data for current page
        if meta_data:
            self.update_link_status(url, meta_data)
        
        print(f"✅ Extracted {len(links)} links from {url}")
        return links

    def crawl(self, seed_url: str, max_pages: int = 500) -> None:
        """Main crawling function with database storage."""
        parsed_url = urlparse(seed_url)
        domain = parsed_url.netloc
        
        print(f"🚀 Starting database-integrated crawling: {seed_url}")
        print(f"🌐 Domain: {domain}")
        
        site_id = self.get_site_id(domain, seed_url)
        if site_id == -1:
            print("❌ Failed to create site record")
            return
        
        self.load_visited_links(site_id)
        crawled_count = 0
        
        def crawl_recursive(url: str, depth: int = 0, max_depth: int = 10):
            nonlocal crawled_count
            
            if depth > max_depth or url in self.visited_links or crawled_count >= max_pages:
                return []
            
            is_index = crawled_count == 0
            new_links = self.crawl_page(url, site_id, is_index)
            self.visited_links.add(url)
            crawled_count += 1
            
            self.save_links_to_db(new_links)
            self.update_site_stats(site_id, crawled_count, len(self.visited_links))
            
            for link in new_links:
                link_url = link["url"]
                if link_url not in self.visited_links:
                    time.sleep(self.delay)
                    crawl_recursive(link_url, depth + 1, max_depth)
            
            return new_links
        
        crawl_recursive(seed_url)
        self.update_site_status(site_id, 'completed', crawled_count, len(self.visited_links))
        
        print(f"\n🎉 Database crawling completed!")
        print(f"📊 Pages crawled: {crawled_count}")
        print(f"🔗 Unique links found: {len(self.visited_links)}")
        print(f"🗄️ All data saved to database")

    def load_visited_links(self, site_id: int):
        """Load previously visited links from database."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            cursor.execute("SELECT url FROM links WHERE site_id = %s", (site_id,))
            self.visited_links = {row[0] for row in cursor.fetchall()}
            conn.close()
            print(f"📂 Loaded {len(self.visited_links)} previously visited links")
        except Exception as e:
            print(f"❌ Error loading visited links: {e}")

    def update_site_stats(self, site_id: int, pages_crawled: int, total_links: int):
        """Update site statistics."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sites SET 
                    total_pages_found = %s,
                    total_links_found = %s,
                    crawl_status = 'crawling'
                WHERE id = %s
            """, (pages_crawled, total_links, site_id))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"❌ Error updating site stats: {e}")

    def update_site_status(self, site_id: int, status: str, pages_crawled: int, total_links: int):
        """Update final site status."""
        try:
            conn = psycopg2.connect(self.db_url)
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE sites SET 
                    crawl_status = %s,
                    total_pages_found = %s,
                    total_links_found = %s,
                    last_visited = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (status, pages_crawled, total_links, site_id))
            conn.commit()
            conn.close()
        except Exception as e:
            print(f"❌ Error updating site status: {e}")


def main():
    """Main function to handle command line interface."""
    parser = argparse.ArgumentParser(
        description="Database-integrated web crawler",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Crawl a website to database
  python db_crawler_fixed.py https://example.com
  
  # Crawl with custom delay
  python db_crawler_fixed.py https://example.com --delay 2.0
        """,
    )

    parser.add_argument("seed_url", help="Starting URL for crawling")
    parser.add_argument("--delay", "-d", type=float, default=1.0,
                       help="Delay between requests in seconds (default: 1.0)")
    parser.add_argument("--max-pages", "-m", type=int, default=500,
                       help="Maximum pages to crawl (default: 500)")

    args = parser.parse_args()

    crawler = DatabaseCrawler(delay=args.delay)
    crawler.crawl(args.seed_url, args.max_pages)


if __name__ == "__main__":
    main()
