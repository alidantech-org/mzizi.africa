"""
Utility Functions
Convenience functions and utilities for PDF extraction
"""

from typing import Dict, Any
from .extractor import EnhancedStreamingPDFExtractor


def extract_pdf_intelligent(pdf_path: str, output_dir: str = "_data/extraction", max_workers: int = 4) -> Dict[str, Any]:
    """Intelligent PDF extraction with content analysis and smart table detection"""
    extractor = EnhancedStreamingPDFExtractor(output_dir, max_workers)
    return extractor.extract_pdf_streaming(pdf_path)


def extract_pdf_enhanced(pdf_path: str, output_dir: str = "_data/extraction", max_workers: int = 4) -> Dict[str, Any]:
    """Legacy function name for backward compatibility"""
    return extract_pdf_intelligent(pdf_path, output_dir, max_workers)
