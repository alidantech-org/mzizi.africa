"""
Content Analyzer Module
Intelligent PDF content analysis to detect page types and extract metadata
"""

import re
from typing import Dict, Any

# PDF extraction libraries
try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False

try:
    from pdfminer.high_level import extract_text
    PDFMINER_AVAILABLE = True
except ImportError:
    PDFMINER_AVAILABLE = False

try:
    import PyPDF2
    PYPDF2_AVAILABLE = True
except ImportError:
    PYPDF2_AVAILABLE = False


class ContentAnalyzer:
    """Intelligent PDF content analyzer to detect page types and extract metadata"""
    
    @staticmethod
    def analyze_page_content(pdf_path: str, page_num: int) -> Dict[str, Any]:
        """Analyze page content to determine type and extract metadata"""
        content_info = {
            'page_number': page_num,
            'text_content': '',
            'content_type': 'unknown',
            'has_table_indicators': False,
            'title': '',
            'headings': [],
            'table_keywords': [],
            'data_indicators': [],
            'quality_score': 0
        }
        
        # Extract text using multiple methods
        text_content = ContentAnalyzer._extract_text_from_page(pdf_path, page_num)
        content_info['text_content'] = text_content
        
        if not text_content.strip():
            content_info['content_type'] = 'blank_or_image'
            return content_info
        
        # Analyze content characteristics
        content_info.update(ContentAnalyzer._analyze_text_characteristics(text_content))
        
        return content_info
    
    @staticmethod
    def _extract_text_from_page(pdf_path: str, page_num: int) -> str:
        """Extract text using the best available method"""
        text = ""
        
        # Try pdfplumber first (most reliable)
        if PDFPLUMBER_AVAILABLE:
            try:
                with pdfplumber.open(pdf_path) as pdf:
                    page = pdf.pages[page_num - 1]
                    text = page.extract_text() or ""
            except Exception as e:
                pass
        
        # Fallback to pdfminer
        if not text and PDFMINER_AVAILABLE:
            try:
                text = extract_text(pdf_path, page_numbers=[page_num - 1])
            except Exception as e:
                pass
        
        # Fallback to PyPDF2
        if not text and PYPDF2_AVAILABLE:
            try:
                with open(pdf_path, 'rb') as file:
                    reader = PyPDF2.PdfReader(file)
                    if page_num <= len(reader.pages):
                        page = reader.pages[page_num - 1]
                        text = page.extract_text() or ""
            except Exception as e:
                pass
        
        return text
    
    @staticmethod
    def _analyze_text_characteristics(text: str) -> Dict[str, Any]:
        """Analyze text to determine content type and extract metadata"""
        # Ensure text is a string
        if not isinstance(text, str):
            text = str(text) if text is not None else ""
        
        analysis = {
            'content_type': 'text',
            'has_table_indicators': False,
            'title': '',
            'headings': [],
            'table_keywords': [],
            'data_indicators': [],
            'quality_score': 0
        }
        
        lines = text.split('\n')
        
        # Extract title (first non-empty line)
        for line in lines:
            if line.strip():
                analysis['title'] = line.strip()
                break
        
        # Find headings (lines that look like headings)
        for line in lines:
            line = line.strip()
            if line and len(line) < 100 and not line.endswith('.'):
                if any(keyword in line.upper() for keyword in ['CHAPTER', 'SECTION', 'PART', 'TABLE', 'FIGURE']):
                    analysis['headings'].append(line)
        
        # Enhanced table indicators detection
        table_patterns = [
            r'\b\d+\s+\d+\s+\d+',  # Multiple numbers
            r'\$[\d,]+\.?\d*',    # Currency
            r'\d+\.\d+%|\d+%',     # Percentages
            r'\|\s*\w+\s*\|',      # Pipe separators
            r'\t+\w+\t+',          # Tab separators
            r'^\s*\w+\s+\d+\s+\w+\s*$',  # Word number word pattern
            r'^\s*\d+\.\s+\w+',    # Numbered lists (like "1. Party")
            r'\b\d{1,3}(?:,\d{3})*(?:\.\d+)?\b',  # Numbers with commas
            r'^[A-Z][a-z].*\d+',    # Letter followed by numbers
        ]
        
        for pattern in table_patterns:
            if re.search(pattern, text, re.MULTILINE | re.IGNORECASE):
                analysis['has_table_indicators'] = True
                break
        
        # Enhanced table keyword detection
        table_keywords = [
            'table', 'data', 'figures', 'statistics', 'analysis', 'report', 'summary',
            'distribution', 'fund', 'party', 'kshs', 'total', 'amount', 'ksh',
            's/no', 'serial', 'name', 'party name'
        ]
        
        for keyword in table_keywords:
            if isinstance(text, str) and keyword.lower() in text.lower():
                analysis['table_keywords'].append(keyword)
        
        # Extract data indicators
        data_patterns = [
            r'\$[\d,]+\.?\d*',     # Money
            r'\d{1,3}(?:,\d{3})*(?:\.\d+)?',  # Numbers with commas
            r'\d+\.\d+%',          # Percentages
            r'\d{4}-\d{2}-\d{2}',   # Dates
            r'\b\d+\.\d+\b',       # Decimal numbers
        ]
        
        for pattern in data_patterns:
            matches = re.findall(pattern, text)
            # Ensure all matches are strings
            analysis['data_indicators'].extend([str(match) for match in matches])
        
        # Enhanced content type determination
        table_score = 0
        if analysis['has_table_indicators']:
            table_score += 30
        if len(analysis['table_keywords']) > 0:
            table_score += len(analysis['table_keywords']) * 10
        if len(analysis['data_indicators']) > 3:
            table_score += 20
        if len(analysis['headings']) > 0:
            table_score += 10
        
        # Check for specific table patterns
        if re.search(r'^(S/No|Serial|No\.)\s+', text, re.MULTILINE | re.IGNORECASE):
            table_score += 25  # Strong table indicator
        if re.search(r'^\d+\.\s+[A-Z][a-zA-Z\s]*\s+[\d,]+\.?\d*$', text, re.MULTILINE):
            table_score += 20  # Numbered items with amounts
        
        # Determine content type with forced table detection
        if table_score >= 30:  # Lower threshold for forced extraction
            analysis['content_type'] = 'likely_table'
        elif len(analysis['headings']) > 0:
            analysis['content_type'] = 'structured_text'
        elif len(text.split()) < 20:
            analysis['content_type'] = 'minimal_text'
        else:
            analysis['content_type'] = 'text_content'
        
        # Calculate quality score
        score = 0
        if analysis['title']:
            score += 10
        if analysis['headings']:
            score += len(analysis['headings']) * 5
        if analysis['has_table_indicators']:
            score += 20
        if analysis['table_keywords']:
            score += len(analysis['table_keywords']) * 3
        if len(analysis['data_indicators']) > 5:
            score += 15
        
        analysis['quality_score'] = min(score, 100)
        analysis['table_score'] = table_score  # Add table confidence score
        
        return analysis
