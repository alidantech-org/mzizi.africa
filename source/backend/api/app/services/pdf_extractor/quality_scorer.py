"""
Enhanced Table Quality Scorer
Professional table quality scoring with data integrity checks
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List


class EnhancedTableQualityScorer:
    """Enhanced table quality scoring with data integrity checks"""
    
    @staticmethod
    def score_dataframe(df: pd.DataFrame, page_content: Dict[str, Any]) -> Dict[str, Any]:
        """Score extracted table quality with comprehensive data integrity checks"""
        if df.empty:
            return {
                'total_score': 0,
                'row_count': 0,
                'col_count': 0,
                'completeness': 0,
                'consistency': 0,
                'structure': 0,
                'integrity': 0,
                'confidence': 'very_low',
                'issues': ['Empty dataframe'],
                'data_quality': 0
            }
        
        issues = []
        score = 0
        
        # Basic metrics
        row_count = len(df)
        col_count = len(df.columns)
        total_cells = row_count * col_count
        
        # 1. Completeness score (non-empty cells)
        non_empty_cells = total_cells - df.isna().sum().sum()
        completeness = (non_empty_cells / total_cells) if total_cells > 0 else 0
        score += completeness * 25
        
        # 2. Consistency score (similar data types in columns)
        consistency_scores = []
        for col in df.columns:
            non_null = df[col].dropna()
            if len(non_null) > 1:
                first_type = type(non_null.iloc[0])
                same_type = sum(1 for x in non_null if type(x) == first_type)
                consistency_scores.append(same_type / len(non_null))
        
        consistency = sum(consistency_scores) / len(consistency_scores) if consistency_scores else 0
        score += consistency * 20
        
        # 3. Structure score (headers, reasonable dimensions)
        structure_score = EnhancedTableQualityScorer._validate_table_structure(df)
        score += structure_score * 25
        
        # 4. Data integrity score
        integrity_score = EnhancedTableQualityScorer._check_data_integrity(df, issues)
        score += integrity_score * 20
        
        # 5. Content alignment score
        alignment_score = EnhancedTableQualityScorer._check_content_alignment(df, page_content)
        score += alignment_score * 10
        
        # Determine confidence level
        if score >= 80:
            confidence = 'high'
        elif score >= 60:
            confidence = 'medium'
        elif score >= 40:
            confidence = 'low'
        else:
            confidence = 'very_low'
        
        return {
            'total_score': round(score, 1),
            'row_count': row_count,
            'col_count': col_count,
            'completeness': round(completeness, 2),
            'consistency': round(consistency, 2),
            'structure': round(structure_score, 2),
            'integrity': round(integrity_score, 2),
            'alignment': round(alignment_score, 2),
            'confidence': confidence,
            'issues': issues,
            'data_quality': round(score / 100, 2)
        }
    
    @staticmethod
    def _check_data_integrity(df: pd.DataFrame, issues: List[str]) -> float:
        """Enhanced data integrity checks"""
        integrity_score = 1.0
        
        # Check for reasonable row lengths
        try:
            # Convert to string and check lengths safely
            str_df = df.astype(str)
            # Use apply with element-wise operation for pandas compatibility
            row_lengths = str_df.apply(lambda row: row.apply(lambda x: len(str(x)) if pd.notna(x) else 0), axis=1)
            avg_row_length = row_lengths.mean().mean()
            
            if avg_row_length < 3:
                integrity_score -= 0.4
                issues.append("Very short data rows")
            elif avg_row_length > 1000:
                integrity_score -= 0.2
                issues.append("Extremely long data rows")
        except Exception as e:
            integrity_score -= 0.3
            issues.append(f"Error calculating row lengths: {e}")
        
        # Check for header quality
        header_quality = EnhancedTableQualityScorer._check_header_quality(df)
        integrity_score *= header_quality
        if header_quality < 0.7:
            issues.append("Poor header quality")
        
        # Check for duplicate rows
        duplicate_rows = df.duplicated().sum()
        if duplicate_rows > len(df) * 0.5:  # More than 50% duplicates
            integrity_score -= 0.3
            issues.append("High number of duplicate rows")
        
        # Check for meaningful content (not just numbers or single characters)
        meaningful_content = 0
        for col in df.columns:
            try:
                col_data = df[col].dropna().astype(str)
                # Check string length safely
                avg_length = col_data.apply(len).mean()
                
                if avg_length > 2:  # Average length > 2
                    meaningful_content += 1
            except Exception as e:
                # Skip problematic column
                continue
        
        if meaningful_content < len(df.columns) * 0.5:
            integrity_score -= 0.2
            issues.append("Low meaningful content")
        
        return max(0.0, integrity_score)
    
    @staticmethod
    def _validate_table_structure(df: pd.DataFrame) -> float:
        """Validate table structure for logical data organization"""
        structure_score = 1.0
        
        # Check if first row looks like headers
        first_row = df.iloc[0].astype(str)
        header_indicators = sum(1 for val in first_row if len(str(val)) > 2 and not str(val).replace('.', '').replace(',', '').isdigit())
        
        if header_indicators < len(df.columns) * 0.3:
            structure_score -= 0.3
        
        # Check for consistent column patterns
        for col in df.columns:
            col_data = df[col].dropna()
            if len(col_data) > 1:
                # Check if column has consistent data patterns
                str_lengths = col_data.astype(str)
                if hasattr(str_lengths, 'str'):
                    str_lengths = str_lengths.str.len()
                else:
                    str_lengths = str_lengths.apply(len)
                
                if str_lengths.std() > str_lengths.mean() * 0.8:  # High variance in length
                    structure_score -= 0.1
        
        return max(0.0, structure_score)
    
    @staticmethod
    def _calculate_data_quality(df: pd.DataFrame) -> float:
        """Calculate overall data quality score"""
        quality_score = 1.0
        
        # Check for empty cells
        empty_ratio = df.isna().sum().sum() / (len(df) * len(df.columns))
        quality_score -= empty_ratio * 0.5
        
        # Check for data consistency
        for col in df.columns:
            col_data = df[col].dropna()
            if len(col_data) > 1:
                # Check if most values have reasonable length
                str_lengths = col_data.astype(str)
                if hasattr(str_lengths, 'str'):
                    str_lengths = str_lengths.str.len()
                else:
                    str_lengths = str_lengths.apply(len)
                
                if (str_lengths > 0).sum() < len(col_data) * 0.8:
                    quality_score -= 0.1
        
        # Bonus for good size (not too small, not too large)
        if 3 <= len(df.columns) <= 10 and 2 <= len(df) <= 100:
            quality_score += 0.1
        
        return max(0.0, min(1.0, quality_score))
    
    @staticmethod
    def _check_header_quality(df: pd.DataFrame) -> float:
        """Check if headers are meaningful"""
        if df.empty:
            return 0.0
        
        headers = df.columns.astype(str)
        quality_score = 1.0
        
        # Check for generic headers - safe data type handling
        generic_patterns = ['unnamed', 'column', 'level', '0', '1', '2']
        for header in headers:
            # Convert header to string safely
            if header is None:
                header_str = ''
            elif isinstance(header, (int, float)):
                header_str = str(header)
            else:
                header_str = str(header)
            
            if any(pattern in header_str.lower() for pattern in generic_patterns):
                quality_score -= 0.2
        
        # Check for empty headers - safe data type handling
        empty_headers = 0
        for h in headers:
            # Convert to string safely before checking strip
            if h is None:
                header_str = ''
            elif isinstance(h, (int, float)):
                header_str = str(h)
            else:
                header_str = str(h)
            
            if not header_str.strip():
                empty_headers += 1
        
        if empty_headers > 0:
            quality_score -= (empty_headers / len(headers)) * 0.5
        
        return max(0.0, quality_score)
    
    @staticmethod
    def _check_content_alignment(df: pd.DataFrame, page_content: Dict[str, Any]) -> float:
        """Check if extracted table aligns with page content analysis"""
        if not page_content or df.empty:
            return 0.5
        
        alignment_score = 0.5  # Base score
        
        # Bonus if page was identified as likely table
        content_type = page_content.get('content_type', '')
        if isinstance(content_type, str) and content_type == 'likely_table':
            alignment_score += 0.3
        
        # Bonus if data indicators match
        data_indicators = page_content.get('data_indicators', [])
        if isinstance(data_indicators, list):
            page_indicators = len(data_indicators)
            if page_indicators > 5:
                alignment_score += 0.2
        
        return min(1.0, alignment_score)
