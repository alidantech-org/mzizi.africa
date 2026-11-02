"""
Page Processor Module
Handles individual page processing with comprehensive analysis
"""

import logging
import json
import time
import re
from pathlib import Path
from typing import Dict, Any, List

import pandas as pd

from .table_extraction_pipeline import TableExtractionPipeline
from .page_analyzer import ComprehensivePageAnalyzer
from .temp_manager import TempDirectoryManager
from .table_context_extractor import TableContextExtractor


def normalize_path(path_str: str) -> str:
    """Normalize path to use forward slashes for cross-platform compatibility"""
    return str(path_str).replace('\\', '/')


class PageProcessor:
    """Processes individual pages with comprehensive analysis and table extraction"""
    
    def __init__(self, temp_manager: TempDirectoryManager):
        self.temp_manager = temp_manager
        self.logger = logging.getLogger(__name__)
        
        # Initialize components
        self.page_analyzer = ComprehensivePageAnalyzer()
        self.table_pipeline = TableExtractionPipeline(temp_manager)
        self.context_extractor = TableContextExtractor()
    
    def process_page(self, pdf_path: str, page_num: int, output_dir: Path) -> Dict[str, Any]:
        """Process a single page with comprehensive analysis"""
        self.logger.info(f"[INFO] Processing page {page_num} - COMPREHENSIVE ANALYSIS")
        
        try:
            # Create organized folder structure
            organized_dirs = self._create_organized_directories(output_dir, page_num)
            
            # Step 1: Comprehensive page analysis (without images first)
            comprehensive_analysis = self.page_analyzer.analyze_page_comprehensive(pdf_path, page_num, organized_dirs['images'])
            
            # Step 2: Table extraction
            table_extraction = self.table_pipeline.extract_tables_from_page(pdf_path, page_num, output_dir)
            
            # Step 3: Re-analyze images with table context
            tables_on_page = table_extraction.get('tables_found', [])
            image_analysis = self.page_analyzer._analyze_page_images(pdf_path, page_num, organized_dirs['images'], tables_on_page)
            comprehensive_analysis['image_analysis'] = image_analysis
            comprehensive_analysis['extraction_results']['images_saved'] = len(image_analysis.get('extracted_images', []))
            
            # Step 4: Combine results
            page_result = {
                'page_number': page_num,
                'timestamp': time.time(),
                'comprehensive_analysis': comprehensive_analysis,
                'table_extraction': table_extraction,
                'processing_status': 'success',
                'extraction_summary': {
                    'text_extracted': comprehensive_analysis.get('extraction_results', {}).get('text_extracted', False),
                    'images_saved': comprehensive_analysis.get('extraction_results', {}).get('images_saved', 0),
                    'tables_found': len(table_extraction.get('tables_found', [])),
                    'methods_used': table_extraction.get('extraction_methods_used', []),
                    'best_table_method': table_extraction.get('best_table', {}).get('method', 'none') if table_extraction.get('best_table') else 'none'
                }
            }
            
            # Step 5: Save and validate tables with organized structure
            saved_tables = self._save_valid_tables_organized(table_extraction.get('tables_found', []), page_num, organized_dirs, pdf_path)
            page_result['saved_tables'] = saved_tables
            
            # Step 6: Extract and save page metadata (titles, headers, etc.)
            page_metadata = self._extract_page_metadata(comprehensive_analysis, page_num)
            page_result['page_metadata'] = page_metadata
            
            # Step 7: Save organized metadata
            self._save_organized_metadata(page_result, organized_dirs)
            
            # Step 8: Save analysis results
            self._save_analysis_results(comprehensive_analysis, page_num, organized_dirs)
            
            # Step 9: Log results
            self._log_page_results(page_result)
            
            return page_result
            
        except Exception as e:
            self.logger.error(f"[ERROR] Critical error processing page {page_num}: {e}")
            import traceback
            self.logger.error(f"Page {page_num} traceback: {traceback.format_exc()}")
            
            return {
                'page_number': page_num,
                'timestamp': time.time(),
                'processing_status': 'error',
                'error': str(e),
                'comprehensive_analysis': {},
                'table_extraction': {'tables_found': [], 'best_table': None},
                'saved_tables': [],
                'extraction_summary': {'tables_found': 0, 'methods_used': []}
            }
    
    def _create_organized_directories(self, output_dir: Path, page_num: int) -> Dict[str, Path]:
        """Create organized directory structure for better data management"""
        dirs = {
            'tables_by_method': output_dir / 'tables_by_method',
            'metadata': output_dir / 'metadata',
            'analysis': output_dir / 'analysis',
            'search_index': output_dir / 'search_index',
            'ocr': output_dir / 'ocr',
            'images': output_dir / 'images' / f'page_{page_num:03d}'
        }
        
        # Create all directories
        for dir_name, dir_path in dirs.items():
            dir_path.mkdir(parents=True, exist_ok=True)
            self.logger.debug(f"[DEBUG] Created directory: {dir_path}")
        
        # Create method-specific subdirectories
        methods = ['camelot_lattice', 'camelot_stream', 'tabula_lattice', 'tabula_stream', 'pdfplumber', 'text_parser', 'ocr']
        for method in methods:
            method_dir = dirs['tables_by_method'] / method
            method_dir.mkdir(exist_ok=True)
        
        # Create metadata subdirectories
        dirs['metadata_pages'] = dirs['metadata'] / 'pages'
        dirs['metadata_tables'] = dirs['metadata'] / 'tables'
        dirs['metadata_pages'].mkdir(exist_ok=True)
        dirs['metadata_tables'].mkdir(exist_ok=True)
        
        self.logger.info(f"[INFO] Created organized directory structure in {output_dir}")
        return dirs
    
    def _save_valid_tables_organized(self, tables: List[Dict[str, Any]], page_num: int, dirs: Dict[str, Path], pdf_path: str) -> List[Dict[str, Any]]:
        """Save tables organized by extraction method with context extraction"""
        saved_tables = []
        
        # Extract table contexts for all tables on this page
        table_bboxes = []
        for table_info in tables:
            # Try to get table bbox from extraction method if available
            bbox = table_info.get('bbox', None)
            if bbox:
                table_bboxes.append(bbox)
        
        # Get context for all tables
        all_contexts = []
        if table_bboxes:
            all_contexts = self.context_extractor.extract_table_context_for_multiple_tables(pdf_path, page_num, table_bboxes)
        elif tables:
            # Even without bbox, try to get general page context
            general_context = self.context_extractor.extract_table_context(pdf_path, page_num)
            all_contexts = [general_context] * len(tables)
        
        for i, table_info in enumerate(tables):
            df = table_info.get('dataframe')
            if df is None or df.empty:
                continue
            
            # Clean DataFrame before validation
            df = self._clean_dataframe(df, page_num, i)
            
            # Validate table
            validation = self._validate_table_for_saving(df, page_num, table_info.get('method', 'unknown'))
            
            if not validation['is_valid']:
                self.logger.debug(f"[DEBUG] Page {page_num} - Table {i+1} failed validation: {validation['issues']}")
                continue
            
            # Get method name
            method = table_info.get('method', 'unknown')
            method_dir = dirs['tables_by_method'] / method
            
            # Get context for this table
            table_context = all_contexts[i] if i < len(all_contexts) else {}
            
            # Save table in method-specific folder
            try:
                # Save CSV with method-specific naming
                csv_filename = f"page_{page_num:03d}_table_{i+1:02d}.csv"
                csv_path = method_dir / csv_filename
                df.to_csv(csv_path, index=False)
                
                # Save metadata in metadata folder
                metadata = {
                    'page_number': page_num,
                    'table_number': i + 1,
                    'extraction_method': method,
                    'quality_score': table_info.get('quality_score', {}),
                    'validation': validation,
                    'rows': len(df),
                    'columns': len(df.columns),
                    'column_names': list(df.columns),
                    'extraction_timestamp': time.time(),
                    'file_path': normalize_path(csv_path.relative_to(dirs['tables_by_method'].parent)),
                    # Enhanced context information
                    'table_context': {
                        'heading': table_context.get('table_heading', ''),
                        'description': table_context.get('table_description', ''),
                        'preceding_text': table_context.get('preceding_text', [])[-3:],  # Last 3 items
                        'following_text': table_context.get('following_text', [])[:3],  # First 3 items
                        'hierarchical_context': table_context.get('hierarchical_context', {}),
                        'spatial_context': table_context.get('spatial_context', {}),
                        'font_analysis': table_context.get('font_analysis', {})
                    }
                }
                
                # JSON metadata is saved in organized structure only (metadata/tables/page_XXX/)
                # No longer saving duplicate JSON in method folders
                
                # Extract quality score safely
                quality_score_data = table_info.get('quality_score', 0)
                if isinstance(quality_score_data, dict):
                    quality_score = quality_score_data.get('total_score', 0)
                elif isinstance(quality_score_data, (int, float)):
                    quality_score = float(quality_score_data)
                else:
                    quality_score = 0.0
                
                saved_table_info = {
                    'table_number': i + 1,
                    'method': method,
                    'csv_file': normalize_path(csv_path.relative_to(dirs['tables_by_method'].parent)),
                    'rows': len(df),
                    'columns': len(df.columns),
                    'quality_score': quality_score,
                    'table_heading': table_context.get('table_heading', ''),
                    'table_description': table_context.get('table_description', '')
                }
                
                saved_tables.append(saved_table_info)
                
                # Log with context information
                heading_text = f" - '{table_context.get('table_heading', '')}'" if table_context.get('table_heading') else ""
                self.logger.info(f"[SUCCESS] Page {page_num} - Table {i+1}: {method} - Score: {quality_score:.1f}{heading_text} - Saved: {csv_filename}")
                
            except Exception as e:
                self.logger.error(f"[ERROR] Failed to save table {i+1} from page {page_num}: {e}")
        
        return saved_tables
    
    def _save_organized_metadata(self, page_result: Dict[str, Any], dirs: Dict[str, Path]):
        """Save comprehensive page and table metadata in organized structure"""
        try:
            page_num = page_result['page_number']
            
            # Save page-level metadata in metadata/pages/
            page_metadata = {
                'page_number': page_num,
                'timestamp': page_result['timestamp'],
                'processing_status': page_result.get('processing_status', 'unknown'),
                'extraction_summary': page_result.get('extraction_summary', {}),
                'page_metadata': page_result.get('page_metadata', {}),
                'best_table_method': page_result.get('extraction_summary', {}).get('best_table_method', 'none'),
                'comprehensive_analysis_summary': {
                    'content_type': page_result.get('comprehensive_analysis', {}).get('content_analysis', {}).get('content_type', 'unknown'),
                    'has_images': page_result.get('comprehensive_analysis', {}).get('image_analysis', {}).get('has_images', False),
                    'image_count': page_result.get('comprehensive_analysis', {}).get('image_analysis', {}).get('image_count', 0),
                    'text_extracted': page_result.get('comprehensive_analysis', {}).get('extraction_results', {}).get('text_extracted', False)
                }
            }
            
            # Save page metadata
            page_filename = f"page_{page_num:03d}_metadata.json"
            page_path = dirs['metadata_pages'] / page_filename
            with open(page_path, 'w', encoding='utf-8') as f:
                json.dump(page_metadata, f, indent=2, default=str)
            
            # Save table-level metadata in metadata/tables/page_XXX/
            saved_tables = page_result.get('saved_tables', [])
            if saved_tables:
                # Create page-specific table metadata directory
                page_table_dir = dirs['metadata_tables'] / f'page_{page_num:03d}'
                page_table_dir.mkdir(exist_ok=True)
                
                for table_info in saved_tables:
                    table_num = table_info.get('table_number', 1)
                    
                    # Get table label if available from NLP analysis
                    table_label = self._get_table_label(table_info, page_result)
                    
                    # Create table metadata
                    table_metadata = {
                        'table_id': table_info.get('table_id', f'page_{page_num}_table_{table_num}'),
                        'table_number': table_num,
                        'page_number': page_num,
                        'intelligent_label': table_label,
                        'method': table_info.get('method', 'unknown'),
                        'csv_file': normalize_path(table_info.get('csv_file', '')),
                        'rows': table_info.get('rows', 0),
                        'columns': table_info.get('columns', 0),
                        'quality_score': table_info.get('quality_score', 0),
                        'table_heading': table_info.get('table_heading', ''),
                        'table_description': table_info.get('table_description', ''),
                        'nlp_analysis': table_info.get('nlp_analysis', {}),
                        'continuity_analysis': table_info.get('continuity_analysis', {}),
                        'extraction_timestamp': page_result.get('timestamp', 0)
                    }
                    
                    # Save table metadata with intelligent label (lowercase)
                    table_filename = f"{table_label.lower()}_metadata.json"
                    table_path = page_table_dir / table_filename
                    with open(table_path, 'w', encoding='utf-8') as f:
                        json.dump(table_metadata, f, indent=2, default=str)
            
            # Update search index
            self._update_search_index(page_result, dirs)
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to save organized metadata: {e}")
    
    def _get_table_label(self, table_info: Dict[str, Any], page_result: Dict[str, Any]) -> str:
        """Get intelligent label for table"""
        # First try to get label from table_info
        if 'intelligent_label' in table_info:
            return table_info['intelligent_label'].lower()
        
        # Try to get from NLP analysis
        if 'nlp_analysis' in table_info and 'intelligent_label' in table_info['nlp_analysis']:
            return table_info['nlp_analysis']['intelligent_label'].lower()
        
        # Fallback to generic label
        page_num = page_result.get('page_number', 0)
        table_num = table_info.get('table_number', 1)
        return f"page_{page_num}_table_{table_num}"
    
    def _save_analysis_results(self, comprehensive_analysis: Dict[str, Any], page_num: int, dirs: Dict[str, Path]):
        """Save analysis results in analysis folder"""
        try:
            # Save comprehensive analysis
            analysis_filename = f"page_{page_num:03d}_analysis.json"
            analysis_path = dirs['analysis'] / analysis_filename
            
            # Remove dataframes (not JSON serializable)
            serializable_analysis = comprehensive_analysis.copy()
            if 'extraction_results' in serializable_analysis:
                extraction_results = serializable_analysis['extraction_results']
                if 'dataframes' in extraction_results:
                    del extraction_results['dataframes']
            
            with open(analysis_path, 'w', encoding='utf-8') as f:
                json.dump(serializable_analysis, f, indent=2, default=str)
            
            # Save text content separately for searchability
            text_content = comprehensive_analysis.get('extraction_results', {}).get('text_content', '')
            if text_content:
                text_filename = f"page_{page_num:03d}_text.txt"
                text_path = dirs['analysis'] / text_filename
                with open(text_path, 'w', encoding='utf-8') as f:
                    f.write(text_content)
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to save analysis results: {e}")
    
    def _update_search_index(self, page_result: Dict[str, Any], dirs: Dict[str, Path]):
        """Update search index for searchable data"""
        try:
            # Use search_index folder for search index
            search_index_dir = dirs['search_index']
            search_index_dir.mkdir(exist_ok=True)
            search_index_file = search_index_dir / 'search_index.json'
            
            # Load existing index or create new
            if search_index_file.exists():
                with open(search_index_file, 'r', encoding='utf-8') as f:
                    search_index = json.load(f)
            else:
                search_index = {
                    'pages': [],
                    'tables': [],
                    'methods': {},
                    'created_at': time.time()
                }
            
            # Add page entry
            page_entry = {
                'page_number': page_result['page_number'],
                'timestamp': page_result['timestamp'],
                'status': page_result.get('processing_status', 'unknown'),
                'tables_count': len(page_result.get('saved_tables', [])),
                'methods_used': page_result.get('extraction_summary', {}).get('methods_used', []),
                'best_method': page_result.get('extraction_summary', {}).get('best_table_method', 'none'),
                'page_title': page_result.get('page_metadata', {}).get('page_title', ''),
                'table_titles': page_result.get('page_metadata', {}).get('table_titles', []),
                'section_headers': page_result.get('page_metadata', {}).get('section_headers', []),
                'key_text': page_result.get('page_metadata', {}).get('key_text', [])
            }
            
            # Update or add page entry
            existing_page_idx = next((i for i, p in enumerate(search_index['pages']) if p['page_number'] == page_result['page_number']), None)
            if existing_page_idx is not None:
                search_index['pages'][existing_page_idx] = page_entry
            else:
                search_index['pages'].append(page_entry)
            
            # Add table entries
            for table in page_result.get('saved_tables', []):
                table_entry = {
                    'page_number': page_result['page_number'],
                    'table_number': table['table_number'],
                    'method': table['method'],
                    'rows': table['rows'],
                    'columns': table['columns'],
                    'quality_score': table['quality_score'],
                    'csv_file': normalize_path(table['csv_file'])
                }
                
                # Update method statistics
                method = table['method']
                if method not in search_index['methods']:
                    search_index['methods'][method] = {
                        'count': 0,
                        'total_tables': 0,
                        'avg_quality': 0.0,
                        'pages': []  # Initialize as list, not set
                    }
                
                search_index['methods'][method]['count'] += 1
                search_index['methods'][method]['total_tables'] += 1
                
                # Add page if not already present
                if page_result['page_number'] not in search_index['methods'][method]['pages']:
                    search_index['methods'][method]['pages'].append(page_result['page_number'])
                
                # Update average quality
                current_avg = search_index['methods'][method]['avg_quality']
                current_count = search_index['methods'][method]['count']
                search_index['methods'][method]['avg_quality'] = (current_avg * (current_count - 1) + table['quality_score']) / current_count
            
            # Save updated index
            search_index['updated_at'] = time.time()
            with open(search_index_file, 'w', encoding='utf-8') as f:
                json.dump(search_index, f, indent=2, default=str)
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to update search index: {e}")
    
    def _save_valid_tables(self, tables: List[Dict[str, Any]], page_num: int, output_dir: Path) -> List[Dict[str, Any]]:
        """Save only valid tables with quality checks"""
        saved_tables = []
        
        for i, table_info in enumerate(tables):
            df = table_info.get('dataframe')
            if df is None or df.empty:
                continue
            
            # Clean DataFrame before validation
            df = self._clean_dataframe(df, page_num, i)
            
            # Validate table
            validation = self._validate_table_for_saving(df, page_num, table_info.get('method', 'unknown'))
            
            if not validation['is_valid']:
                self.logger.debug(f"[DEBUG] Page {page_num} - Table {i+1} failed validation: {validation['issues']}")
                continue
            
            # Save table
            try:
                # Save CSV
                csv_filename = f"page_{page_num:03d}_table_{i+1:02d}.csv"
                csv_path = output_dir / csv_filename
                df.to_csv(csv_path, index=False)
                
                # Save metadata
                metadata = {
                    'page_number': page_num,
                    'table_number': i + 1,
                    'extraction_method': table_info.get('method', 'unknown'),
                    'quality_score': table_info.get('quality_score', {}),
                    'validation': validation,
                    'rows': len(df),
                    'columns': len(df.columns),
                    'column_names': list(df.columns),
                    'extraction_timestamp': time.time()
                }
                
                json_filename = f"page_{page_num:03d}_table_{i+1:02d}_metadata.json"
                json_path = output_dir / json_filename
                with open(json_path, 'w') as f:
                    json.dump(metadata, f, indent=2, default=str)
                
                # Extract quality score safely
                quality_score_data = table_info.get('quality_score', 0)
                if isinstance(quality_score_data, dict):
                    quality_score = quality_score_data.get('total_score', 0)
                elif isinstance(quality_score_data, (int, float)):
                    quality_score = float(quality_score_data)
                else:
                    quality_score = 0.0
                
                saved_table_info = {
                    'table_number': i + 1,
                    'method': table_info.get('method', 'unknown'),
                    'csv_file': csv_filename,
                    'json_file': json_filename,
                    'rows': len(df),
                    'columns': len(df.columns),
                    'quality_score': quality_score
                }
                
                saved_tables.append(saved_table_info)
                
                # Log score safely
                score_for_log = quality_score
                if isinstance(validation['quality_score'], dict):
                    score_for_log = validation['quality_score'].get('total_score', quality_score)
                
                self.logger.info(f"[SUCCESS] Page {page_num} - Table {i+1}: {table_info.get('method')} - Score: {score_for_log:.1f} - Saved: {csv_filename}")
                
            except Exception as e:
                self.logger.error(f"[ERROR] Failed to save table {i+1} from page {page_num}: {e}")
        
        return saved_tables
    
    def _extract_page_metadata(self, comprehensive_analysis: Dict[str, Any], page_num: int) -> Dict[str, Any]:
        """Extract page metadata including titles, headers, and table labels"""
        try:
            metadata = {
                'page_number': page_num,
                'page_title': '',
                'section_headers': [],
                'table_titles': [],
                'key_text': [],
                'content_summary': {},
                'extracted_titles': []  # Track titles to avoid table contamination
            }
            
            # Extract text content
            text_content = comprehensive_analysis.get('extraction_results', {}).get('text_content', '')
            
            # Find page titles (lines that look like titles)
            lines = [line.strip() for line in text_content.split('\n') if line.strip()]
            
            for i, line in enumerate(lines):
                # Skip very short lines (likely noise)
                if len(line) < 3:
                    continue
                
                # Skip lines that are clearly table data (numbers, codes, etc.)
                if self._is_likely_table_data(line):
                    continue
                
                # Potential title criteria: short, at top, capitalized
                if i < 5 and len(line) < 100 and line[0].isupper():
                    if not metadata['page_title'] and any(keyword in line.upper() for keyword in ['TABLE', 'REPORT', 'SUMMARY', 'ANALYSIS', 'PAGE', 'CHAPTER']):
                        metadata['page_title'] = line
                        metadata['extracted_titles'].append(line)
                
                # Section headers (ALL CAPS, reasonable length)
                if line.isupper() and len(line) < 80 and not any(char.isdigit() for char in line):
                    metadata['section_headers'].append(line)
                    metadata['extracted_titles'].append(line)
                
                # Table titles (contain "Table" and numbers)
                if 'table' in line.lower() and any(char.isdigit() for char in line):
                    metadata['table_titles'].append(line)
                    metadata['extracted_titles'].append(line)
                
                # Key text (important information)
                if any(keyword in line.lower() for keyword in ['total', 'summary', 'distribution', 'fund', 'report', 'analysis']):
                    metadata['key_text'].append(line)
            
            # Content summary
            metadata['content_summary'] = {
                'total_lines': len(lines),
                'has_tables': len(metadata['table_titles']) > 0,
                'has_headers': len(metadata['section_headers']) > 0,
                'text_density': len(text_content) / 1000,  # KB of text
                'titles_extracted': len(metadata['extracted_titles'])
            }
            
            self.logger.info(f"[INFO] Page {page_num} - Extracted metadata: {len(metadata['table_titles'])} table titles, {len(metadata['section_headers'])} headers, {len(metadata['extracted_titles'])} total titles")
            
            return metadata
            
        except Exception as e:
            self.logger.warning(f"[WARNING] Failed to extract metadata for page {page_num}: {e}")
            return {
                'page_number': page_num,
                'page_title': '',
                'section_headers': [],
                'table_titles': [],
                'key_text': [],
                'content_summary': {},
                'extracted_titles': []
            }
    
    def _is_likely_table_data(self, line: str) -> bool:
        """Check if a line is likely table data rather than a title"""
        line = line.strip()
        
        # Skip if line is mostly numbers
        if re.match(r'^[\d\s,.-]+$', line):
            return True
        
        # Skip if line looks like codes/IDs
        if re.match(r'^[A-Z]{2,4}[-\s]?\d+', line):
            return True
        
        # Skip if line has many numbers mixed with text (likely table row)
        words = line.split()
        number_count = sum(1 for word in words if any(char.isdigit() for char in word))
        if number_count > len(words) * 0.5 and len(words) > 3:
            return True
        
        # Skip if line contains table-like patterns
        if re.search(r'\s{2,}|\t{1,}', line) and len(words) > 3:
            return True
        
        return False
    
    def _clean_dataframe(self, df: pd.DataFrame, page_num: int, table_num: int) -> pd.DataFrame:
        """Clean DataFrame by removing empty columns and fixing NaN column names"""
        try:
            # Make a copy to avoid modifying original
            cleaned_df = df.copy()
            
            # Fix NaN column names - avoid pandas Series issues
            new_columns = []
            for i, col in enumerate(cleaned_df.columns):
                # Convert column name to string first, then check
                col_str = str(col)
                
                # Check for NaN, empty, or invalid column names
                if (col_str == 'nan' or col_str == 'NaN' or 
                    col_str.strip() == '' or 
                    col_str.lower() == 'unnamed'):
                    new_columns.append(f'Column_{i+1}')
                else:
                    # Clean column name
                    clean_name = col_str.replace('\n', ' ').strip()
                    if len(clean_name) > 50:
                        clean_name = clean_name[:50]
                    new_columns.append(clean_name)
            
            cleaned_df.columns = new_columns
            
            # Identify and remove completely empty columns
            columns_to_keep = []
            for col in cleaned_df.columns:
                try:
                    # Use .sum() to get scalar values, avoid Series ambiguity
                    non_empty_count = int(cleaned_df[col].notna().sum())
                    total_rows = len(cleaned_df)
                    
                    # Keep column if:
                    # 1. Has more than 10% non-empty data, OR
                    # 2. Has a meaningful column name (not just "Column_X")
                    col_str = str(col)
                    meaningful_name = not col_str.startswith('Column_') or len(col_str) > 8
                    
                    # Safe comparison with scalar values
                    if total_rows > 0:
                        non_empty_ratio = non_empty_count / total_rows
                        if (non_empty_ratio > 0.1) or meaningful_name:
                            columns_to_keep.append(col)
                        else:
                            self.logger.debug(f"[DEBUG] Page {page_num} - Table {table_num} - Removing empty column: {col} (ratio: {non_empty_ratio:.2f})")
                    else:
                        # Edge case: empty dataframe
                        columns_to_keep.append(col)
                        
                except Exception as e:
                    # If there's an error with this column, keep it to be safe
                    self.logger.debug(f"[DEBUG] Error processing column {col}: {e}, keeping column")
                    columns_to_keep.append(col)
            
            # Keep only the good columns
            if columns_to_keep != list(cleaned_df.columns):
                cleaned_df = cleaned_df[columns_to_keep]
                self.logger.info(f"[INFO] Page {page_num} - Table {table_num} - Kept {len(columns_to_keep)}/{len(df.columns)} columns")
            
            return cleaned_df
            
        except Exception as e:
            self.logger.warning(f"[WARNING] Failed to clean DataFrame for page {page_num} table {table_num}: {e}")
            return df
    
    def _validate_table_for_saving(self, df: pd.DataFrame, page_num: int, method: str) -> Dict[str, Any]:
        """Validate table before saving"""
        validation = {
            'is_valid': True,
            'issues': [],
            'quality_score': {},
            'rows': len(df),
            'columns': len(df.columns)
        }
        
        # Basic checks
        if df.empty:
            validation['is_valid'] = False
            validation['issues'].append("Empty dataframe")
            return validation
        
        if len(df) < 2:
            validation['is_valid'] = False
            validation['issues'].append("Too few rows")
            return validation
        
        if len(df.columns) < 2:
            validation['is_valid'] = False
            validation['issues'].append("Too few columns")
            return validation
        
        # Content quality checks
        empty_ratio = df.isna().sum().sum() / (len(df) * len(df.columns))
        if empty_ratio > 0.6:
            validation['is_valid'] = False
            validation['issues'].append(f"Too many empty cells: {empty_ratio:.1%}")
        
        # Check for meaningful content
        meaningful_rows = 0
        for _, row in df.iterrows():
            non_empty = row.dropna()
            if len(non_empty) >= 2:
                # Check if content has meaningful length - safe data type handling
                meaningful_content = 0
                for val in non_empty.astype(str):
                    val_str = str(val)
                    if len(val_str.strip()) > 2:
                        meaningful_content += 1
                
                if meaningful_content >= 2:
                    meaningful_rows += 1
        
        if meaningful_rows < len(df) * 0.3:  # At least 30% meaningful rows
            validation['is_valid'] = False
            validation['issues'].append(f"Not enough meaningful rows: {meaningful_rows}/{len(df)}")
        
        # Get quality score
        try:
            from .quality_scorer import EnhancedTableQualityScorer
            scorer = EnhancedTableQualityScorer()
            content_analysis = {'content_type': 'unknown', 'page_number': page_num}
            quality_score = scorer.score_dataframe(df, content_analysis)
            validation['quality_score'] = quality_score
            
            # Additional quality threshold - handle different score types
            if isinstance(quality_score, dict):
                score_value = quality_score.get('total_score', 0)
            elif isinstance(quality_score, (int, float)):
                score_value = float(quality_score)
            else:
                score_value = 0.0
            
            if score_value < 20:
                validation['is_valid'] = False
                validation['issues'].append(f"Quality score too low: {score_value:.1f}")
        
        except Exception as e:
            self.logger.warning(f"[WARNING] Could not calculate quality score for page {page_num}: {e}")
            validation['quality_score'] = {'total_score': 50.0}  # Default score
        
        return validation
    
    def _save_page_metadata(self, page_result: Dict[str, Any], output_dir: Path):
        """Save comprehensive page metadata"""
        try:
            metadata_filename = f"page_{page_result['page_number']:03d}_processing_result.json"
            metadata_path = output_dir / metadata_filename
            
            # Remove dataframes (not JSON serializable)
            serializable_result = page_result.copy()
            if 'table_extraction' in serializable_result:
                for table in serializable_result['table_extraction'].get('tables_found', []):
                    if 'dataframe' in table:
                        del table['dataframe']
            
            with open(metadata_path, 'w', encoding='utf-8') as f:
                json.dump(serializable_result, f, indent=2, default=str)
            
        except Exception as e:
            self.logger.error(f"[ERROR] Failed to save page metadata: {e}")
    
    def _log_page_results(self, page_result: Dict[str, Any]):
        """Log processing results"""
        page_num = page_result['page_number']
        summary = page_result.get('extraction_summary', {})
        
        if page_result.get('processing_status') == 'error':
            self.logger.warning(f"[WARNING] Page {page_num} processed with errors")
        else:
            self.logger.info(f"[SUCCESS] Page {page_num} - Text: {summary.get('text_extracted', False)}, "
                           f"Images: {summary.get('images_saved', 0)}, "
                           f"Tables: {summary.get('tables_found', 0)}, "
                           f"Methods: {', '.join(summary.get('methods_used', []))}")
    
    def get_processing_summary(self, page_result: Dict[str, Any]) -> Dict[str, Any]:
        """Get a summary of page processing results"""
        summary = page_result.get('extraction_summary', {})
        
        return {
            'page_number': page_result['page_number'],
            'processing_status': page_result.get('processing_status', 'unknown'),
            'text_extracted': summary.get('text_extracted', False),
            'images_saved': summary.get('images_saved', 0),
            'tables_found': summary.get('tables_found', 0),
            'tables_saved': len(page_result.get('saved_tables', [])),
            'methods_used': summary.get('methods_used', []),
            'best_table_method': summary.get('best_table_method', 'none'),
            'has_error': page_result.get('processing_status') == 'error',
            'error_message': page_result.get('error', '') if page_result.get('processing_status') == 'error' else ''
        }
