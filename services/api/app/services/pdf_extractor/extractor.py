"""
Main Extractor Module
Modular PDF extractor with comprehensive analysis and table extraction
"""

import logging
from pathlib import Path
from typing import Dict, Any, List

import pandas as pd

from .main_extractor import MainPDFExtractor


class EnhancedStreamingPDFExtractor:
    """Enhanced PDF extractor using modular architecture"""
    
    def __init__(self, output_dir: str = "_data/extraction", max_workers: int = 4):
        self.output_dir = Path(output_dir)
        self.max_workers = max_workers
        self.logger = logging.getLogger(__name__)
        
        # Use the new modular main extractor
        self.main_extractor = MainPDFExtractor(output_dir, max_workers)
        
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
    
    def extract_pdf_streaming(self, pdf_path: str) -> Dict[str, Any]:
        """Extract PDF using the modular architecture"""
        return self.main_extractor.extract_pdf(pdf_path)
    
    # Backward compatibility methods
    def _get_page_count(self, pdf_path: Path) -> int:
        """Get page count (backward compatibility)"""
        return self.main_extractor._get_page_count(pdf_path)
    
    def _analyze_and_select_best_results(self, all_page_results: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze and select best results (backward compatibility)"""
        return self.main_extractor._compile_final_results(all_page_results)
    
    def _save_final_results(self, final_results: List[Dict[str, Any]], output_dir: Path):
        """Save final results (backward compatibility)"""
        # Tables are already saved by the modular system
        self.logger.info(f"[INFO] Final results already saved by modular system: {len(final_results)} tables")
    
    def _generate_extraction_report(self, pdf_name: str, final_results: List[Dict], total_pages: int, 
                                   extraction_time: float, output_dir: Path) -> Dict[str, Any]:
        """Generate extraction report (backward compatibility)"""
        return self.main_extractor._generate_report(pdf_name, final_results, total_pages, extraction_time, output_dir)
    
    def _save_extraction_log(self, output_dir: Path):
        """Save extraction log (backward compatibility)"""
        self.main_extractor._save_extraction_log(output_dir)
    
    def _save_page_metadata(self, page_result: Dict[str, Any], output_dir: Path):
        """Save page metadata (backward compatibility)"""
        # Page metadata is already saved by the modular system
        pass
    
    def _validate_table_integrity(self, df: pd.DataFrame, page_num: int, method: str) -> Dict[str, Any]:
        """Validate table integrity (backward compatibility)"""
        from .table_extraction_pipeline import TableExtractionPipeline
        from .temp_manager import TempDirectoryManager
        
        pipeline = TableExtractionPipeline(TempDirectoryManager())
        return pipeline.validate_table(df, page_num, method)
    
    def _process_page_intelligently(self, pdf_path: Path, page_num: int, output_dir: Path) -> Dict[str, Any]:
        """Process page intelligently (backward compatibility)"""
        from .page_processor import PageProcessor
        from .temp_manager import TempDirectoryManager
        
        processor = PageProcessor(TempDirectoryManager())
        return processor.process_page(str(pdf_path), page_num, output_dir)
    
    def _should_extract_tables(self, page_content: Dict[str, Any]) -> bool:
        """Determine if tables should be extracted (backward compatibility)"""
        # Always extract tables in the new modular system
        return True
    
    def _extract_tables_with_ocr(self, pdf_path: str, page_num: int, output_dir: Path) -> List[pd.DataFrame]:
        """Extract tables with OCR (backward compatibility)"""
        from .ocr_extractor import OCRTableExtractor
        
        ocr_extractor = OCRTableExtractor()
        return ocr_extractor.extract_tables_from_page(pdf_path, page_num, output_dir)
