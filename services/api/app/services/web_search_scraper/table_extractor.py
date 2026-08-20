"""
Table extraction and CSV export utilities
"""

import csv
import re
from pathlib import Path
from typing import List, Dict, Any, Tuple
from playwright.sync_api import Page
import logging


class TableExtractor:
    """Enhanced table extraction with CSV export capabilities"""

    def __init__(self, output_dir: Path = None):
        self.logger = logging.getLogger(__name__)
        self.output_dir = output_dir or Path(".")

    def extract_tables_as_csv(self, page: Page, page_name: str) -> List[Dict[str, Any]]:
        """
        Extract tables from page and save as CSV files
        
        Args:
            page: Playwright page object
            page_name: Name for the page (for file naming)
            
        Returns:
            List of table information with CSV paths
        """
        tables_info = []
        
        try:
            # Find all tables
            table_elements = page.query_selector_all("table")
            
            if not table_elements:
                self.logger.info("No tables found on page")
                return tables_info
            
            self.logger.info(f"Found {len(table_elements)} table(s) on page")
            
            # Create tables directory
            tables_dir = self.output_dir / "tables"
            tables_dir.mkdir(parents=True, exist_ok=True)
            
            for idx, table in enumerate(table_elements, 1):
                try:
                    # Extract table data
                    table_data, headers = self._extract_table_data(table)
                    
                    if not table_data:
                        continue
                    
                    # Save as CSV
                    csv_filename = f"{page_name}_table_{idx}.csv"
                    csv_path = tables_dir / csv_filename
                    
                    if self._save_table_as_csv(table_data, headers, csv_path):
                        # Also generate markdown for compatibility
                        markdown_table = self._format_table_as_markdown(headers, table_data, idx)
                        
                        tables_info.append({
                            "table_index": idx,
                            "csv_path": str(csv_path),
                            "markdown": markdown_table,
                            "headers": headers,
                            "row_count": len(table_data),
                            "column_count": len(headers) if headers else len(table_data[0]) if table_data else 0
                        })
                        
                        self.logger.info(f"✓ Table {idx} saved: {csv_path} ({len(table_data)} rows)")
                    
                except Exception as e:
                    self.logger.warning(f"Error extracting table {idx}: {e}")
                    continue
                    
        except Exception as e:
            self.logger.error(f"Error extracting tables: {e}")
            
        return tables_info

    def _extract_table_data(self, table) -> Tuple[List[List[str]], List[str]]:
        """
        Extract data and headers from a table element
        
        Returns:
            Tuple of (table_data, headers)
        """
        table_data = []
        headers = []
        
        try:
            # Get all rows
            rows = table.query_selector_all("tr")
            if not rows:
                return table_data, headers
            
            # Extract headers (look for thead or first row with th)
            thead = table.query_selector("thead")
            if thead:
                header_row = thead.query_selector("tr")
                if header_row:
                    ths = header_row.query_selector_all("th")
                    if ths:
                        headers = [th.inner_text().strip() for th in ths]
            else:
                # Check first row for headers
                first_row = rows[0]
                ths = first_row.query_selector_all("th")
                if ths:
                    headers = [th.inner_text().strip() for th in ths]
                elif len(rows) > 1:
                    # If no th tags, check if first row might be headers (different styling)
                    first_row_cells = first_row.query_selector_all("td")
                    if first_row_cells:
                        # Heuristic: if first row has different text style (bold, etc.), treat as headers
                        is_bold = any(
                            "bold" in first_row_cells[i].evaluate("el => getComputedStyle(el).fontWeight || ''").lower()
                            for i in range(len(first_row_cells))
                        )
                        if is_bold:
                            headers = [td.inner_text().strip() for td in first_row_cells]
            
            # Extract data rows (skip header row if we identified headers)
            start_idx = 1 if headers and thead else (1 if headers and not thead else 0)
            
            for row in rows[start_idx:]:
                tds = row.query_selector_all("td")
                if not tds:
                    # Try th if no td (for tables without proper thead/tbody)
                    tds = row.query_selector_all("th")
                
                if tds:
                    row_data = [td.inner_text().strip() for td in tds]
                    # Filter out completely empty rows
                    if any(cell.strip() for cell in row_data):
                        table_data.append(row_data)
            
            # If no headers found but we have data, create generic headers
            if not headers and table_data:
                max_cols = max(len(row) for row in table_data)
                headers = [f"Column_{i+1}" for i in range(max_cols)]
            
        except Exception as e:
            self.logger.warning(f"Error extracting table data: {e}")
            
        return table_data, headers

    def _save_table_as_csv(self, table_data: List[List[str]], headers: List[str], csv_path: Path) -> bool:
        """
        Save table data as CSV file
        
        Args:
            table_data: List of rows
            headers: List of column headers
            csv_path: Path to save CSV file
            
        Returns:
            True if successful, False otherwise
        """
        try:
            with open(csv_path, 'w', newline='', encoding='utf-8') as csvfile:
                writer = csv.writer(csvfile)
                
                # Write headers if available
                if headers:
                    writer.writerow(headers)
                
                # Write data rows
                for row in table_data:
                    # Pad row to match header length
                    if headers:
                        while len(row) < len(headers):
                            row.append("")
                        writer.writerow(row[:len(headers)])
                    else:
                        writer.writerow(row)
                        
            return True
            
        except Exception as e:
            self.logger.error(f"Error saving CSV {csv_path}: {e}")
            return False

    def _format_table_as_markdown(self, headers: List[str], table_data: List[List[str]], table_idx: int) -> str:
        """Format table as markdown for compatibility"""
        md = f"\n### Table {table_idx}\n\n"
        
        if headers:
            md += "| " + " | ".join(headers) + " |\n"
            md += "| " + " | ".join(["---"] * len(headers)) + " |\n"
            
            for row in table_data:
                while len(row) < len(headers):
                    row.append("")
                md += "| " + " | ".join(row[:len(headers)]) + " |\n"
        else:
            # No headers, just data
            for row in table_data:
                md += "| " + " | ".join(row) + " |\n"
                
        return md

    def extract_tables_from_html_content(self, html_content: str, page_name: str) -> List[Dict[str, Any]]:
        """
        Extract tables from HTML content (for HTTP scraper fallback)
        
        Args:
            html_content: Raw HTML content
            page_name: Name for the page (for file naming)
            
        Returns:
            List of table information with CSV paths
        """
        from bs4 import BeautifulSoup
        
        tables_info = []
        
        try:
            soup = BeautifulSoup(html_content, 'html.parser')
            table_elements = soup.find_all('table')
            
            if not table_elements:
                return tables_info
            
            # Create tables directory
            tables_dir = self.output_dir / "tables"
            tables_dir.mkdir(parents=True, exist_ok=True)
            
            for idx, table in enumerate(table_elements, 1):
                try:
                    # Extract table data using BeautifulSoup
                    table_data, headers = self._extract_table_data_bs4(table)
                    
                    if not table_data:
                        continue
                    
                    # Save as CSV
                    csv_filename = f"{page_name}_table_{idx}.csv"
                    csv_path = tables_dir / csv_filename
                    
                    if self._save_table_as_csv(table_data, headers, csv_path):
                        # Generate markdown
                        markdown_table = self._format_table_as_markdown(headers, table_data, idx)
                        
                        tables_info.append({
                            "table_index": idx,
                            "csv_path": str(csv_path),
                            "markdown": markdown_table,
                            "headers": headers,
                            "row_count": len(table_data),
                            "column_count": len(headers) if headers else len(table_data[0]) if table_data else 0
                        })
                        
                        self.logger.info(f"✓ Table {idx} saved from HTML: {csv_path} ({len(table_data)} rows)")
                    
                except Exception as e:
                    self.logger.warning(f"Error extracting table {idx} from HTML: {e}")
                    continue
                    
        except Exception as e:
            self.logger.error(f"Error parsing HTML for tables: {e}")
            
        return tables_info

    def _extract_table_data_bs4(self, table) -> Tuple[List[List[str]], List[str]]:
        """
        Extract data and headers from a BeautifulSoup table element
        
        Returns:
            Tuple of (table_data, headers)
        """
        table_data = []
        headers = []
        
        try:
            # Find thead for headers
            thead = table.find('thead')
            if thead:
                header_row = thead.find('tr')
                if header_row:
                    ths = header_row.find_all(['th', 'td'])
                    headers = [th.get_text(strip=True) for th in ths]
            else:
                # Check first row for headers
                first_row = table.find('tr')
                if first_row:
                    ths = first_row.find_all('th')
                    if ths:
                        headers = [th.get_text(strip=True) for th in ths]
            
            # Extract data rows
            tbody = table.find('tbody') or table
            rows = tbody.find_all('tr')
            
            # Skip header row if we identified headers and it's the first row
            start_idx = 0
            if headers and rows and rows[0].find_all('th'):
                start_idx = 1
            
            for row in rows[start_idx:]:
                cells = row.find_all(['td', 'th'])
                if cells:
                    row_data = [cell.get_text(strip=True) for cell in cells]
                    if any(cell.strip() for cell in row_data):
                        table_data.append(row_data)
            
            # If no headers found but we have data, create generic headers
            if not headers and table_data:
                max_cols = max(len(row) for row in table_data)
                headers = [f"Column_{i+1}" for i in range(max_cols)]
                
        except Exception as e:
            self.logger.warning(f"Error extracting table data with BeautifulSoup: {e}")
            
        return table_data, headers
