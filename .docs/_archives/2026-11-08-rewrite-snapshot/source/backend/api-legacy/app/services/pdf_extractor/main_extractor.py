"""
Main PDF Extractor Module
Simplified main orchestrator using modular components
"""

import logging
import json
import time
from pathlib import Path
from typing import Dict, Any, List

from .page_processor import PageProcessor, normalize_path
from .temp_manager import TempDirectoryManager


class MainPDFExtractor:
    """Main PDF extractor with modular architecture"""
    
    def __init__(self, output_dir: str = "_data/extraction", max_workers: int = 4):
        self.output_dir = Path(output_dir)
        self.max_workers = max_workers
        self.logger = logging.getLogger(__name__)
        self.extraction_log = []
        
        # Initialize components
        self.temp_manager = TempDirectoryManager()
        self.page_processor = PageProcessor(self.temp_manager)
        
        # Setup logging
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.logger.setLevel(logging.INFO)
        if not self.logger.handlers:
            handler = logging.StreamHandler()
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
    
    def extract_pdf(self, pdf_path: str) -> Dict[str, Any]:
        """Extract tables from PDF with comprehensive analysis and NLP enhancement"""
        start_time = time.time()
        pdf_path = Path(pdf_path)
        
        if not pdf_path.exists():
            return {
                'success': False,
                'error': f'PDF file not found: {pdf_path}',
                'extraction_time': 0
            }
        
        # Create output directory
        pdf_name = pdf_path.stem
        normalized_name = ''.join(c if c.isalnum() else '_' for c in pdf_name).lower()
        output_dir = self.output_dir / normalized_name
        output_dir.mkdir(parents=True, exist_ok=True)
        
        self.logger.info(f"[INFO] Starting extraction: {pdf_name}")
        self.logger.info(f"[INFO] Output directory: {normalized_name}")
        
        try:
            # Analyze PDF structure first
            structure_analysis = self.page_processor.table_pipeline.analyze_pdf_structure(str(pdf_path))
            
            # Get total pages
            total_pages = self._get_page_count(pdf_path)
            self.logger.info(f"[INFO] Total pages: {total_pages}")
            
            # Create reports folder for analysis and log files
            reports_dir = output_dir / "reports"
            reports_dir.mkdir(exist_ok=True)
            
            # Save structure analysis
            structure_path = reports_dir / "pdf_structure_analysis.json"
            with open(structure_path, 'w') as f:
                json.dump(structure_analysis, f, indent=2, default=str)
            
            # Process all pages
            all_page_results = []
            for page_num in range(1, total_pages + 1):
                # Show progress for page processing
                progress_percent = int((page_num / total_pages) * 100)
                filled = int((page_num / total_pages) * 20)
                bar = '█' * filled + '░' * (20 - filled)
                print(f'\r[INFO] Processing pages [{bar}] {progress_percent}% ({page_num}/{total_pages})', end='', flush=True)
                
                self.logger.info(f"[INFO] Processing page {page_num}/{total_pages}")
                
                try:
                    page_result = self.page_processor.process_page(str(pdf_path), page_num, output_dir)
                    all_page_results.append(page_result)
                    
                    # Log progress
                    if page_result.get('processing_status') == 'error':
                        self.logger.warning(f"[WARNING] Page {page_num} had errors")
                    else:
                        summary = page_result.get('extraction_summary', {})
                        self.logger.info(f"[SUCCESS] Page {page_num} - {summary.get('tables_found', 0)} tables found")
                
                except Exception as e:
                    self.logger.error(f"[ERROR] Critical error on page {page_num}: {e}")
                    all_page_results.append({
                        'page_number': page_num,
                        'processing_status': 'error',
                        'error': str(e)
                    })
            
            # Clear the progress bar line
            print()  # New line after progress bar
            
            # Generate final report with NLP insights
            final_results = self._compile_final_results(all_page_results)
            extraction_time = time.time() - start_time
            report = self._generate_report(pdf_name, final_results, total_pages, extraction_time, output_dir, structure_analysis)
            
            # Save extraction log
            self._save_extraction_log(output_dir)
            
            # Generate search index
            self._generate_search_index(final_results, output_dir)
            
            # Cleanup
            self.temp_manager.cleanup_all_temp_dirs()
            
            self.logger.info(f"[SUCCESS] Extraction completed! Pages: {len(final_results)}, Tables: {sum(r.get('tables_saved', 0) for r in final_results)}")
            
            return report
            
        except Exception as e:
            self.logger.error(f"[ERROR] Extraction failed: {e}")
            self.temp_manager.cleanup_all_temp_dirs()
            return {
                'success': False,
                'error': str(e),
                'extraction_time': time.time() - start_time
            }
    
    def _get_page_count(self, pdf_path: Path) -> int:
        """Get total page count from PDF"""
        try:
            import PyPDF2
            with open(pdf_path, 'rb') as file:
                reader = PyPDF2.PdfReader(file)
                return len(reader.pages)
        except Exception as e:
            self.logger.warning(f"Could not count pages: {e}")
            return 1
    
    def _compile_final_results(self, all_page_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Compile final results from all pages"""
        final_results = []
        
        for page_result in all_page_results:
            summary = self.page_processor.get_processing_summary(page_result)
            
            if summary.get('tables_saved', 0) > 0:
                final_results.append({
                    'page_number': summary['page_number'],
                    'tables_saved': summary['tables_saved'],
                    'methods_used': summary['methods_used'],
                    'processing_status': summary['processing_status'],
                    'saved_tables': page_result.get('saved_tables', [])
                })
        
        return final_results
    
    def _generate_report(self, pdf_name: str, final_results: List[Dict], total_pages: int, 
                        extraction_time: float, output_dir: Path, structure_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate comprehensive extraction report with NLP insights"""
        successful_pages = len(final_results)
        total_tables = sum(r.get('tables_saved', 0) for r in final_results)
        
        # Calculate total rows and quality metrics from saved tables
        total_rows = 0
        all_quality_scores = []
        method_performance = {}
        nlp_insights = {'intelligent_labels': [], 'continuity_detected': 0, 'entity_types': {}}
        
        for result in final_results:
            # Get rows from saved tables
            for table_info in result.get('saved_tables', []):
                if 'rows' in table_info:
                    try:
                        rows = int(table_info['rows'])
                        total_rows += rows
                    except (ValueError, TypeError):
                        self.logger.debug(f"[DEBUG] Invalid row count: {table_info.get('rows')}")
                
                if 'quality_score' in table_info:
                    try:
                        score = float(table_info['quality_score'])
                        all_quality_scores.append(score)
                    except (ValueError, TypeError):
                        self.logger.debug(f"[DEBUG] Invalid quality score: {table_info.get('quality_score')}")
                
                if 'method' in table_info:
                    method = str(table_info['method'])
                    method_performance[method] = method_performance.get(method, 0) + 1
                
                # Collect NLP insights
                if 'intelligent_label' in table_info:
                    nlp_insights['intelligent_labels'].append(table_info['intelligent_label'])
                
                if 'continuity_analysis' in table_info:
                    continuity = table_info['continuity_analysis']
                    if continuity.get('is_continuation'):
                        nlp_insights['continuity_detected'] += 1
                
                if 'nlp_analysis' in table_info:
                    nlp_data = table_info['nlp_analysis']
                    content_analysis = nlp_data.get('content_analysis', {})
                    common_entities = content_analysis.get('common_entities', {})
                    for entity_type, count in common_entities.items():
                        nlp_insights['entity_types'][entity_type] = nlp_insights['entity_types'].get(entity_type, 0) + count
        
        # Calculate quality metrics safely
        avg_quality = sum(all_quality_scores) / len(all_quality_scores) if all_quality_scores else 0.0
        best_method = max(method_performance.keys(), key=method_performance.get) if method_performance else 'none'
        
        # Method statistics
        method_stats = {}
        for result in final_results:
            for method in result.get('methods_used', []):
                method_stats[method] = method_stats.get(method, 0) + 1
        
        report = {
            'success': True,
            'pdf_name': pdf_name,
            'total_pages': total_pages,
            'pages_processed': successful_pages,
            'total_tables': total_tables,
            'total_rows': total_rows,
            'extraction_time': extraction_time,
            'output_directory': normalize_path(output_dir),
            'method_statistics': method_stats,
            'quality_metrics': {
                'average_score': avg_quality,
                'best_method': best_method,
                'method_performance': method_performance
            },
            'nlp_insights': nlp_insights,
            'structure_analysis': structure_analysis,
            'results': final_results
        }
        
        # Save report
        reports_dir = output_dir / "reports"
        reports_dir.mkdir(exist_ok=True)
        report_path = reports_dir / "extraction_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2, default=str)
        
        # Log summary
        self.logger.info(f"[INFO] Extraction Summary:")
        self.logger.info(f"  Pages: {successful_pages}/{total_pages}")
        self.logger.info(f"  Tables: {total_tables}")
        self.logger.info(f"  Rows: {total_rows}")
        self.logger.info(f"  Methods: {list(method_stats.keys())}")
        self.logger.info(f"  NLP Labels: {len(nlp_insights['intelligent_labels'])}")
        self.logger.info(f"  Continuities: {nlp_insights['continuity_detected']}")
        self.logger.info(f"  Time: {extraction_time:.1f}s")
        
        return report
    
    def _generate_search_index(self, final_results: List[Dict], output_dir: Path):
        """Generate searchable index for extracted tables"""
        search_index = {
            'tables': [],
            'pages': [],
            'entities': {},
            'labels': {},
            'continuities': []
        }
        
        for result in final_results:
            page_num = result.get('page_number', 0)
            
            # Page index
            page_info = {
                'page_number': page_num,
                'tables_count': len(result.get('saved_tables', [])),
                'methods_used': result.get('methods_used', []),
                'processing_status': result.get('processing_status', 'unknown')
            }
            search_index['pages'].append(page_info)
            
            # Table index
            for table_info in result.get('saved_tables', []):
                table_entry = {
                    'table_id': table_info.get('table_id', ''),
                    'page_number': page_num,
                    'method': table_info.get('method', ''),
                    'quality_score': table_info.get('quality_score', 0),
                    'rows': table_info.get('rows', 0),
                    'columns': table_info.get('columns', 0),
                    'intelligent_label': table_info.get('intelligent_label', ''),
                    'continuity_type': table_info.get('continuity_type', '')
                }
                search_index['tables'].append(table_entry)
                
                # Label index
                label = table_info.get('intelligent_label', '')
                if label:
                    if label not in search_index['labels']:
                        search_index['labels'][label] = []
                    search_index['labels'][label].append(table_entry['table_id'])
                
                # Continuity index
                if table_info.get('continuity_analysis', {}).get('is_continuation'):
                    search_index['continuities'].append({
                        'table_id': table_entry['table_id'],
                        'page_number': page_num,
                        'continuity_type': table_info.get('continuity_type', ''),
                        'related_tables': table_info.get('continuity_analysis', {}).get('related_tables', [])
                    })
                
                # Entity index
                if 'nlp_analysis' in table_info:
                    nlp_data = table_info['nlp_analysis']
                    content_analysis = nlp_data.get('content_analysis', {})
                    common_entities = content_analysis.get('common_entities', {})
                    
                    for entity_type, entities in common_entities.items():
                        if entity_type not in search_index['entities']:
                            search_index['entities'][entity_type] = []
                        search_index['entities'][entity_type].append({
                            'table_id': table_entry['table_id'],
                            'page_number': page_num,
                            'entity_count': entities if isinstance(entities, int) else len(entities)
                        })
        
        # Save search index
        search_index_dir = output_dir / "search_index"
        search_index_dir.mkdir(exist_ok=True)
        search_path = search_index_dir / "search_index.json"
        with open(search_path, 'w') as f:
            json.dump(search_index, f, indent=2, default=str)
        
        self.logger.info(f"[INFO] Search index generated with {len(search_index['tables'])} tables")
    
    def _save_extraction_log(self, output_dir: Path):
        """Save extraction log"""
        reports_dir = output_dir / "reports"
        reports_dir.mkdir(exist_ok=True)
        log_path = reports_dir / "extraction_log.json"
        with open(log_path, 'w') as f:
            json.dump(self.extraction_log, f, indent=2, default=str)
