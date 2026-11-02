"""
Bing Search Engine Implementation
"""

import urllib.parse
from typing import List, Dict, Any
from playwright.sync_api import Page
from .base import BaseSearchEngine


class BingSearchEngine(BaseSearchEngine):
    """Bing search engine implementation - less aggressive bot detection than Google"""
    
    def get_engine_name(self) -> str:
        return "Bing"
    
    def get_search_url(self, query: str) -> str:
        """Get Bing search URL"""
        encoded_query = urllib.parse.quote_plus(query)
        return f"https://www.bing.com/search?q={encoded_query}&count={self.config.max_results_per_query}"
    
    def parse_search_results(self, page: Page) -> List[Dict[str, Any]]:
        """Parse Bing search results"""
        results = []
        
        try:
            # Wait for search results
            try:
                page.wait_for_selector('li.b_algo', timeout=self.config.wait_timeout)
            except:
                self.logger.warning("Search results not found")
                return results
            
            # Find all result items
            result_elements = page.query_selector_all('li.b_algo')
            
            for idx, element in enumerate(result_elements):
                if idx >= self.config.max_results_per_query:
                    break
                
                try:
                    # Extract title and URL
                    title_element = element.query_selector('h2 a')
                    snippet_element = element.query_selector('p, .b_caption p')
                    
                    if not title_element:
                        continue
                    
                    title = title_element.inner_text().strip()
                    url = title_element.get_attribute('href')
                    snippet = snippet_element.inner_text().strip() if snippet_element else ""
                    
                    # Skip if URL is not valid
                    if not url or not url.startswith('http'):
                        continue
                    
                    results.append({
                        'title': title,
                        'url': url,
                        'snippet': snippet,
                        'position': idx + 1,
                        'source': 'bing'
                    })
                    
                except Exception as e:
                    self.logger.debug(f"Error parsing result {idx}: {e}")
                    continue
            
        except Exception as e:
            self.logger.error(f"Error parsing Bing results: {e}")
        
        return results
