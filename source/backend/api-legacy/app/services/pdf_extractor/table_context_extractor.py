"""
Table Context Extractor Module
Extracts table headings, descriptions, and context using text hierarchy and font analysis
"""

import logging
import json
import re
from typing import Dict, Any, List, Tuple, Optional
from pathlib import Path

try:
    import fitz  # PyMuPDF
    import pandas as pd
    PYPDF_AVAILABLE = True
except ImportError:
    PYPDF_AVAILABLE = False
    fitz = None
    pd = None


class TableContextExtractor:
    """Extracts table headings, descriptions, and hierarchical context"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.pypdf_available = PYPDF_AVAILABLE
    
    def extract_table_context(self, pdf_path: str, page_num: int, table_bbox: List[float] = None) -> Dict[str, Any]:
        """Extract comprehensive table context including headings and descriptions"""
        if not self.pypdf_available:
            return {'error': 'PyMuPDF not available for context extraction'}
        
        try:
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]
            
            context = {
                'page_number': page_num,
                'table_heading': '',
                'table_description': '',
                'preceding_text': [],
                'following_text': [],
                'hierarchical_context': {
                    'section_title': '',
                    'subsection_title': '',
                    'chapter_title': '',
                    'document_structure': []
                },
                'font_analysis': {
                    'heading_fonts': [],
                    'description_fonts': [],
                    'body_fonts': []
                },
                'spatial_context': {
                    'text_above_table': [],
                    'text_below_table': [],
                    'text_left_of_table': [],
                    'text_right_of_table': []
                }
            }
            
            # Get all text blocks with font information
            text_blocks = self._get_text_blocks_with_fonts(page)
            
            # Analyze text hierarchy
            hierarchy = self._analyze_text_hierarchy(text_blocks)
            context['hierarchical_context'] = hierarchy
            
            # Extract spatial context around table
            if table_bbox:
                spatial_context = self._extract_spatial_context(page, text_blocks, table_bbox)
                context['spatial_context'] = spatial_context
            
            # Extract table heading and description
            heading_info = self._extract_table_heading_description(text_blocks, hierarchy, table_bbox)
            context.update(heading_info)
            
            # Font analysis
            font_analysis = self._analyze_font_patterns(text_blocks)
            context['font_analysis'] = font_analysis
            
            doc.close()
            return context
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to extract table context for page {page_num}: {e}")
            return {'error': str(e)}
    
    def _get_text_blocks_with_fonts(self, page) -> List[Dict[str, Any]]:
        """Extract text blocks with font information and positioning"""
        blocks = []
        
        try:
            # Get text blocks with detailed information
            text_dict = page.get_text("dict")
            
            for block in text_dict.get("blocks", []):
                if "lines" in block:
                    for line in block["lines"]:
                        for span in line.get("spans", []):
                            text = span.get("text", "").strip()
                            if text:  # Only include non-empty text
                                block_info = {
                                    'text': text,
                                    'bbox': span.get("bbox", [0, 0, 0, 0]),  # [x0, y0, x1, y1]
                                    'font': span.get("font", ""),
                                    'size': span.get("size", 0),
                                    'flags': span.get("flags", 0),
                                    'color': span.get("color", 0),
                                    'is_bold': bool(span.get("flags", 0) & 2**4),
                                    'is_italic': bool(span.get("flags", 0) & 2**1),
                                    'block_type': self._classify_text_type(span),
                                    'position': {
                                        'x0': span.get("bbox", [0, 0, 0, 0])[0],
                                        'y0': span.get("bbox", [0, 0, 0, 0])[1],
                                        'x1': span.get("bbox", [0, 0, 0, 0])[2],
                                        'y1': span.get("bbox", [0, 0, 0, 0])[3],
                                        'center_x': (span.get("bbox", [0, 0, 0, 0])[0] + span.get("bbox", [0, 0, 0, 0])[2]) / 2,
                                        'center_y': (span.get("bbox", [0, 0, 0, 0])[1] + span.get("bbox", [0, 0, 0, 0])[3]) / 2
                                    }
                                }
                                blocks.append(block_info)
        
        except Exception as e:
            self.logger.warning(f"[WARNING] Failed to extract text blocks: {e}")
        
        # Sort blocks by vertical position (top to bottom)
        blocks.sort(key=lambda x: x['position']['y0'])
        
        return blocks
    
    def _classify_text_type(self, span: Dict[str, Any]) -> str:
        """Classify text type based on font properties"""
        font = span.get("font", "").lower()
        size = span.get("size", 0)
        flags = span.get("flags", 0)
        
        # Heading indicators
        is_bold = bool(flags & 2**4)
        is_italic = bool(flags & 2**1)
        
        # Font name patterns
        if any(keyword in font for keyword in ["bold", "black", "heavy"]):
            return "heading"
        elif any(keyword in font for keyword in ["title", "heading"]):
            return "heading"
        elif size > 14:
            return "heading"
        elif size > 12 and is_bold:
            return "subheading"
        elif size < 10:
            return "caption"
        elif "italic" in font or is_italic:
            return "description"
        else:
            return "body"
    
    def _analyze_text_hierarchy(self, text_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze text hierarchy to identify document structure"""
        hierarchy = {
            'section_title': '',
            'subsection_title': '',
            'chapter_title': '',
            'document_structure': []
        }
        
        # Group text by font size and type
        font_groups = {}
        for block in text_blocks:
            key = f"{block['size']}_{block['block_type']}"
            if key not in font_groups:
                font_groups[key] = []
            font_groups[key].append(block)
        
        # Identify hierarchical levels
        sorted_sizes = sorted(set(block['size'] for block in text_blocks), reverse=True)
        
        level_mapping = {}
        for i, size in enumerate(sorted_sizes[:5]):  # Top 5 font sizes
            if i == 0:
                level_mapping[size] = "title"
            elif i == 1:
                level_mapping[size] = "chapter"
            elif i == 2:
                level_mapping[size] = "section"
            elif i == 3:
                level_mapping[size] = "subsection"
            else:
                level_mapping[size] = "paragraph"
        
        # Extract hierarchy based on position and font
        current_structure = []
        for block in text_blocks:
            size = block['size']
            level = level_mapping.get(size, "paragraph")
            
            structure_item = {
                'text': block['text'],
                'level': level,
                'size': size,
                'font': block['font'],
                'position': block['position'],
                'type': block['block_type']
            }
            
            current_structure.append(structure_item)
            
            # Update hierarchy fields
            if level == "section" and not hierarchy['section_title']:
                hierarchy['section_title'] = block['text']
            elif level == "subsection" and not hierarchy['subsection_title']:
                hierarchy['subsection_title'] = block['text']
            elif level == "chapter" and not hierarchy['chapter_title']:
                hierarchy['chapter_title'] = block['text']
        
        hierarchy['document_structure'] = current_structure
        return hierarchy
    
    def _extract_spatial_context(self, page, text_blocks: List[Dict[str, Any]], table_bbox: List[float]) -> Dict[str, Any]:
        """Extract text spatially around the table"""
        if not table_bbox:
            return {
                'text_above_table': [],
                'text_below_table': [],
                'text_left_of_table': [],
                'text_right_of_table': []
            }
        
        context = {
            'text_above_table': [],
            'text_below_table': [],
            'text_left_of_table': [],
            'text_right_of_table': []
        }
        
        table_x0, table_y0, table_x1, table_y1 = table_bbox
        margin = 50  # pixels around the table
        
        for block in text_blocks:
            block_x0, block_y0, block_x1, block_y1 = block['bbox']
            
            # Text above table
            if block_y1 < table_y0 - margin:
                context['text_above_table'].append(block['text'])
            
            # Text below table
            elif block_y0 > table_y1 + margin:
                context['text_below_table'].append(block['text'])
            
            # Text left of table
            elif block_x1 < table_x0 - margin:
                context['text_left_of_table'].append(block['text'])
            
            # Text right of table
            elif block_x0 > table_x1 + margin:
                context['text_right_of_table'].append(block['text'])
        
        return context
    
    def _extract_table_heading_description(self, text_blocks: List[Dict[str, Any]], hierarchy: Dict[str, Any], table_bbox: List[float] = None) -> Dict[str, Any]:
        """Extract table heading and description based on hierarchy and position"""
        result = {
            'table_heading': '',
            'table_description': '',
            'preceding_text': [],
            'following_text': []
        }
        
        # Get font sizes for different levels
        heading_sizes = []
        body_sizes = []
        
        for block in text_blocks:
            if block['block_type'] in ['heading', 'subheading']:
                heading_sizes.append(block['size'])
            else:
                body_sizes.append(block['size'])
        
        avg_heading_size = sum(heading_sizes) / len(heading_sizes) if heading_sizes else 12
        avg_body_size = sum(body_sizes) / len(body_sizes) if body_sizes else 10
        
        # Find potential headings and descriptions
        potential_headings = []
        potential_descriptions = []
        
        for i, block in enumerate(text_blocks):
            text = block['text']
            
            # Skip very short text
            if len(text) < 3:
                continue
            
            # Skip if it looks like table data
            if self._is_likely_table_data(text):
                continue
            
            # Heading candidates
            if (block['size'] >= avg_heading_size * 0.8 and 
                block['block_type'] in ['heading', 'subheading'] and
                not any(char.isdigit() for char in text.split()[0]) if text.split() else False):
                potential_headings.append((i, block))
            
            # Description candidates (italic, smaller, or caption-like)
            elif (block['size'] <= avg_body_size * 1.1 and
                  (block['is_italic'] or block['block_type'] == 'caption')):
                potential_descriptions.append((i, block))
        
        # Select best heading (closest to table, largest font)
        best_heading = ""
        if potential_headings:
            # Sort by font size (descending) and position
            potential_headings.sort(key=lambda x: (-x[1]['size'], x[0]))
            best_heading = potential_headings[0][1]['text']
        
        # Select best description
        best_description = ""
        if potential_descriptions:
            # Prefer descriptions that follow headings
            for desc_idx, desc_block in potential_descriptions:
                # Check if there's a heading before this description
                for head_idx, head_block in potential_headings:
                    if head_idx < desc_idx < head_idx + 5:  # Within 5 blocks of heading
                        best_description = desc_block['text']
                        break
                if best_description:
                    break
            
            # If no heading-related description found, take the first one
            if not best_description and potential_descriptions:
                best_description = potential_descriptions[0][1]['text']
        
        result['table_heading'] = best_heading
        result['table_description'] = best_description
        
        # Get preceding and following text
        if table_bbox:
            table_y = (table_bbox[1] + table_bbox[3]) / 2  # Table center Y
            
            preceding = []
            following = []
            
            for block in text_blocks:
                if self._is_likely_table_data(block['text']):
                    continue
                
                block_y = block['position']['center_y']
                if block_y < table_y - 20:
                    preceding.append(block['text'])
                elif block_y > table_y + 20:
                    following.append(block['text'])
            
            result['preceding_text'] = preceding[-5:] if preceding else []  # Last 5 items before table
            result['following_text'] = following[:5] if following else []   # First 5 items after table
        
        return result
    
    def _is_likely_table_data(self, text: str) -> bool:
        """Check if text is likely table data rather than heading/description"""
        text = text.strip()
        
        # Skip if line is mostly numbers
        if re.match(r'^[\d\s,.-]+$', text):
            return True
        
        # Skip if line looks like codes/IDs
        if re.match(r'^[A-Z]{2,4}[-\s]?\d+', text):
            return True
        
        # Skip if line has many numbers mixed with text
        words = text.split()
        if len(words) > 3:
            number_count = sum(1 for word in words if any(char.isdigit() for char in word))
            if number_count > len(words) * 0.5:
                return True
        
        # Skip if line contains table-like patterns
        if re.search(r'\s{3,}|\t{2,}', text):
            return True
        
        return False
    
    def _analyze_font_patterns(self, text_blocks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze font patterns to understand document styling"""
        font_analysis = {
            'heading_fonts': [],
            'description_fonts': [],
            'body_fonts': [],
            'font_sizes': [],
            'font_families': []
        }
        
        # Collect font information
        font_sizes = []
        font_families = set()
        
        for block in text_blocks:
            font_sizes.append(block['size'])
            
            # Extract font family (remove style suffixes)
            font_name = block['font']
            base_font = re.sub(r'[-,](Bold|Italic|Regular|Medium).*$', '', font_name)
            font_families.add(base_font)
            
            # Categorize fonts
            if block['block_type'] == 'heading':
                if font_name not in font_analysis['heading_fonts']:
                    font_analysis['heading_fonts'].append(font_name)
            elif block['block_type'] in ['description', 'caption']:
                if font_name not in font_analysis['description_fonts']:
                    font_analysis['description_fonts'].append(font_name)
            else:
                if font_name not in font_analysis['body_fonts']:
                    font_analysis['body_fonts'].append(font_name)
        
        font_analysis['font_sizes'] = sorted(list(set(font_sizes)), reverse=True)
        font_analysis['font_families'] = sorted(list(font_families))
        
        return font_analysis
    
    def extract_table_context_for_multiple_tables(self, pdf_path: str, page_num: int, table_bboxes: List[List[float]]) -> List[Dict[str, Any]]:
        """Extract context for multiple tables on a page"""
        contexts = []
        
        for i, bbox in enumerate(table_bboxes):
            context = self.extract_table_context(pdf_path, page_num, bbox)
            context['table_index'] = i
            contexts.append(context)
        
        return contexts
