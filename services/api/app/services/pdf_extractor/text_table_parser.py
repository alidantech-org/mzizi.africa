"""
Text Table Parser Module
Extracts tables from text content when standard PDF extraction methods fail
"""

import re
import pandas as pd
import logging
from typing import List


class TextTableParser:
    """Parse tables from text content using regex patterns and heuristics"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
    
    def extract_tables_from_text(self, text_content: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables from text content using pattern matching"""
        if not text_content or not text_content.strip():
            return []
        
        tables = []
        
        # Method 1: Look for numbered table patterns (Table 1.1, Table 1.2, etc.)
        numbered_tables = self._extract_numbered_tables(text_content, page_num)
        tables.extend(numbered_tables)
        
        # Method 2: Look for S/No. patterns (serial number tables)
        sno_tables = self._extract_sno_tables(text_content, page_num)
        tables.extend(sno_tables)
        
        # Method 3: Look for columnar data patterns
        columnar_tables = self._extract_columnar_tables(text_content, page_num)
        tables.extend(columnar_tables)
        
        self.logger.info(f"[INFO] Page {page_num} - Text parser extracted {len(tables)} tables")
        return tables
    
    def _extract_numbered_tables(self, text_content: str, page_num: int) -> List[pd.DataFrame]:
        """Extract numbered tables from text"""
        tables = []
        
        # Pattern to match table headers like "Table 1.1 Distribution of..."
        table_pattern = r'(Table\s+\d+\.\d+\s+[^\n]+(?:\n(?!\s*\d+\.\s+)[^\n]*)*)'
        table_matches = list(re.finditer(table_pattern, text_content, re.IGNORECASE))
        
        for match in table_matches:
            table_title = match.group(1).strip()
            table_start = match.end()
            
            # Find the end of this table (next table or page break)
            remaining_text = text_content[table_start:]
            next_table_match = re.search(r'Table\s+\d+\.\d+', remaining_text, re.IGNORECASE)
            
            if next_table_match:
                table_content = remaining_text[:next_table_match.start()]
            else:
                table_content = remaining_text
            
            # Parse the table content
            df = self._parse_table_content(table_content, table_title, page_num)
            if df is not None and not df.empty:
                tables.append(df)
                self.logger.info(f"[SUCCESS] Page {page_num} - Extracted numbered table: {table_title[:50]}...")
        
        return tables
    
    def _extract_sno_tables(self, text_content: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables with S/No. (serial number) patterns"""
        tables = []
        
        # Pattern to match S/No. followed by table data
        sno_pattern = r'(S/No\.\s+.*?\n)((?:\d+\.\s+.*?\n)*)'
        
        matches = re.finditer(sno_pattern, text_content, re.MULTILINE)
        
        for match in matches:
            header_line = match.group(1).strip()
            data_lines = match.group(2).strip()
            
            # Parse header
            headers = self._parse_header_line(header_line)
            
            # Parse data rows
            rows = self._parse_data_rows(data_lines)
            
            if headers and rows:
                df = pd.DataFrame(rows, columns=headers)
                tables.append(df)
                self.logger.info(f"[SUCCESS] Page {page_num} - Extracted S/No. table with {len(rows)} rows")
        
        return tables
    
    def _extract_columnar_tables(self, text_content: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables with columnar data patterns"""
        tables = []
        
        # Split content into lines
        lines = [line.strip() for line in text_content.split('\n') if line.strip()]
        
        # Look for patterns that suggest tabular data
        for i, line in enumerate(lines):
            # Safe string conversion and header check
            if not isinstance(line, str):
                line = str(line)
            
            # Check if line looks like a header (contains common table terms)
            if any(term in line.lower() for term in ['s/no', 'party', 'name', 'kshs', 'amount', 'year']):
                # Look ahead for data rows
                potential_rows = []
                j = i + 1
                
                while j < len(lines) and j < i + 20:  # Look at next 20 lines max
                    next_line = lines[j]
                    
                    # Check if this looks like a data row (starts with number or has monetary amounts)
                    if re.match(r'^\d+\.', next_line) or re.search(r'\d{1,3}(?:,\d{3})*(?:\.\d{2})?', next_line):
                        potential_rows.append(next_line)
                    elif not next_line or next_line.startswith('Table') or next_line.startswith('Page'):
                        break  # End of table
                    else:
                        # Maybe it's a continuation row
                        if potential_rows and re.search(r'[A-Za-z]', next_line):
                            potential_rows[-1] += ' ' + next_line
                        else:
                            break
                    
                    j += 1
                
                # If we found enough rows, try to parse as table
                if len(potential_rows) >= 2:
                    df = self._parse_mixed_format_table(line, potential_rows, page_num)
                    if df is not None and not df.empty:
                        tables.append(df)
                        self.logger.info(f"[SUCCESS] Page {page_num} - Extracted columnar table with {len(df)} rows")
        
        return tables
    
    def _parse_table_content(self, content: str, table_title: str, page_num: int) -> pd.DataFrame:
        """Parse table content into a DataFrame with safe data handling"""
        try:
            # Split into lines and clean
            lines = [line.strip() for line in content.split('\n') if line.strip()]
            
            if len(lines) < 2:
                return None
            
            # Parse headers and data safely
            table_rows = []
            for line in lines:
                try:
                    # Try different delimiters safely
                    delimiters = ['\t', '|', '  ', '   ', ',', ';']
                    parsed_row = line
                    
                    for delim in delimiters:
                        if delim in line and isinstance(line, str):
                            parsed_row = [cell.strip() for cell in line.split(delim) if cell.strip()]
                            break
                    
                    # Ensure we have a list
                    if isinstance(parsed_row, str):
                        parsed_row = [parsed_row]
                    
                    # Convert all items to strings safely
                    safe_row = []
                    for item in parsed_row:
                        if item is None:
                            safe_row.append('')
                        elif isinstance(item, (int, float)):
                            safe_row.append(str(item))
                        else:
                            safe_row.append(str(item))
                    
                    table_rows.append(safe_row)
                    
                except Exception as row_error:
                    self.logger.debug(f"[DEBUG] Failed to parse row: {line[:50]}... - {row_error}")
                    # Add as single column if parsing fails
                    table_rows.append([str(line)])
            
            if len(table_rows) < 2:
                return None
            
            # Find max columns and pad safely
            max_cols = max(len(row) for row in table_rows)
            formatted_rows = []
            
            for row in table_rows:
                # Pad row to max columns
                safe_row = row + [''] * (max_cols - len(row))
                formatted_rows.append(safe_row[:max_cols])
            
            # Create DataFrame with safe column names
            if formatted_rows:
                # Generate safe column names
                columns = []
                if len(formatted_rows) > 0:
                    first_row = formatted_rows[0]
                    for i, col_name in enumerate(first_row):
                        if col_name and len(str(col_name)) > 0:
                            # Clean column name
                            safe_name = str(col_name).replace('\n', ' ').strip()
                            if len(safe_name) > 50:
                                safe_name = safe_name[:50]
                            columns.append(safe_name)
                        else:
                            columns.append(f'Column_{i+1}')
                
                df = pd.DataFrame(formatted_rows[1:] if len(formatted_rows) > 1 else formatted_rows, 
                                columns=columns[:max_cols])
                
                self.logger.info(f"[SUCCESS] Page {page_num} - Parsed table: {len(df)}x{len(df.columns)}")
                return df
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to parse table content for page {page_num}: {e}")
            return None
    
    def _parse_header_line(self, header_line: str) -> List[str]:
        """Parse header line into column names"""
        # Common delimiters in table headers
        delimiters = [r'\s{2,}', r'\t', r'\|']
        
        for delim in delimiters:
            if re.search(delim, header_line):
                parts = re.split(delim, header_line)
                return [part.strip() for part in parts if part.strip()]
        
        # If no clear delimiter, try to split by spaces but preserve multi-word headers
        parts = []
        current = []
        words = header_line.split()
        
        for word in words:
            if word[0].isupper() and current and word not in ['Kshs.', 'Kshs']:
                parts.append(' '.join(current))
                current = [word]
            else:
                current.append(word)
        
        if current:
            parts.append(' '.join(current))
        
        return [part.strip() for part in parts if part.strip()]
    
    def _parse_data_rows(self, data_text: str) -> List[List[str]]:
        """Parse data rows from text"""
        rows = []
        lines = [line.strip() for line in data_text.split('\n') if line.strip()]
        
        for line in lines:
            row = self._parse_data_row(line)
            if row:
                rows.append(row)
        
        return rows
    
    def _parse_data_row(self, line: str) -> List[str]:
        """Parse a single data row"""
        # Handle numbered rows (1., 2., 3., etc.)
        if re.match(r'^\d+\.', line):
            # Split by number pattern first
            parts = re.split(r'(\d+\.)', line)
            parts = [p for p in parts if p.strip()]
            
            # Then split remaining parts by spaces or monetary amounts
            row = []
            for part in parts:
                if re.match(r'^\d+\.', part):
                    row.append(part.strip())
                else:
                    # Split by monetary amounts and large numbers
                    sub_parts = re.split(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', part)
                    sub_parts = [p.strip() for p in sub_parts if p.strip()]
                    row.extend(sub_parts)
            
            return row
        
        # Handle rows with monetary amounts
        if re.search(r'\d{1,3}(?:,\d{3})*(?:\.\d{2})?', line):
            parts = re.split(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', line)
            return [p.strip() for p in parts if p.strip()]
        
        # Default: split by multiple spaces
        parts = re.split(r'\s{2,}', line)
        return [part.strip() for part in parts if part.strip()]
    
    def _infer_headers_from_data(self, sample_lines: List[str]) -> List[str]:
        """Infer column headers from sample data lines"""
        if not sample_lines:
            return []
        
        # Analyze the structure of sample lines
        max_parts = 0
        all_parts = []
        
        for line in sample_lines:
            parts = self._parse_data_row(line)
            all_parts.append(parts)
            max_parts = max(max_parts, len(parts))
        
        # Generate generic headers
        headers = []
        for i in range(max_parts):
            if i == 0:
                headers.append('S/No.')
            elif i == max_parts - 1:
                headers.append('Amount')
            else:
                headers.append(f'Column_{i}')
        
        return headers
    
    def _parse_mixed_format_table(self, header_line: str, data_lines: List[str], page_num: int) -> pd.DataFrame:
        """Parse table with mixed format (like the political parties data)"""
        # Parse header
        headers = self._parse_header_line(header_line)
        
        # Parse each data row
        rows = []
        for line in data_lines:
            row = self._parse_mixed_format_row(line)
            if row:
                rows.append(row)
        
        # Ensure consistent column count
        max_cols = max(len(headers), max(len(r) for r in rows) if rows else 0)
        
        # Pad headers if needed
        while len(headers) < max_cols:
            headers.append(f'Column_{len(headers)}')
        
        # Pad rows if needed
        formatted_rows = []
        for row in rows:
            while len(row) < max_cols:
                row.append('')
            formatted_rows.append(row[:max_cols])
        
        return pd.DataFrame(formatted_rows, columns=headers)
        
        return None
    
    def _parse_mixed_format_row(self, line: str) -> List[str]:
        """Parse a row with mixed format (number, text, amount)"""
        # Pattern: number. party_name amount
        # Example: "1. The National Alliance (TNA ) 88,834,394.40"
        
        # Extract the number first
        number_match = re.match(r'^(\d+)\.\s*(.*)', line)
        if not number_match:
            # Try to parse as simple space-separated values
            parts = re.split(r'\s{2,}', line.strip())
            return [part.strip() for part in parts if part.strip()]
        
        number = number_match.group(1)
        rest = number_match.group(2).strip()
        
        # Extract the amount at the end
        amount_match = re.search(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*$', rest)
        if amount_match:
            amount = amount_match.group(1)
            party_name = rest[:amount_match.start()].strip()
        else:
            # Try to find monetary amounts anywhere in the string
            amount_matches = list(re.finditer(r'(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)', rest))
            if amount_matches:
                last_match = amount_matches[-1]
                amount = last_match.group(1)
                party_name = rest[:last_match.start()].strip()
            else:
                amount = ''
                party_name = rest
        
        return [f"{number}.", party_name, amount]
