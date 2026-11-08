"""
Page Analyzer Module
Comprehensive page analysis including text, images, and structure detection
"""

import logging
import json
import time
import io
from pathlib import Path
from typing import Dict, Any, List

import pandas as pd

try:
    import fitz  # PyMuPDF
    from PIL import Image
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    fitz = None  # Set to None if not available

from .content_analyzer import ContentAnalyzer
from .ocr_extractor import OCRTableExtractor


class ComprehensivePageAnalyzer:
    """Comprehensive page analyzer that extracts all possible data from a page"""
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.content_analyzer = ContentAnalyzer()
        self.ocr_extractor = OCRTableExtractor()
        self.cv2_available = CV2_AVAILABLE
    
    def analyze_page_comprehensive(self, pdf_path: str, page_num: int, output_dir: Path) -> Dict[str, Any]:
        """Perform comprehensive analysis of a PDF page"""
        self.logger.info(f"[INFO] Page {page_num} - Starting comprehensive analysis")
        
        analysis_result = {
            'page_number': page_num,
            'timestamp': time.time(),
            'content_analysis': {},
            'image_analysis': {},
            'structure_analysis': {},
            'ocr_analysis': {},
            'extraction_results': {
                'tables_found': 0,
                'images_saved': 0,
                'text_extracted': False
            }
        }
        
        try:
            # 1. Content Analysis (text-based)
            content_analysis = self.content_analyzer.analyze_page_content(pdf_path, page_num)
            analysis_result['content_analysis'] = content_analysis
            
            # 2. Image Analysis
            if self.cv2_available:
                image_analysis = self._analyze_page_images(pdf_path, page_num, output_dir)
                analysis_result['image_analysis'] = image_analysis
                analysis_result['extraction_results']['images_saved'] = len(image_analysis.get('extracted_images', []))
            
            # 3. Structure Analysis
            structure_analysis = self._analyze_page_structure(pdf_path, page_num)
            analysis_result['structure_analysis'] = structure_analysis
            
            # 4. OCR Analysis (if needed)
            if self._should_use_ocr(content_analysis, structure_analysis):
                ocr_analysis = self._perform_ocr_analysis(pdf_path, page_num, output_dir)
                analysis_result['ocr_analysis'] = ocr_analysis
                analysis_result['extraction_results']['tables_found'] += len(ocr_analysis.get('tables', []))
            
            # 5. Text extraction confirmation
            analysis_result['extraction_results']['text_extracted'] = bool(content_analysis.get('text_content', '').strip())
            
            # Save comprehensive analysis to analysis folder (not images folder)
            # This will be handled by the page processor
            
            self.logger.info(f"[SUCCESS] Page {page_num} - Comprehensive analysis completed")
            return analysis_result
            
        except Exception as e:
            self.logger.error(f"[ERROR] Comprehensive analysis failed for page {page_num}: {e}")
            analysis_result['error'] = str(e)
            return analysis_result
    
    def _analyze_page_images(self, pdf_path: str, page_num: int, output_dir: Path, tables_on_page: List[Dict] = None) -> Dict[str, Any]:
        """Analyze and extract images from a page with table-aware naming"""
        try:
            if not fitz:
                return {'error': 'PyMuPDF not available', 'has_images': False}
            
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]
            
            image_analysis = {
                'has_images': False,
                'image_count': 0,
                'extracted_images': [],
                'image_types': []
            }
            
            # Get image list
            image_list = page.get_images()
            
            if image_list:
                image_analysis['has_images'] = True
                image_analysis['image_count'] = len(image_list)
                
                for img_index, img in enumerate(image_list):
                    try:
                        # Extract image
                        xref = img[0]
                        pix = fitz.Pixmap(doc, xref)
                        
                        if pix.n - pix.alpha < 4:  # GRAY or RGB
                            img_data = pix.tobytes("png")
                            
                            # Determine if image is related to a table
                            img_filename = self._generate_image_filename(page_num, img_index, img, tables_on_page)
                            img_path = output_dir / img_filename
                            
                            with open(img_path, "wb") as img_file:
                                img_file.write(img_data)
                            
                            image_info = {
                                'filename': img_filename,
                                'xref': xref,
                                'width': pix.width,
                                'height': pix.height,
                                'colorspace': pix.colorspace.name if pix.colorspace else 'unknown',
                                'table_related': False,
                                'related_table_id': None
                            }
                            
                            # Check if image is table-related
                            if tables_on_page:
                                table_relation = self._check_image_table_relation(img, tables_on_page, page_num, img_index)
                                if table_relation['is_related']:
                                    image_info['table_related'] = True
                                    image_info['related_table_id'] = table_relation['table_id']
                                    # Update filename to reflect table relation
                                    new_filename = self._generate_table_related_filename(page_num, img_index, table_relation['table_id'])
                                    new_path = output_dir / new_filename
                                    img_path.rename(new_path)
                                    image_info['filename'] = new_filename
                            
                            image_analysis['extracted_images'].append(image_info)
                            image_analysis['image_types'].append(pix.colorspace.name if pix.colorspace else 'unknown')
                        
                        pix = pix  # force GC
                        
                    except Exception as e:
                        self.logger.warning(f"[WARNING] Failed to extract image {img_index} from page {page_num}: {e}")
            
            doc.close()
            return image_analysis
            
        except Exception as e:
            self.logger.error(f"[ERROR] Image analysis failed for page {page_num}: {e}")
            return {'error': str(e)}
    
    def _generate_image_filename(self, page_num: int, img_index: int, img: tuple, tables_on_page: List[Dict] = None) -> str:
        """Generate appropriate filename for image"""
        return f"page_{page_num:03d}_image_{img_index + 1}.png"
    
    def _check_image_table_relation(self, img: tuple, tables_on_page: List[Dict], page_num: int, img_index: int) -> Dict[str, Any]:
        """Check if image is related to any table on the page"""
        # This is a simplified check - in a real implementation, you might:
        # 1. Check image position relative to table bounding boxes
        # 2. Analyze image content to see if it contains table-like structures
        # 3. Check if image size/dimensions match table characteristics
        
        for table in tables_on_page:
            table_id = table.get('table_id', f'page_{page_num}_table_{tables_on_page.index(table) + 1}')
            
            # Simple heuristic: if there are tables and images, assume some relation
            # In practice, you'd want more sophisticated logic here
            if img_index < len(tables_on_page):  # Simple proximity check
                return {
                    'is_related': True,
                    'table_id': table_id,
                    'relation_type': 'proximity'
                }
        
        return {'is_related': False, 'table_id': None, 'relation_type': None}
    
    def _generate_table_related_filename(self, page_num: int, img_index: int, table_id: str) -> str:
        """Generate filename for table-related image"""
        # Extract table label from table_id and convert to lowercase
        table_label = table_id.replace('page_', '').replace('_table_', '_table_').lower()
        return f"page_{page_num:03d}_{table_label}_image_{img_index + 1}.png"
    
    def _analyze_page_structure(self, pdf_path: str, page_num: int) -> Dict[str, Any]:
        """Analyze the structural elements of the page"""
        try:
            if not fitz:
                return {'error': 'PyMuPDF (fitz) not available for structure analysis'}
            
            doc = fitz.open(pdf_path)
            page = doc[page_num - 1]
            
            structure_analysis = {
                'page_size': page.rect,
                'rotation': page.rotation,
                'text_blocks': 0,
                'image_blocks': 0,
                'has_annotations': False,
                'annotations_count': 0,
                'layout_complexity': 'simple'
            }
            
            # Get text blocks
            text_blocks = page.get_text("blocks")
            structure_analysis['text_blocks'] = len(text_blocks)
            
            # Get image blocks
            image_blocks = page.get_images()
            structure_analysis['image_blocks'] = len(image_blocks)
            
            # Check annotations
            if page.first_annot:
                structure_analysis['has_annotations'] = True
                structure_analysis['annotations_count'] = len(page.annots())
            
            # Determine layout complexity
            total_blocks = structure_analysis['text_blocks'] + structure_analysis['image_blocks']
            if total_blocks > 20:
                structure_analysis['layout_complexity'] = 'complex'
            elif total_blocks > 10:
                structure_analysis['layout_complexity'] = 'medium'
            
            doc.close()
            return structure_analysis
            
        except Exception as e:
            self.logger.error(f"[ERROR] Structure analysis failed for page {page_num}: {e}")
            return {'error': str(e)}
    
    def _should_use_ocr(self, content_analysis: Dict[str, Any], structure_analysis: Dict[str, Any]) -> bool:
        """Determine if OCR should be used for this page"""
        # Use OCR if:
        # 1. No text content found
        # 2. Very little text but images present
        # 3. Content type suggests image-based content
        
        text_content = content_analysis.get('text_content', '').strip()
        content_type = content_analysis.get('content_type', '')
        
        no_text = len(text_content) < 50
        has_images = structure_analysis.get('image_count', 0) > 0
        is_image_content = content_type in ['blank_or_image', 'minimal_text']
        
        should_ocr = no_text and (has_images or is_image_content)
        
        if should_ocr:
            self.logger.info(f"[INFO] Page {content_analysis.get('page_number')} - OCR recommended: no_text={no_text}, has_images={has_images}, content_type={content_type}")
        
        return should_ocr
    
    def _perform_ocr_analysis(self, pdf_path: str, page_num: int, output_dir: Path) -> Dict[str, Any]:
        """Perform OCR analysis on the page"""
        try:
            ocr_analysis = {
                'performed': True,
                'tables': [],
                'text_length': 0,
                'confidence': 'unknown'
            }
            
            # Extract tables using OCR
            ocr_tables = self.ocr_extractor.extract_tables_from_page(pdf_path, page_num, output_dir)
            ocr_analysis['tables'] = ocr_tables
            
            # Get OCR text
            if self.ocr_extractor.is_available():
                try:
                    import fitz
                    from PIL import Image
                    import pytesseract
                    import cv2
                    import numpy as np
                    
                    doc = fitz.open(pdf_path)
                    page = doc[page_num - 1]
                    
                    # Convert to image
                    mat = fitz.Matrix(2.0, 2.0)
                    pix = page.get_pixmap(matrix=mat)
                    img_data = pix.tobytes("png")
                    
                    image = Image.open(io.BytesIO(img_data))
                    cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
                    gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
                    
                    # Extract text
                    text = pytesseract.image_to_string(gray)
                    ocr_analysis['text_length'] = len(text.strip())
                    
                    doc.close()
                    
                except Exception as e:
                    self.logger.warning(f"[WARNING] OCR text extraction failed for page {page_num}: {e}")
            
            return ocr_analysis
            
        except Exception as e:
            self.logger.error(f"[ERROR] OCR analysis failed for page {page_num}: {e}")
            return {'performed': False, 'error': str(e)}
    
    def _save_page_analysis(self, analysis_result: Dict[str, Any], output_dir: Path):
        """Save comprehensive analysis to reports folder (handled by page processor)"""
        # This will be handled by the page processor in the reports folder
        pass
    
    def get_analysis_summary(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Get a summary of the page analysis"""
        return {
            'page_number': analysis_result['page_number'],
            'content_type': analysis_result.get('content_analysis', {}).get('content_type', 'unknown'),
            'has_text': analysis_result['extraction_results']['text_extracted'],
            'has_images': analysis_result.get('image_analysis', {}).get('has_images', False),
            'image_count': analysis_result.get('image_analysis', {}).get('image_count', 0),
            'tables_found': analysis_result['extraction_results']['tables_found'],
            'ocr_performed': analysis_result.get('ocr_analysis', {}).get('performed', False),
            'layout_complexity': analysis_result.get('structure_analysis', {}).get('layout_complexity', 'simple')
        }
