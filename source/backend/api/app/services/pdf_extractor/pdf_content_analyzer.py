"""
PDF Content Analyzer Module
Extracts and analyzes PDF content for NLP processing and table detection
"""

import logging
import re
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple
import json

try:
    import PyPDF2
    import fitz  # PyMuPDF
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False
    PyPDF2 = None
    fitz = None

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False
    pdfplumber = None


class PDFContentAnalyzer:
    """Analyzes PDF content for table detection and NLP processing"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.toc_cache = {}
    
    def extract_full_text(self, pdf_path: str) -> str:
        """Extract full text from PDF for analysis"""
        if not PYPDF_AVAILABLE:
            self.logger.warning("PyPDF2 not available for text extraction")
            return ""
        
        try:
            text = ""
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                for page in reader.pages:
                    text += page.extract_text() + "\n"
            
            return text
        except Exception as e:
            self.logger.error(f"Text extraction failed: {e}")
            return ""
    
    def extract_page_text(self, pdf_path: str, page_num: int) -> str:
        """Extract text from specific page"""
        if not PYPDF_AVAILABLE:
            return ""
        
        try:
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                if page_num <= len(reader.pages):
                    page = reader.pages[page_num - 1]
                    return page.extract_text()
        except Exception as e:
            self.logger.error(f"Page text extraction failed: {e}")
        
        return ""
    
    def extract_page_with_pdfplumber(self, pdf_path: str, page_num: int) -> Dict[str, Any]:
        """Extract detailed page content using pdfplumber"""
        if not PDFPLUMBER_AVAILABLE:
            return {'text': '', 'words': [], 'lines': []}
        
        try:
            with pdfplumber.open(pdf_path) as pdf:
                if page_num <= len(pdf.pages):
                    page = pdf.pages[page_num - 1]
                    
                    # Extract text
                    text = page.extract_text()
                    
                    # Extract words with positions
                    words = page.extract_words()
                    
                    # Extract lines (pdfplumber doesn't have extract_lines, use extract_text_lines instead)
                    lines = []
                    try:
                        lines = page.extract_text_lines()
                        # Ensure consistent format - extract text from each line if it's a dict
                        formatted_lines = []
                        for line in lines:
                            if isinstance(line, dict):
                                formatted_lines.append(line.get('text', ''))
                            else:
                                formatted_lines.append(str(line))
                        lines = formatted_lines
                    except AttributeError:
                        # Fallback: extract text and split into lines
                        text = page.extract_text()
                        lines = [line.strip() for line in text.split('\n') if line.strip()]
                    
                    # Extract characters for better analysis (pdfplumber doesn't have extract_chars in all versions)
                    chars = []
                    try:
                        chars = page.extract_chars()
                    except AttributeError:
                        # Skip character extraction if not available
                        pass
                    
                    return {
                        'text': text,
                        'words': words,
                        'lines': lines,
                        'chars': chars,
                        'bbox': page.bbox,
                        'width': page.width,
                        'height': page.height
                    }
        except Exception as e:
            self.logger.error(f"PDFPlumber extraction failed: {e}")
        
        return {'text': '', 'words': [], 'lines': []}
    
    def detect_table_of_contents(self, pdf_path: str) -> Dict[str, Any]:
        """Detect and parse table of contents"""
        cache_key = f"{pdf_path}_{Path(pdf_path).stat().st_mtime}"
        
        if cache_key in self.toc_cache:
            return self.toc_cache[cache_key]
        
        toc_analysis = {
            'has_toc': False,
            'toc_pages': [],
            'table_entries': [],
            'figure_entries': [],
            'toc_text': ''
        }
        
        try:
            # Try to get TOC from PyMuPDF first
            if fitz:
                toc_analysis = self._extract_toc_with_pymupdf(pdf_path, toc_analysis)
            
            # If no TOC found, try text-based detection
            if not toc_analysis['has_toc']:
                toc_analysis = self._detect_toc_from_text(pdf_path, toc_analysis)
            
            self.toc_cache[cache_key] = toc_analysis
            
        except Exception as e:
            self.logger.error(f"TOC detection failed: {e}")
        
        return toc_analysis
    
    def _extract_toc_with_pymupdf(self, pdf_path: str, toc_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Extract TOC using PyMuPDF's built-in TOC parser"""
        try:
            doc = fitz.open(pdf_path)
            toc = doc.get_toc()
            
            if toc:
                toc_analysis['has_toc'] = True
                toc_entries = []
                table_entries = []
                figure_entries = []
                
                for level, title, page in toc:
                    entry = {
                        'level': level,
                        'title': title.strip(),
                        'page': page,
                        'type': self._classify_toc_entry(title)
                    }
                    
                    toc_entries.append(entry)
                    
                    # Categorize entries
                    if entry['type'] == 'table':
                        table_entries.append(entry)
                    elif entry['type'] == 'figure':
                        figure_entries.append(entry)
                
                toc_analysis.update({
                    'toc_entries': toc_entries,
                    'table_entries': table_entries,
                    'figure_entries': figure_entries
                })
            
            doc.close()
            
        except Exception as e:
            self.logger.error(f"PyMuPDF TOC extraction failed: {e}")
        
        return toc_analysis
    
    def _detect_toc_from_text(self, pdf_path: str, toc_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Detect TOC from text analysis"""
        full_text = self.extract_full_text(pdf_path)
        
        if not full_text:
            return toc_analysis
        
        # Look for TOC patterns
        toc_patterns = [
            # Table and figure entries
            r'(?:table|figure|chart)\s+(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(\d+)',
            r'(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(?:table|figure|chart)\s+(\d+)',
            
            # Standard TOC entries
            r'^(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(\d+)$',
            r'^([A-Z][^.]+?)\s+(\d+)$',
            
            # Content listings
            r'contents?\s+(.+?)\s+(\d+)',
            r'index\s+(.+?)\s+(\d+)',
        ]
        
        toc_found = False
        toc_entries = []
        table_entries = []
        figure_entries = []
        
        for pattern in toc_patterns:
            matches = re.finditer(pattern, full_text, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                toc_found = True
                
                groups = match.groups()
                if len(groups) >= 3:
                    number = groups[0].strip()
                    title = groups[1].strip()
                    page = groups[2].strip()
                    
                    try:
                        page_num = int(re.findall(r'\d+', page)[0])
                    except:
                        continue
                    
                    entry = {
                        'level': len(number.split('.')),
                        'title': title,
                        'page': page_num,
                        'type': self._classify_toc_entry(title)
                    }
                    
                    toc_entries.append(entry)
                    
                    if entry['type'] == 'table':
                        table_entries.append(entry)
                    elif entry['type'] == 'figure':
                        figure_entries.append(entry)
        
        if toc_found:
            toc_analysis.update({
                'has_toc': True,
                'toc_entries': toc_entries,
                'table_entries': table_entries,
                'figure_entries': figure_entries,
                'toc_text': full_text
            })
        
        return toc_analysis
    
    def get_table_pages_from_toc(self, pdf_path: str) -> List[int]:
        """Get list of pages that contain tables based on TOC"""
        toc = self.detect_table_of_contents(pdf_path)
        
        table_pages = []
        for entry in toc.get('table_entries', []):
            if entry.get('page'):
                table_pages.append(entry['page'])
        
        return table_pages
    
    def analyze_page_structure(self, pdf_path: str, page_num: int) -> Dict[str, Any]:
        """Analyze page structure for table context and content understanding"""
        try:
            page_content = self.extract_page_with_pdfplumber(pdf_path, page_num)
            if not page_content:
                return {}
            
            # Analyze with pdfplumber data
            if page_content.get('words') and page_content.get('lines'):
                return self._analyze_pdfplumber_page(page_content, page_num)
            else:
                # Fallback to text analysis
                page_text = self.extract_page_text(pdf_path, page_num)
                return self._analyze_page_text(page_text, page_num)
                
        except Exception as e:
            self.logger.error(f"[ERROR] Page structure analysis failed for page {page_num}: {e}")
            return {}
    
    def _detect_toc_from_text(self, pdf_path: str, toc_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Detect TOC from text analysis"""
        full_text = self.extract_full_text(pdf_path)
        
        if not full_text:
            return toc_analysis
        
        # Look for TOC patterns
        toc_patterns = [
            # Table and figure entries
            r'(?:table|figure|chart)\s+(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(\d+)',
            r'(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(?:table|figure|chart)\s+(\d+)',
        ]
        
        toc_found = False
        toc_entries = []
        table_entries = []
        figure_entries = []
        
        for pattern in toc_patterns:
            matches = re.finditer(pattern, full_text, re.MULTILINE | re.IGNORECASE)
            for match in matches:
                toc_found = True
                
                groups = match.groups()
                if len(groups) >= 3:
                    number = groups[0].strip()
                    title = groups[1].strip()
                    page = groups[2].strip()
                    
                    try:
                        page_num = int(re.findall(r'\d+', page)[0])
                    except:
                        continue
                    
                    entry = {
                        'level': len(number.split('.')),
                        'title': title,
                        'page': page_num,
                        'type': self._classify_toc_entry(title)
                    }
                    
                    toc_entries.append(entry)
                    
                    if entry['type'] == 'table':
                        table_entries.append(entry)
                    elif entry['type'] == 'figure':
                        figure_entries.append(entry)
        
        if toc_found:
            toc_analysis.update({
                'has_toc': True,
                'toc_entries': toc_entries,
                'table_entries': table_entries,
                'figure_entries': figure_entries,
                'toc_text': full_text
            })
        
        return toc_analysis
    
    def _analyze_pdfplumber_page(self, page_content: Dict[str, Any], page_num: int) -> Dict[str, Any]:
        """Analyze page structure using pdfplumber data"""
        analysis = {
            'text_regions': [],
            'figure_regions': [],
            'headings': []
        }
        
        words = page_content.get('words', [])
        lines = page_content.get('lines', [])
        
        if not words:
            return analysis
        
        # Group words by position to detect regions
        text_regions = self._group_words_into_regions(words)
        
        # Detect potential table regions based on alignment
        table_regions = self._detect_table_regions(words, lines)
        
        # Detect headings based on font size and position
        headings = self._detect_headings(words, lines)
        
        analysis.update({
            'text_regions': text_regions,
            'table_regions': table_regions,
            'headings': headings
        })
        
        return analysis
    
    def _analyze_page_text(self, text: str, page_num: int) -> Dict[str, Any]:
        """Analyze page text content"""
        analysis = {
            'headings': [],
            'table_indicators': [],
            'figure_indicators': []
        }
        
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect headings
            if self._is_heading(line):
                analysis['headings'].append({
                    'text': line,
                    'level': self._get_heading_level(line),
                    'position': len(analysis['headings'])
                })
            
            # Detect table indicators
            if self._is_table_indicator(line):
                analysis['table_indicators'].append(line)
            
            # Detect figure indicators
            if self._is_figure_indicator(line):
                analysis['figure_indicators'].append(line)
        
        return analysis
    
    def extract_table_context(self, pdf_path: str, page_num: int, table_bbox: Optional[Tuple] = None) -> Dict[str, Any]:
        """Extract context around a table"""
        context = {
            'preceding_text': '',
            'following_text': '',
            'headings': [],
            'captions': [],
            'numbering': {}
        }
        
        try:
            # Get page content
            page_content = self.extract_page_with_pdfplumber(pdf_path, page_num)
            page_text = page_content.get('text', '')
            
            if not page_text:
                return context
            
            # Extract text around table location
            if table_bbox:
                context.update(self._extract_context_from_bbox(page_content, table_bbox))
            else:
                context.update(self._extract_context_from_full_text(page_text))
            
            # Extract headings and captions
            context['headings'] = self._extract_headings_from_text(page_text)
            context['captions'] = self._extract_captions_from_text(page_text)
            
            # Extract numbering
            context['numbering'] = self._extract_numbering_from_text(page_text)
        
        except Exception as e:
            self.logger.error(f"Context extraction failed: {e}")
        
        return context
    
    def detect_multi_page_tables(self, pdf_path: str) -> Dict[str, Any]:
        """Detect tables that span multiple pages"""
        multi_page_analysis = {
            'multi_page_tables': [],
            'continuation_indicators': {},
            'page_connections': []
        }
        
        try:
            # Get TOC for table references
            toc = self.detect_table_of_contents(pdf_path)
            
            # Analyze each page for continuation indicators
            total_pages = self._get_page_count(pdf_path)
            
            for page_num in range(1, total_pages + 1):
                page_text = self.extract_page_text(pdf_path, page_num)
                
                # Look for continuation indicators
                continuations = self._find_continuation_indicators(page_text)
                if continuations:
                    multi_page_analysis['continuation_indicators'][page_num] = continuations
                
                # Look for "continued from" indicators
                continued_from = self._find_continued_from_indicators(page_text)
                if continued_from:
                    for ref in continued_from:
                        multi_page_analysis['page_connections'].append({
                            'from_page': ref.get('page'),
                            'to_page': page_num,
                            'type': 'continuation',
                            'indicator': ref.get('text')
                        })
        
        except Exception as e:
            self.logger.error(f"Multi-page table detection failed: {e}")
        
        return multi_page_analysis
    
    # Helper methods
    def _classify_toc_entry(self, title: str) -> str:
        """Classify TOC entry type"""
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in ['table', 'tab']):
            return 'table'
        elif any(keyword in title_lower for keyword in ['figure', 'fig', 'chart']):
            return 'figure'
        elif any(keyword in title_lower for keyword in ['appendix', 'app']):
            return 'appendix'
        elif any(keyword in title_lower for keyword in ['chapter', 'chap', 'section']):
            return 'section'
        else:
            return 'content'
    
    def _group_words_into_regions(self, words: List[Dict]) -> List[Dict]:
        """Group words into text regions based on proximity"""
        if not words:
            return []
        
        # Filter words that have required position keys
        valid_words = []
        for w in words:
            if all(key in w for key in ['top', 'left', 'bottom', 'right']):
                valid_words.append(w)
        
        if not valid_words:
            return []
        
        # Sort words by vertical position
        words_sorted = sorted(valid_words, key=lambda w: (w['top'], w['left']))
        
        regions = []
        current_region = []
        last_bottom = None
        
        for word in words_sorted:
            if last_bottom is None or word['top'] - last_bottom < 20:  # Within 20 points
                current_region.append(word)
            else:
                if current_region:
                    regions.append(self._create_region_from_words(current_region))
                current_region = [word]
            
            last_bottom = word['bottom']
        
        if current_region:
            regions.append(self._create_region_from_words(current_region))
        
        return regions
    
    def _create_region_from_words(self, words: List[Dict]) -> Dict:
        """Create region from group of words"""
        if not words:
            return {}
        
        # Filter words that have required position keys
        valid_words = []
        for w in words:
            if all(key in w for key in ['top', 'left', 'bottom', 'right']):
                valid_words.append(w)
        
        if not valid_words:
            # Fallback: just return text without position
            text = ' '.join(w.get('text', '') for w in words)
            return {
                'bbox': (0, 0, 0, 0),
                'text': text,
                'word_count': len(words)
            }
        
        left = min(w['left'] for w in valid_words)
        top = min(w['top'] for w in valid_words)
        right = max(w['right'] for w in valid_words)
        bottom = max(w['bottom'] for w in valid_words)
        
        text = ' '.join(w['text'] for w in valid_words)
        
        return {
            'bbox': (left, top, right, bottom),
            'text': text,
            'word_count': len(valid_words)
        }
    
    def _detect_table_regions(self, words: List[Dict], lines: List[str]) -> List[Dict]:
        """Detect potential table regions based on alignment"""
        table_regions = []
        
        # Filter words that have required position keys
        valid_words = []
        for w in words:
            if all(key in w for key in ['top', 'left', 'bottom', 'right']):
                valid_words.append(w)
        
        if not valid_words:
            return table_regions
        
        # Look for tabular patterns in words
        columns = self._detect_columns(valid_words)
        
        for col_group in columns:
            if len(col_group) >= 2:  # At least 2 columns for a table
                left = min(w['left'] for w in col_group)
                top = min(w['top'] for w in col_group)
                right = max(w['right'] for w in col_group)
                bottom = max(w['bottom'] for w in col_group)
                
                table_regions.append({
                    'bbox': (left, top, right, bottom),
                    'column_count': len(col_group),
                    'confidence': 0.7
                })
        
        return table_regions
    
    def _detect_columns(self, words: List[Dict]) -> List[List[Dict]]:
        """Detect column structure in words"""
        # Filter words that have required position keys
        valid_words = []
        for w in words:
            if all(key in w for key in ['left']):
                valid_words.append(w)
        
        if not valid_words:
            return []
        
        # Group words by similar x positions (columns)
        x_positions = [w['left'] for w in valid_words]
        
        # Find column boundaries
        column_boundaries = self._find_column_boundaries(x_positions)
        
        # Group words by columns
        columns = []
        for boundary in column_boundaries:
            column_words = [w for w in valid_words if abs(w['left'] - boundary) < 10]
            if column_words:
                columns.append(column_words)
        
        return columns
    
    def _find_column_boundaries(self, x_positions: List[float]) -> List[float]:
        """Find column boundaries from x positions"""
        if not x_positions:
            return []
        
        # Use clustering to find column positions
        x_positions_sorted = sorted(x_positions)
        boundaries = []
        
        i = 0
        while i < len(x_positions_sorted):
            # Find cluster center
            cluster_start = i
            while i < len(x_positions_sorted) and x_positions_sorted[i] - x_positions_sorted[cluster_start] < 20:
                i += 1
            
            cluster = x_positions_sorted[cluster_start:i]
            if cluster:
                boundaries.append(sum(cluster) / len(cluster))
        
        return boundaries
    
    def _detect_headings(self, words: List[Dict], lines: List) -> List[Dict]:
        """Detect headings based on font characteristics"""
        headings = []
        
        for line in lines:
            # Handle both string and dictionary formats
            if isinstance(line, dict):
                line_text = line.get('text', '')
            else:
                line_text = str(line).strip()
            
            line_text = line_text.strip()
            if line_text and self._is_heading(line_text):
                headings.append({
                    'text': line_text,
                    'level': self._get_heading_level(line_text),
                    'type': 'heading'
                })
        
        return headings
    
    def _is_heading(self, text: str) -> bool:
        """Check if text is likely a heading"""
        # Common heading patterns
        patterns = [
            r'^\d+\.\s*[A-Z]',  # Numbered sections
            r'^[A-Z][A-Z\s]+$',  # All caps
            r'^[A-Z][^.]*$',     # Title case at start of line
            r'^[A-Z][a-z]+[^:]*:',  # Title case with colon
        ]
        
        for pattern in patterns:
            if re.match(pattern, text):
                return True
        
        return False
    
    def _get_heading_level(self, text: str) -> int:
        """Get heading level from text"""
        # Numbered headings
        numbered_match = re.match(r'^(\d+(?:\.\d+)*)', text)
        if numbered_match:
            return len(numbered_match.group(1).split('.'))
        
        # All caps usually level 1
        if text.isupper() and len(text.split()) <= 5:
            return 1
        
        # Title case usually level 2
        if text.istitle():
            return 2
        
        return 3
    
    def _is_table_indicator(self, text: str) -> bool:
        """Check if text indicates a table"""
        indicators = ['table', 'tab.', 'data', 'statistics', 'summary']
        return any(indicator in text.lower() for indicator in indicators)
    
    def _is_figure_indicator(self, text: str) -> bool:
        """Check if text indicates a figure"""
        indicators = ['figure', 'fig.', 'chart', 'graph', 'image']
        return any(indicator in text.lower() for indicator in indicators)
    
    def _extract_context_from_bbox(self, page_content: Dict, bbox: Tuple) -> Dict:
        """Extract context from specific bounding box"""
        # This would extract text before and after the table bbox
        # Simplified implementation
        return {
            'preceding_text': '',
            'following_text': ''
        }
    
    def _extract_context_from_full_text(self, text: str) -> Dict:
        """Extract context from full page text"""
        lines = text.split('\n')
        
        # Find table indicators and extract surrounding text
        context = {'preceding_text': '', 'following_text': ''}
        
        for i, line in enumerate(lines):
            if self._is_table_indicator(line):
                # Get text before and after
                start = max(0, i - 3)
                end = min(len(lines), i + 4)
                
                context['preceding_text'] = '\n'.join(lines[start:i])
                context['following_text'] = '\n'.join(lines[i+1:end])
                break
        
        return context
    
    def _extract_headings_from_text(self, text: str) -> List[str]:
        """Extract headings from text"""
        headings = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if self._is_heading(line):
                headings.append(line)
        
        return headings
    
    def _extract_captions_from_text(self, text: str) -> List[str]:
        """Extract captions from text"""
        captions = []
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            # Look for caption patterns
            if re.match(r'^(?:table|figure|chart)\s+\d+', line, re.IGNORECASE):
                captions.append(line)
        
        return captions
    
    def _extract_numbering_from_text(self, text: str) -> Dict[str, Any]:
        """Extract numbering from text"""
        numbering = {}
        
        # Table numbers
        table_matches = re.findall(r'table\s+(\d+(?:\.\d+)*)', text, re.IGNORECASE)
        if table_matches:
            numbering['table_numbers'] = table_matches
        
        # Figure numbers
        figure_matches = re.findall(r'figure\s+(\d+(?:\.\d+)*)', text, re.IGNORECASE)
        if figure_matches:
            numbering['figure_numbers'] = figure_matches
        
        return numbering
    
    def _get_page_count(self, pdf_path: str) -> int:
        """Get total page count"""
        try:
            if PYPDF_AVAILABLE:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    return len(reader.pages)
        except:
            pass
        
        return 1
    
    def _find_continuation_indicators(self, text: str) -> List[str]:
        """Find continuation indicators in text"""
        indicators = [
            'continued', 'cont.', 'continued on next page',
            'to be continued', 'continued overleaf'
        ]
        
        found = []
        text_lower = text.lower()
        
        for indicator in indicators:
            if indicator in text_lower:
                found.append(indicator)
        
        return found
    
    def _find_continued_from_indicators(self, text: str) -> List[Dict]:
        """Find "continued from" indicators"""
        patterns = [
            r'continued\s+from\s+page\s+(\d+)',
            r'cont\.\s+from\s+p\.?\s*(\d+)',
            r'(?:table|figure)\s+(\d+(?:\.\d+)*)\s+\(continued\)',
        ]
        
        found = []
        for pattern in patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                found.append({
                    'page': int(match) if match.isdigit() else None,
                    'text': match
                })
        
        return found
