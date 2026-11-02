"""
Table Extraction Pipeline Module
Orchestrates the complete table extraction workflow with NLP enhancement
"""

import logging
import time
from pathlib import Path
from typing import Dict, Any, List

import pandas as pd

from .content_analyzer import ContentAnalyzer
from .extraction_methods import ExtractionMethods
from .quality_scorer import EnhancedTableQualityScorer
from .text_table_parser import TextTableParser
from .ocr_extractor import OCRTableExtractor
from .temp_manager import TempDirectoryManager
from .nlp_analyzer import PDFNLPAnalyzer
from .pdf_content_analyzer import PDFContentAnalyzer


class TableExtractionPipeline:
    """Complete table extraction pipeline with multiple fallback methods"""
    
    def __init__(self, temp_manager: TempDirectoryManager):
        self.temp_manager = temp_manager
        self.logger = logging.getLogger(__name__)
        
        # Initialize extraction components
        self.content_analyzer = ContentAnalyzer()
        self.extraction_methods = ExtractionMethods(temp_manager)
        self.quality_scorer = EnhancedTableQualityScorer()
        self.text_table_parser = TextTableParser()
        self.ocr_extractor = OCRTableExtractor()
        
        # Initialize NLP components
        self.nlp_analyzer = PDFNLPAnalyzer()
        self.content_analyzer_pdf = PDFContentAnalyzer()
        
        # Store previous tables for continuity detection
        self.previous_tables = []
    
    def extract_tables_from_page(self, pdf_path: str, page_num: int, output_dir: Path) -> Dict[str, Any]:
        """Extract all tables from a single page using multiple methods"""
        self.logger.info(f"[INFO] Extracting tables from page {page_num}")
        
        extraction_result = {
            'page_number': page_num,
            'extraction_methods_used': [],
            'tables_found': [],
            'best_table': None,
            'errors': []
        }
        
        try:
            # Extract page content for NLP analysis
            page_text = self.content_analyzer_pdf.extract_page_text(pdf_path, page_num)
            page_structure = self.content_analyzer_pdf.analyze_page_structure(pdf_path, page_num)
            
            # Method 1: Standard PDF extraction methods
            standard_tables = self._extract_with_standard_methods(pdf_path, page_num)
            if standard_tables:
                extraction_result['extraction_methods_used'].append('standard')
                # Enhance with NLP analysis
                enhanced_tables = self._enhance_tables_with_nlp(standard_tables, page_text, page_num, page_structure)
                extraction_result['tables_found'].extend(enhanced_tables)
                self.logger.info(f"[INFO] Page {page_num} - Standard methods found {len(standard_tables)} tables")
            
            # Method 2: Text-based parsing (fallback)
            if not extraction_result['tables_found']:
                text_tables = self._extract_with_text_parsing(pdf_path, page_num)
                if text_tables:
                    extraction_result['extraction_methods_used'].append('text_parser')
                    enhanced_text_tables = self._enhance_tables_with_nlp(text_tables, page_text, page_num, page_structure)
                    extraction_result['tables_found'].extend(enhanced_text_tables)
                    self.logger.info(f"[INFO] Page {page_num} - Text parser found {len(text_tables)} tables")
            
            # Method 3: OCR extraction (final fallback when no tables found)
            if not extraction_result['tables_found']:
                self.logger.info(f"[INFO] Page {page_num} - No tables from standard methods, trying OCR extraction")
                # Create OCR directory
                ocr_dir = output_dir / "ocr"
                ocr_dir.mkdir(exist_ok=True)
                ocr_tables = self._extract_with_ocr(pdf_path, page_num, output_dir, ocr_dir)
                if ocr_tables:
                    extraction_result['extraction_methods_used'].append('ocr')
                    enhanced_ocr_tables = self._enhance_tables_with_nlp(ocr_tables, page_text, page_num, page_structure)
                    extraction_result['tables_found'].extend(enhanced_ocr_tables)
                    self.logger.info(f"[INFO] Page {page_num} - OCR found {len(ocr_tables)} tables")
                else:
                    self.logger.warning(f"[WARNING] Page {page_num} - OCR also failed to find tables")
            
            # Detect table continuity and update labels
            if extraction_result['tables_found']:
                extraction_result['tables_found'] = self._detect_table_continuity(extraction_result['tables_found'], page_text, page_num)
            
            # Score and select best table
            if extraction_result['tables_found']:
                extraction_result['best_table'] = self._select_best_table(extraction_result['tables_found'], page_num)
                
                # Store tables for continuity detection
                self.previous_tables.extend(extraction_result['tables_found'])
                # Keep only last 10 tables to avoid memory issues
                self.previous_tables = self.previous_tables[-10:]
            else:
                self.logger.warning(f"[WARNING] Page {page_num} - No tables found with any method")
            
            self.logger.info(f"[SUCCESS] Page {page_num} - Total tables extracted: {len(extraction_result['tables_found'])}")
            
        except Exception as e:
            self.logger.error(f"[ERROR] Table extraction failed for page {page_num}: {e}")
            extraction_result['errors'].append(str(e))
        
        return extraction_result
    
    def _extract_with_standard_methods(self, pdf_path: str, page_num: int) -> List[Dict[str, Any]]:
        """Extract tables using standard PDF libraries"""
        try:
            table_candidates = self.extraction_methods.extract_tables_with_all_methods(pdf_path, page_num)
            
            scored_tables = []
            for method, tables in table_candidates.items():
                for i, df in enumerate(tables):
                    # Safe data type checks
                    if hasattr(df, 'empty') and not df.empty:
                        try:
                            # Get content analysis for quality scoring
                            content_analysis = self.content_analyzer.analyze_page_content(pdf_path, page_num)
                            
                            # Score the table with safe data handling
                            quality_score = self.quality_scorer.score_dataframe(df, content_analysis)
                            
                            # Ensure quality_score is a dictionary
                            if not isinstance(quality_score, dict):
                                self.logger.debug(f"[DEBUG] Quality score not a dict: {type(quality_score)} - converting to dict")
                                quality_score = {
                                    'total_score': float(quality_score) if isinstance(quality_score, (int, float)) else 50.0,
                                    'issues': ['Score format converted']
                                }
                            
                            scored_tables.append({
                                'method': method,
                                'table_index': i,
                                'dataframe': df.copy(),
                                'quality_score': quality_score,
                                'extraction_method': method
                            })
                        except Exception as score_error:
                            self.logger.warning(f"[WARNING] Failed to score table {i} from {method}: {score_error}")
                            # Still add the table with a default score
                            scored_tables.append({
                                'method': method,
                                'table_index': i,
                                'dataframe': df.copy(),
                                'quality_score': {'total_score': 50.0, 'issues': ['Scoring failed']},
                                'extraction_method': method
                            })
            
            return scored_tables
            
        except Exception as e:
            self.logger.error(f"[ERROR] Standard extraction failed for page {page_num}: {e}")
            return []
    
    def _extract_with_text_parsing(self, pdf_path: str, page_num: int) -> List[Dict[str, Any]]:
        """Extract tables by parsing text content"""
        try:
            # Get text content
            content_analysis = self.content_analyzer.analyze_page_content(pdf_path, page_num)
            text_content = content_analysis.get('text_content', '')
            
            if not text_content.strip():
                return []
            
            # Parse tables from text
            text_tables = self.text_table_parser.extract_tables_from_text(text_content, page_num)
            
            scored_tables = []
            for i, df in enumerate(text_tables):
                if not df.empty:
                    # Score the table
                    quality_score = self.quality_scorer.score_dataframe(df, content_analysis)
                    
                    scored_tables.append({
                        'method': 'text_parser',
                        'table_index': i,
                        'dataframe': df.copy(),
                        'quality_score': quality_score,
                        'extraction_method': 'text_parser'
                    })
            
            return scored_tables
            
        except Exception as e:
            self.logger.error(f"[ERROR] Text parsing failed for page {page_num}: {e}")
            return []
    
    def _extract_with_ocr(self, pdf_path: str, page_num: int, output_dir: Path, ocr_dir: Path = None) -> List[Dict[str, Any]]:
        """Extract tables using OCR"""
        try:
            ocr_tables = self.ocr_extractor.extract_tables_from_page(pdf_path, page_num, output_dir, ocr_dir)
            
            scored_tables = []
            for i, df in enumerate(ocr_tables):
                if not df.empty:
                    # Get content analysis for quality scoring
                    content_analysis = self.content_analyzer.analyze_page_content(pdf_path, page_num)
                    
                    # Score the table
                    quality_score = self.quality_scorer.score_dataframe(df, content_analysis)
                    
                    scored_tables.append({
                        'method': 'ocr',
                        'table_index': i,
                        'dataframe': df.copy(),
                        'quality_score': quality_score,
                        'extraction_method': 'ocr'
                    })
            
            return scored_tables
            
        except Exception as e:
            self.logger.error(f"[ERROR] OCR extraction failed for page {page_num}: {e}")
            return []
    
    def _select_best_table(self, tables: List[Dict[str, Any]], page_num: int) -> Dict[str, Any]:
        """Select the best table from extracted candidates"""
        if not tables:
            return None
        
        # Sort by quality score
        scored_tables = []
        for table in tables:
            score_data = table.get('quality_score', 0)
            
            # Handle different score data types
            if isinstance(score_data, dict):
                score = score_data.get('total_score', 0)
            elif isinstance(score_data, (int, float)):
                score = float(score_data)
            else:
                score = 0.0
            
            scored_tables.append((score, table))
        
        # Sort by score (highest first)
        scored_tables.sort(key=lambda x: x[0], reverse=True)
        
        best_score, best_table = scored_tables[0]
        
        self.logger.info(f"[INFO] Page {page_num} - Best table: {best_table.get('method')} - Score: {best_score}")
        
        return best_table
    
    def validate_table(self, df: pd.DataFrame, page_num: int, method: str) -> Dict[str, Any]:
        """Validate table integrity and quality"""
        # Use the existing quality scorer for validation
        content_analysis = {'content_type': 'unknown', 'page_number': page_num}
        quality_score = self.quality_scorer.score_dataframe(df, content_analysis)
        
        # Basic validation checks
        is_valid = True
        issues = []
        
        if df.empty:
            is_valid = False
            issues.append("Empty dataframe")
        
        if len(df) < 2:
            is_valid = False
            issues.append("Too few rows")
        
        if len(df.columns) < 2:
            is_valid = False
            issues.append("Too few columns")
        
        # Check for too many empty cells
        empty_ratio = df.isna().sum().sum() / (len(df) * len(df.columns))
        if empty_ratio > 0.5:
            is_valid = False
            issues.append("Too many empty cells")
        
        return {
            'is_valid': is_valid,
            'issues': issues,
            'quality_score': quality_score,
            'rows': len(df),
            'columns': len(df.columns),
            'empty_ratio': empty_ratio
        }
    
    def _enhance_tables_with_nlp(self, tables: List[Dict[str, Any]], page_text: str, page_num: int, page_structure: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Enhance tables with NLP analysis and intelligent labeling"""
        enhanced_tables = []
        
        for i, table in enumerate(tables):
            try:
                table_data = table.get('data', pd.DataFrame())
                if table_data.empty:
                    enhanced_tables.append(table)
                    continue
                
                # Perform NLP analysis
                nlp_analysis = self.nlp_analyzer.analyze_table_context(table_data, page_text, page_num)
                
                # Add intelligent label
                if nlp_analysis.get('intelligent_label'):
                    table['intelligent_label'] = nlp_analysis['intelligent_label']
                
                # Add NLP insights
                if nlp_analysis:
                    table['nlp_analysis'] = nlp_analysis
                
                # Add table ID for continuity tracking
                table['table_id'] = f"page_{page_num}_table_{i+1}"
                table['page_number'] = page_num
                
                enhanced_tables.append(table)
                
            except Exception as e:
                self.logger.warning(f"[WARNING] NLP enhancement failed for table {i}: {e}")
                enhanced_tables.append(table)
        
        return enhanced_tables
    
    def _detect_table_continuity(self, tables: List[Dict[str, Any]], page_text: str, page_num: int) -> List[Dict[str, Any]]:
        """Detect table continuity across pages"""
        enhanced_tables = []
        
        for table in tables:
            try:
                table_data = table.get('data', pd.DataFrame())
                if table_data.empty:
                    enhanced_tables.append(table)
                    continue
                
                # Detect continuity with previous tables
                continuity = self.nlp_analyzer.detect_table_continuity(
                    table_data, self.previous_tables, page_text
                )
                
                # Add continuity information
                table['continuity_analysis'] = continuity
                
                # Update label if it's a continuation
                if continuity.get('is_continuation'):
                    original_label = table.get('intelligent_label', f'Page_{page_num}_Table')
                    table['intelligent_label'] = f"{original_label}_Continued"
                    table['continuation_type'] = continuity.get('continuation_type', 'related_table')
                
                enhanced_tables.append(table)
                
            except Exception as e:
                self.logger.warning(f"[WARNING] Continuity detection failed: {e}")
                enhanced_tables.append(table)
        
        return enhanced_tables
    
    def analyze_pdf_structure(self, pdf_path: str) -> Dict[str, Any]:
        """Analyze entire PDF structure for intelligent extraction"""
        structure_analysis = {
            'toc_analysis': {},
            'multi_page_tables': {},
            'table_pages': [],
            'total_pages': 0
        }
        
        try:
            # Detect table of contents
            toc = self.content_analyzer_pdf.detect_table_of_contents(pdf_path)
            structure_analysis['toc_analysis'] = toc
            structure_analysis['table_pages'] = self.content_analyzer_pdf.get_table_pages_from_toc(pdf_path)
            
            # Detect multi-page tables
            multi_page = self.content_analyzer_pdf.detect_multi_page_tables(pdf_path)
            structure_analysis['multi_page_tables'] = multi_page
            
            # Get total pages
            structure_analysis['total_pages'] = self.content_analyzer_pdf._get_page_count(pdf_path)
            
            self.logger.info(f"[INFO] PDF structure analyzed - TOC: {toc.get('has_toc', False)}, "
                           f"Table pages: {len(structure_analysis['table_pages'])}, "
                           f"Multi-page tables: {len(multi_page.get('page_connections', []))}")
            
        except Exception as e:
            self.logger.error(f"[ERROR] PDF structure analysis failed: {e}")
        
        return structure_analysis
