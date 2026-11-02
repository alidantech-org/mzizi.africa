"""
OCR Table Extractor Module
Handles image-based table extraction using Tesseract and computer vision
"""

import logging
import io
from pathlib import Path
from typing import List, Dict, Any

import pandas as pd
import numpy as np

try:
    import fitz  # PyMuPDF
    from PIL import Image
    import pytesseract
    import cv2
    OCR_AVAILABLE = True
except ImportError:
    OCR_AVAILABLE = False


class OCRTableExtractor:
    """OCR-based table extraction for image-based PDF content"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.ocr_available = OCR_AVAILABLE
        
    def extract_tables_from_page(self, pdf_path: str, page_num: int, output_dir: Path, ocr_dir: Path = None) -> List[pd.DataFrame]:
        """Extract tables from PDF page using OCR"""
        try:
            self.logger.info(f"[INFO] Page {page_num} - Starting OCR table extraction")
            
            # Check if OCR libraries are available
            if not self._check_ocr_libraries():
                self.logger.warning(f"[WARNING] OCR libraries not available for page {page_num}")
                return []
            
            # Use the existing OCR extraction logic
            return self._extract_with_ocr(pdf_path, page_num, output_dir, ocr_dir)
            
        except Exception as e:
            if "tesseract is not installed" in str(e):
                self.logger.warning(f"[WARNING] Tesseract OCR engine not installed. Install from: https://github.com/UB-Mannisch/tesseract-ocr/releases")
            else:
                self.logger.error(f"[ERROR] OCR extraction failed for page {page_num}: {e}")
            return []
    
    def _extract_with_ocr(self, pdf_path: str, page_num: int, output_dir: Path, ocr_dir: Path = None) -> List[pd.DataFrame]:
        """Extract tables using OCR (original method)"""
        try:
            import fitz  # PyMuPDF
            from PIL import Image
            import pytesseract
            import cv2
            import numpy as np
            import io
            
            self.logger.info(f"[INFO] Page {page_num} - Performing OCR table extraction")
            
            # Convert PDF page to image
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]  # PDF pages are 0-indexed
            
            # Get page as image
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better OCR
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("png")
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(img_data))
            
            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Preprocess for better OCR
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            
            # Apply threshold to get better text extraction
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Use Tesseract to extract text with table data
            custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
            text = pytesseract.image_to_string(thresh, config=custom_config)
            
            self.logger.debug(f"[DEBUG] Page {page_num} - OCR extracted text length: {len(text)}")
            
            # Save extracted text for debugging in OCR folder
            if ocr_dir is None:
                ocr_dir = output_dir / "ocr"
                ocr_dir.mkdir(exist_ok=True)
            text_path = ocr_dir / f"page_{page_num:03d}_ocr_text.txt"
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Try to extract table structure using Tesseract
            tables = self._extract_table_structure(thresh, page_num, output_dir)
            
            if not tables:
                # Fallback: Extract text and try to parse as simple table
                tables = self._parse_text_as_table(text, page_num)
            
            doc.close()
            return tables
            
        except Exception as e:
            if "tesseract is not installed" in str(e):
                self.logger.warning(f"[WARNING] Tesseract OCR engine not installed. Install from: https://github.com/UB-Mannisch/tesseract-ocr/releases")
            else:
                self.logger.error(f"[ERROR] OCR extraction failed for page {page_num}: {e}")
            return []
    
    def _check_ocr_libraries(self) -> bool:
        """Check if OCR libraries are available"""
        return self.ocr_available
    
    def _convert_page_to_image(self, pdf_path: str, page_num: int, output_dir: Path) -> str:
        """Convert PDF page to image"""
        try:
            # Convert PDF page to image
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]  # PDF pages are 0-indexed
            
            # Get page as image
            mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better OCR
            pix = page.get_pixmap(matrix=mat)
            img_data = pix.tobytes("png")
            
            # Convert to PIL Image
            image = Image.open(io.BytesIO(img_data))
            
            # Convert to OpenCV format
            cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Preprocess for better OCR
            gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
            
            # Apply threshold to get better text extraction
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
            
            # Save processed image for debugging
            debug_image_path = output_dir / f"page_{page_num:03d}_ocr_processed.png"
            cv2.imwrite(str(debug_image_path), thresh)
            
            # Use Tesseract to extract text with table data
            custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
            text = pytesseract.image_to_string(thresh, config=custom_config)
            
            self.logger.debug(f"[DEBUG] Page {page_num} - OCR extracted text length: {len(text)}")
            
            # Save extracted text for debugging in OCR folder
            if ocr_dir is None:
                ocr_dir = output_dir / "ocr"
                ocr_dir.mkdir(exist_ok=True)
            text_path = ocr_dir / f"page_{page_num:03d}_ocr_text.txt"
            with open(text_path, 'w', encoding='utf-8') as f:
                f.write(text)
            
            # Try to extract table structure using Tesseract
            tables = self._extract_table_structure(thresh, page_num, output_dir)
            
            if not tables:
                # Fallback: Extract text and try to parse as simple table
                tables = self._parse_text_as_table(text, page_num)
            
            doc.close()
            return tables
            
        except Exception as e:
            self.logger.error(f"[ERROR] OCR extraction failed for page {page_num}: {e}")
            return []
    
    def _extract_table_structure(self, thresh_image, page_num: int, output_dir: Path) -> List[pd.DataFrame]:
        """Extract table structure using Tesseract's table detection"""
        try:
            # Get table structure
            custom_config = r'--oem 3 --psm 6 -c preserve_interword_spaces=1'
            table_data = pytesseract.image_to_data(thresh_image, output_type=pytesseract.Output.DICT, config=custom_config)
            
            # Convert to DataFrame
            if table_data and len(table_data['text']) > 0:
                # Simple table extraction - group by line
                lines = {}
                for i in range(len(table_data['text'])):
                    if table_data['text'][i].strip():
                        line_num = table_data['line_num'][i]
                        if line_num not in lines:
                            lines[line_num] = []
                        lines[line_num].append(table_data['text'][i].strip())
                
                # Convert to DataFrame
                if lines:
                    # Find the longest line to determine column count
                    max_cols = max(len(line) for line in lines.values())
                    
                    # Create DataFrame
                    table_rows = []
                    for line_num in sorted(lines.keys()):
                        row = lines[line_num]
                        # Pad row to max columns
                        while len(row) < max_cols:
                            row.append('')
                        table_rows.append(row)
                    
                    if len(table_rows) > 1:  # At least header + one data row
                        df = pd.DataFrame(table_rows)
                        self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted table: {len(df)}x{len(df.columns)}")
                        
                        # Save OCR table
                        csv_path = output_dir / f"page_{page_num:03d}_ocr_table.csv"
                        df.to_csv(csv_path, index=False)
                        
                        return [df]
            
            return []
            
        except Exception as e:
            self.logger.debug(f"[DEBUG] Page {page_num} - OCR table structure extraction failed: {e}")
            return []
    
    def _parse_text_as_table(self, text: str, page_num: int) -> List[pd.DataFrame]:
        """Parse extracted text as a simple table"""
        try:
            if not text.strip():
                return []
            
            lines = [line.strip() for line in text.strip().split('\n') if line.strip()]
            
            # Try to detect table structure
            if len(lines) > 1:
                # Split lines by common delimiters
                table_rows = []
                for line in lines:
                    # Try different delimiters
                    delimiters = ['\t', '|', '  ', '   ', ',', ';']
                    row = line
                    for delim in delimiters:
                        if delim in line:
                            row = [cell.strip() for cell in line.split(delim) if cell.strip()]
                            break
                    
                    if isinstance(row, str):
                        row = [row]  # Single column
                    
                    table_rows.append(row)
                
                if len(table_rows) > 1:
                    # Find max columns and pad
                    max_cols = max(len(row) for row in table_rows)
                    for row in table_rows:
                        while len(row) < max_cols:
                            row.append('')
                    
                    df = pd.DataFrame(table_rows)
                    self.logger.info(f"[SUCCESS] Page {page_num} - OCR fallback extracted table: {len(df)}x{len(df.columns)}")
                    return [df]
            
            return []
            
        except Exception as e:
            self.logger.error(f"[ERROR] Text parsing failed for page {page_num}: {e}")
            return []
    
    def _extract_tables_from_ocr_text(self, ocr_text: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables from OCR text using multiple parsing strategies"""
        tables = []
        
        try:
            # Strategy 1: Look for numbered tables (Table 1.1, Table 1.2, etc.)
            numbered_tables = self._extract_numbered_tables_from_text(ocr_text, page_num)
            tables.extend(numbered_tables)
            
            # Strategy 2: Look for columnar data patterns
            if not tables:
                columnar_tables = self._extract_columnar_tables_from_text(ocr_text, page_num)
                tables.extend(columnar_tables)
            
            # Strategy 3: Look for S/No. patterns
            if not tables:
                sno_tables = self._extract_sno_tables_from_text(ocr_text, page_num)
                tables.extend(sno_tables)
            
            # Strategy 4: Generic table detection
            if not tables:
                generic_tables = self._extract_generic_tables_from_text(ocr_text, page_num)
                tables.extend(generic_tables)
            
        except Exception as e:
            self.logger.error(f"[ERROR] OCR table parsing failed for page {page_num}: {e}")
        
        return tables
    
    def _extract_numbered_tables_from_text(self, text: str, page_num: int) -> List[pd.DataFrame]:
        """Extract numbered tables from OCR text"""
        tables = []
        
        # Pattern to match table headers like "Table 1.1 Distribution of..."
        table_pattern = r'(Table\s+\d+\.\d+\s+[^\n]+(?:\n(?!\s*\d+\.\s+)[^\n]*)*)'
        table_matches = re.finditer(table_pattern, text, re.IGNORECASE)
        
        for match in table_matches:
            table_title = match.group(1).strip()
            table_start = match.end()
            
            # Find the end of this table (next table or page break)
            remaining_text = text[table_start:]
            next_table_match = re.search(r'Table\s+\d+\.\d+', remaining_text, re.IGNORECASE)
            
            if next_table_match:
                table_content = remaining_text[:next_table_match.start()]
            else:
                table_content = remaining_text
            
            # Parse the table content
            df = self._parse_table_content(table_content, table_title, page_num)
            if df is not None and not df.empty:
                tables.append(df)
                self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted numbered table: {table_title[:50]}...")
        
        return tables
    
    def _extract_columnar_tables_from_text(self, text: str, page_num: int) -> List[pd.DataFrame]:
        """Extract columnar tables from OCR text"""
        tables = []
        
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Look for patterns that suggest columnar data
        for i in range(len(lines)):
            line = lines[i]
            
            # Check if this line looks like a header
            if self._is_header_line(line):
                # Collect following lines that look like data
                data_lines = []
                for j in range(i + 1, min(i + 20, len(lines))):
                    next_line = lines[j]
                    if self._is_data_line(next_line):
                        data_lines.append(next_line)
                    elif self._is_header_line(next_line) or next_line.startswith('Table'):
                        break  # New table or section
                
                if len(data_lines) >= 2:  # At least header + 1 data row
                    # Create table
                    headers = self._parse_header_line(line)
                    rows = []
                    for data_line in data_lines:
                        row = self._parse_data_row(data_line)
                        if row:
                            rows.append(row)
                    
                    if rows and headers:
                        # Ensure consistent columns
                        max_cols = max(len(headers), max(len(r) for r in rows) if rows else 0)
                        while len(headers) < max_cols:
                            headers.append(f'Column_{len(headers)}')
                        
                        formatted_rows = []
                        for row in rows:
                            while len(row) < max_cols:
                                row.append('')
                            formatted_rows.append(row[:max_cols])
                        
                        df = pd.DataFrame(formatted_rows, columns=headers)
                        tables.append(df)
                        self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted columnar table: {len(df)}x{len(df.columns)}")
        
        return tables
    
    def _extract_sno_tables_from_text(self, text: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables with S/No. patterns from OCR text"""
        tables = []
        
        # Look for S/No. patterns
        sno_pattern = r'(?:S\/No\.?|SNO|SERIAL)\s*(\d+)'
        sno_matches = list(re.finditer(sno_pattern, text, re.IGNORECASE))
        
        if len(sno_matches) >= 3:  # At least 3 numbered rows
            # Extract the section containing S/No. data
            first_match = sno_matches[0]
            last_match = sno_matches[-1]
            
            section_start = max(0, first_match.start() - 200)  # Start a bit before first match
            section_end = min(len(text), last_match.end() + 200)  # End a bit after last match
            
            section_text = text[section_start:section_end]
            
            # Parse this section as a table
            df = self._parse_table_content(section_text, f"S/No. Table (Page {page_num})", page_num)
            if df is not None and not df.empty:
                tables.append(df)
                self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted S/No. table: {len(df)}x{len(df.columns)}")
        
        return tables
    
    def _extract_generic_tables_from_text(self, text: str, page_num: int) -> List[pd.DataFrame]:
        """Extract generic tables from OCR text"""
        tables = []
        
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        
        # Look for any repeated patterns that suggest a table
        for window_size in [3, 4, 5]:
            for i in range(len(lines) - window_size + 1):
                window = lines[i:i + window_size]
                
                # Check if all lines in window have similar structure
                if self._has_consistent_structure(window):
                    # Try to parse as table
                    table_text = '\n'.join(window)
                    df = self._parse_table_content(table_text, f"Generic Table (Page {page_num})", page_num)
                    
                    if df is not None and not df.empty and len(df) >= 2:
                        tables.append(df)
                        self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted generic table: {len(df)}x{len(df.columns)}")
                        break
        
        return tables
    
    def _is_header_line(self, line: str) -> bool:
        """Check if a line looks like a table header"""
        header_indicators = ['s/no', 'party', 'name', 'amount', 'kshs', 'year', 'total', 'distribution']
        line_lower = line.lower()
        
        # Has multiple words and contains header indicators
        words = line.split()
        return (len(words) >= 2 and 
                any(indicator in line_lower for indicator in header_indicators))
    
    def _is_data_line(self, line: str) -> bool:
        """Check if a line looks like table data"""
        # Data lines typically have numbers and text
        has_number = bool(re.search(r'\d', line))
        has_text = len(line.split()) >= 2
        not_header = not self._is_header_line(line)
        
        return has_number and has_text and not_header
    
    def _has_consistent_structure(self, lines: List[str]) -> bool:
        """Check if lines have consistent structure (suggesting a table)"""
        if len(lines) < 3:
            return False
        
        # Check word count consistency
        word_counts = [len(line.split()) for line in lines]
        avg_words = sum(word_counts) / len(word_counts)
        
        # Allow some variation but not too much
        variance = sum((count - avg_words) ** 2 for count in word_counts) / len(word_counts)
        
        return variance < 4  # Low variance suggests consistent structure
    
    def _parse_table_content(self, table_content: str, table_title: str, page_num: int) -> pd.DataFrame:
        """Parse table content into a DataFrame"""
        # Split into lines
        lines = [line.strip() for line in table_content.split('\n') if line.strip()]
        
        # Try to detect table structure
        if len(lines) > 1:
            # Split lines by common delimiters
            table_rows = []
            for line in lines:
                # Try different delimiters
                delimiters = ['\t', '|', '  ', '   ', ',', ';']
                row = line
                for delim in delimiters:
                    if delim in line:
                        row = [cell.strip() for cell in line.split(delim) if cell.strip()]
                        break
                
                if isinstance(row, str):
                    row = [row]  # Single column
                
                table_rows.append(row)
            
            if len(table_rows) > 1:
                # Find max columns and pad
                max_cols = max(len(row) for row in table_rows)
                for row in table_rows:
                    while len(row) < max_cols:
                        row.append('')
                
                df = pd.DataFrame(table_rows)
                self.logger.info(f"[SUCCESS] Page {page_num} - OCR extracted table: {len(df)}x{len(df.columns)}")
                return df
        
        return None
    
    def _parse_header_line(self, line: str) -> List[str]:
        """Parse a header line into column names"""
        # Try different delimiters
        delimiters = ['\t', '|', '  ', '   ', ',', ';']
        headers = line
        for delim in delimiters:
            if delim in line:
                headers = [cell.strip() for cell in line.split(delim) if cell.strip()]
                break
        
        return headers
    
    def _parse_data_row(self, line: str) -> List[str]:
        """Parse a data row into values"""
        # Try different delimiters
        delimiters = ['\t', '|', '  ', '   ', ',', ';']
        row = line
        for delim in delimiters:
            if delim in line:
                row = [cell.strip() for cell in line.split(delim) if cell.strip()]
                break
        
        return row
    
    def is_available(self) -> bool:
        """Check if OCR libraries are available"""
        return self.ocr_available
