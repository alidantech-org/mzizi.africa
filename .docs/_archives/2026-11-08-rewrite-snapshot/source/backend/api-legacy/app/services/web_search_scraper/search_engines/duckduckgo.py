"""
DuckDuckGo Search Engine Implementation
"""

import urllib.parse
from typing import List, Dict, Any
from playwright.sync_api import Page
from .base import BaseSearchEngine


class DuckDuckGoSearchEngine(BaseSearchEngine):
    """DuckDuckGo search engine implementation"""
    
    def get_engine_name(self) -> str:
        return "DuckDuckGo"
    
    def get_search_url(self, query: str) -> str:
        """Get DuckDuckGo search URL"""
        encoded_query = urllib.parse.quote_plus(query)
        return f"https://duckduckgo.com/?q={encoded_query}"
    
    def parse_search_results(self, page: Page) -> List[Dict[str, Any]]:
        """Parse DuckDuckGo search results"""
        results = []
        
        try:
            # Wait for search results
            try:
                page.wait_for_selector('article[data-testid="result"]', timeout=self.config.wait_timeout)
            except:
                self.logger.warning("Search results not found")
                return results
            
            # Find all result articles
            result_elements = page.query_selector_all('article[data-testid="result"]')
            
            for idx, element in enumerate(result_elements):
                if idx >= self.config.max_results_per_query:
                    break
                
                try:
                    # Extract title and URL
                    title_element = element.query_selector('h2 a, h2')
                    link_element = element.query_selector('a[data-testid="result-title-a"]')
                    snippet_element = element.query_selector('div[data-result="snippet"]')
                    
                    if not title_element:
                        continue
                    
                    title = title_element.inner_text().strip()
                    url = link_element.get_attribute('href') if link_element else ""
                    snippet = snippet_element.inner_text().strip() if snippet_element else ""
                    
                    # Skip if URL is not valid
                    if not url or not url.startswith('http'):
                        continue
                    
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet,
                        'position': idx + 1,
                        'source': 'duckduckgo'
                    })
                    
                except Exception as e:
                    self.logger.debug(f"Error parsing result {idx}: {e}")
                    continue
            
        except Exception as e:
            self.logger.error(f"Error parsing DuckDuckGo results: {e}")
        
        return results
