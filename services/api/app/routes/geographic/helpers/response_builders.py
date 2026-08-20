"""
Geographic Response Builders - Build responses for geographic operations
"""

from typing import Dict, Any, List


class GeographicResponseBuilder:
    """Response builder for geographic operations"""

    @staticmethod
    def build_geo_levels_list(levels: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Build response for geographic levels list"""
        response = []
        
        for level in levels:
            level_data = {
                'id': level.get('id'),
                'geo_level_code': level.get('geo_level_code'),
                'level_name': level.get('level_name'),
                'level_order': level.get('level_order'),
                'description': level.get('description'),
                'is_active': level.get('is_active'),
                'created_at': level.get('created_at'),
                'updated_at': level.get('updated_at')
            }
            response.append(level_data)
        
        return response

    @staticmethod
    def build_geo_units_list(units: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Build response for geographic units list"""
        response = []
        
        for unit in units:
            unit_data = {
                'id': unit.get('id'),
                'geo_unit_code': unit.get('geo_unit_code'),
                'name': unit.get('name'),
                'geo_code': unit.get('geo_code'),
                'geo_level_id': unit.get('geo_level_id'),
                'geo_level_code': unit.get('geo_level_code'),
                'parent_geo_unit_id': unit.get('parent_geo_unit_id'),
                'parent_geo_code': unit.get('parent_geo_code'),
                'is_active': unit.get('is_active'),
                'created_at': unit.get('created_at'),
                'updated_at': unit.get('updated_at')
            }
            response.append(unit_data)
        
        return response

    @staticmethod
    def build_analytics_response(analytics_type: str, data: Any) -> Dict[str, Any]:
        """Build response for analytics queries"""
        if analytics_type == "summary":
            return {
                'total_count': data.get('total_count', 0),
                'min_hierarchy': data.get('min_hierarchy'),
                'max_hierarchy': data.get('max_hierarchy'),
                'avg_hierarchy': data.get('avg_hierarchy'),
                'distinct_levels': data.get('distinct_levels', 0),
                'distinct_parents': data.get('distinct_parents', 0),
                'distinct_versions': data.get('distinct_versions', 0)
            }
        
        return {'analytics_type': analytics_type, 'data': data}

    @staticmethod
    def build_hierarchy_tree(units: List[Dict[str, Any]], root_code: str) -> List[Dict[str, Any]]:
        """Build hierarchical tree structure from flat list"""
        # Create lookup dictionary
        unit_lookup = {unit['geo_unit_code']: unit for unit in units}
        
        # Find root unit
        root_unit = unit_lookup.get(root_code)
        if not root_unit:
            return []
        
        # Build tree recursively
        def build_children(parent_code: str) -> List[Dict[str, Any]]:
            children = []
            for unit in units:
                if unit.get('parent_geo_code') == parent_code:
                    child_data = {
                        'id': unit.get('id'),
                        'geo_unit_code': unit.get('geo_unit_code'),
                        'name': unit.get('name'),
                        'geo_code': unit.get('geo_code'),
                        'geo_level_code': unit.get('geo_level_code'),
                        'parent_geo_code': unit.get('parent_geo_code'),
                        'is_active': unit.get('is_active'),
                        'children': build_children(unit.get('geo_unit_code'))
                    }
                    children.append(child_data)
            return children
        
        # Build root with children
        root_tree = {
            'id': root_unit.get('id'),
            'geo_unit_code': root_unit.get('geo_unit_code'),
            'name': root_unit.get('name'),
            'geo_code': root_unit.get('geo_code'),
            'geo_level_code': root_unit.get('geo_level_code'),
            'parent_geo_code': root_unit.get('parent_geo_code'),
            'is_active': root_unit.get('is_active'),
            'children': build_children(root_code)
        }
        
        return [root_tree]

    @staticmethod
    def build_search_response(results: Dict[str, Any], query: Dict[str, Any]) -> Dict[str, Any]:
        """Build comprehensive search response"""
        response = {
            'query': query,
            'results': {},
            'total_count': 0,
            'analytics': None
        }
        
        # Add geo levels results
        if 'geo_levels' in results:
            response['results']['geo_levels'] = results['geo_levels']
            response['total_count'] += len(results['geo_levels'])
        
        # Add geo units results
        if 'geo_units' in results:
            response['results']['geo_units'] = results['geo_units']
            response['total_count'] += len(results['geo_units'])
        
        # Add analytics if present
        if 'analytics' in results:
            response['analytics'] = results['analytics']
        
        return response

    @staticmethod
    def build_error_response(error_message: str, error_code: str = "GEO_ERROR") -> Dict[str, Any]:
        """Build standardized error response"""
        return {
            'error': True,
            'error_code': error_code,
            'message': error_message,
            'timestamp': None  # Would add actual timestamp
        }

    @staticmethod
    def build_success_response(message: str, data: Any = None) -> Dict[str, Any]:
        """Build standardized success response"""
        return {
            'success': True,
            'message': message,
            'data': data,
            'timestamp': None  # Would add actual timestamp
        }
