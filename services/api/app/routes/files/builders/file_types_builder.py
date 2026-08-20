"""
File Types Builder - Replaces json/responses.py FileTypesBuilder functionality
"""

from typing import Dict, Any, List


class FileTypesBuilder:
    """Builds file type responses"""
    
    @staticmethod
    def build_file_types(file_type_stats: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Build file types response from statistics"""
        return [
            {
                "code": ft.get("file_type", "unknown"),
                "name": ft.get("file_type", "unknown").title(),
                "count": ft.get("count", 0),
                "description": f"{ft.get('file_type', 'unknown').title()} files"
            }
            for ft in file_type_stats
        ]
    
    @staticmethod
    def build_file_type_stats(stats: Dict[str, Any]) -> Dict[str, Any]:
        """Build comprehensive file type statistics"""
        return {
            "total_types": len(stats.get("types", [])),
            "types": stats.get("types", []),
            "summary": {
                "most_common": stats.get("types", [{}])[0].get("code") if stats.get("types") else None,
                "total_files": sum(ft.get("count", 0) for ft in stats.get("types", []))
            }
        }
