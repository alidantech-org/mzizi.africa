"""
Extraction Methods Module
Handles all PDF table extraction methods using different libraries
"""

import pandas as pd
from typing import List, Dict
import logging

# PDF extraction libraries
try:
    import camelot
    CAMELOT_AVAILABLE = True
except ImportError:
    CAMELOT_AVAILABLE = False

try:
    import tabula
    TABULA_AVAILABLE = True
    # Check Java environment for Tabula with better error handling
    try:
        import subprocess
        import os
        import sys
        
        # Try to initialize JVM with better error handling
        try:
            import jpype
            if not jpype.isJVMStarted():
                # Try to find Java automatically
                java_home = os.environ.get('JAVA_HOME')
                if java_home:
                    jvm_path = jpype.getDefaultJVMPath()
                    try:
                        jpype.startJVM(jvmpath=jvm_path, convertStrings=True)
                        JAVA_AVAILABLE = True
                    except Exception as jvm_error:
                        # If JVM start fails, try without specific path
                        try:
                            jpype.startJVM(convertStrings=True)
                            JAVA_AVAILABLE = True
                        except Exception:
                            JAVA_AVAILABLE = False
                            TABULA_AVAILABLE = False
                else:
                    # Try default JVM path
                    try:
                        jpype.startJVM(convertStrings=True)
                        JAVA_AVAILABLE = True
                    except Exception:
                        JAVA_AVAILABLE = False
                        # Don't disable Tabula yet - let it try subprocess fallback
            else:
                JAVA_AVAILABLE = True
                
        except ImportError:
            # JPype not available, but Tabula might still work with subprocess
            JAVA_AVAILABLE = False
            # Don't disable Tabula - let it try subprocess fallback
                
    except Exception as java_error:
        JAVA_AVAILABLE = False
        # Don't disable Tabula - let it try subprocess fallback
        
except ImportError:
    TABULA_AVAILABLE = False
    JAVA_AVAILABLE = False

try:
    import pdfplumber
    PDFPLUMBER_AVAILABLE = True
except ImportError:
    PDFPLUMBER_AVAILABLE = False


class ExtractionMethods:
    """Handles all PDF table extraction methods"""
    
    def __init__(self, temp_dir_manager):
        self.temp_dir_manager = temp_dir_manager
        self.logger = logging.getLogger(__name__)
    
    def extract_tables_with_all_methods(self, pdf_path: str, page_num: int) -> Dict[str, List[pd.DataFrame]]:
        """Extract tables using all available methods"""
        methods = {}
        
        # Log availability
        java_status = "✅" if JAVA_AVAILABLE else "❌"
        self.logger.info(f"[INFO] Available methods - Camelot: {CAMELOT_AVAILABLE}, Tabula: {TABULA_AVAILABLE} (Java: {java_status}), PDFPlumber: {PDFPLUMBER_AVAILABLE}")
        
        if CAMELOT_AVAILABLE:
            try:
                methods['camelot_lattice'] = self._extract_with_camelot(pdf_path, page_num, 'lattice')
                self.logger.info(f"[INFO] Camelot lattice found {len(methods['camelot_lattice'])} tables on page {page_num}")
            except Exception as e:
                self.logger.warning(f"[WARNING] Camelot lattice failed on page {page_num}: {e}")
                methods['camelot_lattice'] = []
            
            try:
                methods['camelot_stream'] = self._extract_with_camelot(pdf_path, page_num, 'stream')
                self.logger.info(f"[INFO] Camelot stream found {len(methods['camelot_stream'])} tables on page {page_num}")
            except Exception as e:
                self.logger.warning(f"[WARNING] Camelot stream failed on page {page_num}: {e}")
                methods['camelot_stream'] = []
        
        if TABULA_AVAILABLE:
            try:
                methods['tabula_lattice'] = self._extract_with_tabula(pdf_path, page_num, True)
                self.logger.info(f"[INFO] Tabula lattice found {len(methods['tabula_lattice'])} tables on page {page_num}")
            except Exception as e:
                self.logger.warning(f"[WARNING] Tabula lattice failed on page {page_num}: {e}")
                methods['tabula_lattice'] = []
            
            try:
                methods['tabula_stream'] = self._extract_with_tabula(pdf_path, page_num, False)
                self.logger.info(f"[INFO] Tabula stream found {len(methods['tabula_stream'])} tables on page {page_num}")
            except Exception as e:
                self.logger.warning(f"[WARNING] Tabula stream failed on page {page_num}: {e}")
                methods['tabula_stream'] = []
        
        if PDFPLUMBER_AVAILABLE:
            try:
                methods['pdfplumber'] = self._extract_with_pdfplumber(pdf_path, page_num)
                self.logger.info(f"[INFO] PDFPlumber found {len(methods['pdfplumber'])} tables on page {page_num}")
            except Exception as e:
                self.logger.warning(f"[WARNING] PDFPlumber failed on page {page_num}: {e}")
                methods['pdfplumber'] = []
        
        # Log summary
        total_found = sum(len(tables) for tables in methods.values())
        working_methods = [method for method, tables in methods.items() if tables]
        self.logger.info(f"[INFO] Page {page_num} - Total tables found: {total_found} across {len(working_methods)} methods: {working_methods}")
        
        return methods
    
    def _extract_with_camelot(self, pdf_path: str, page_num: int, flavor: str) -> List[pd.DataFrame]:
        """Extract tables using Camelot"""
        try:
            # Much more lenient parameters for better table detection
            kwargs = {
                'pages': str(page_num),
                'flavor': flavor,
                'flag_size': True,
                'suppress_stdout': True  # Reduce noise
            }
            
            if flavor == 'lattice':
                kwargs.update({
                    'line_scale': 15,  # Reduced from 40 for more sensitive detection
                    'copy_text': ['v', 'h'],
                    'split_text': True,
                    'joint_tol': 5  # Add joint tolerance
                    # Note: edge_tol not compatible with lattice flavor
                })
            else:  # stream
                kwargs.update({
                    'row_tol': 5,  # Reduced from 10
                    'edge_tol': 50,  # Reduced from 500
                    'column_tol': 5  # Add column tolerance
                })
            
            # Only add temp_dir if not using lattice/stream specific restrictions
            # Note: temp_dir has compatibility issues with some flavors
            
            ctables = camelot.read_pdf(pdf_path, **kwargs)
            
            tables = []
            for i, ct in enumerate(ctables):
                # Very lenient accuracy threshold
                if ct.accuracy > 10:  # Very low threshold to catch more tables
                    df = ct.df
                    if not df.empty and len(df) > 1:  # At least header + 1 row
                        # Clean the DataFrame
                        df = self._clean_camelot_dataframe(df)
                        tables.append(df)
                        self.logger.info(f"[INFO] Camelot {flavor} page {page_num}: Table {i+1} - Accuracy: {ct.accuracy:.1f}, Shape: {df.shape}")
                else:
                    self.logger.debug(f"[DEBUG] Camelot {flavor} page {page_num}: Table {i+1} - Low accuracy: {ct.accuracy:.1f}")
            
            return tables
            
        except Exception as e:
            self.logger.warning(f"[WARNING] Camelot {flavor} extraction failed for page {page_num}: {e}")
            return []
    
    def _clean_camelot_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean Camelot extracted DataFrame"""
        try:
            # Remove completely empty rows/columns
            df = df.dropna(how='all', axis=0)  # Remove empty rows
            df = df.dropna(how='all', axis=1)  # Remove empty columns
            
            # Reset column names if first row looks like headers
            if len(df) > 0:
                first_row = df.iloc[0].astype(str)
                if any(not str(cell).isdigit() for cell in first_row):
                    # First row looks like headers
                    df.columns = first_row
                    df = df.iloc[1:].reset_index(drop=True)
            
            return df
            
        except Exception as e:
            self.logger.debug(f"[DEBUG] Failed to clean Camelot DataFrame: {e}")
            return df
    
    def _extract_with_tabula(self, pdf_path: str, page_num: int, lattice: bool) -> List[pd.DataFrame]:
        """Extract tables using Tabula with robust error handling and encoding support"""
        try:
            # Enhanced Tabula parameters with encoding handling
            # Try multiple encoding approaches for better compatibility
            encoding_options = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            tables = []
            
            for encoding in encoding_options:
                try:
                    tables = tabula.read_pdf(
                        pdf_path,
                        pages=str(page_num),
                        lattice=lattice,
                        stream=not lattice,
                        multiple_tables=True,
                        pandas_options={'header': 0},
                        area=None,
                        columns=None,
                        guess=True,
                        silent=True,
                        encoding=encoding  # Try different encodings
                    )
                    
                    if tables:  # If we got tables with this encoding, break
                        break
                        
                except UnicodeDecodeError:
                    # Try next encoding
                    continue
                except Exception as e:
                    error_msg = str(e).lower()
                    if 'technology' in error_msg and 'module' in error_msg:
                        # This is the JPype subprocess fallback issue
                        self.logger.warning(f"[WARNING] Tabula subprocess fallback issue - trying without encoding")
                        # Try without encoding parameter
                        break
                    elif 'jvm' in error_msg or 'java' in error_msg:
                        # Java-related error, try next approach
                        continue
                    else:
                        # Other error, try default approach
                        break
            
            # If all encoding attempts failed, try without encoding parameter
            if not tables:
                try:
                    tables = tabula.read_pdf(
                        pdf_path,
                        pages=str(page_num),
                        lattice=lattice,
                        stream=not lattice,
                        multiple_tables=True,
                        pandas_options={'header': 0},
                        area=None,
                        columns=None,
                        guess=True,
                        silent=True
                        # No encoding parameter - let Tabula handle it
                    )
                except Exception as e:
                    error_msg = str(e).lower()
                    if 'technology' in error_msg and 'module' in error_msg:
                        # JPype subprocess fallback issue - disable Tabula
                        self.logger.warning(f"[WARNING] Tabula subprocess fallback failed - disabling Tabula")
                        self.logger.info(f"[INFO] This is due to a JPype dependency issue with the 'technology' module")
                        self.logger.info(f"[INFO] Tabula will be disabled for this session - using Camelot and PDFPlumber instead")
                        # Don't set global here - it will be set in the outer exception handler
                        return []
            
            if not tables:
                return []
            
            cleaned_tables = []
            for i, df in enumerate(tables):
                if not df.empty and len(df) > 1:
                    # Clean Tabula DataFrame and handle encoding issues
                    try:
                        df = self._clean_tabula_dataframe(df)
                        cleaned_tables.append(df)
                        self.logger.info(f"[INFO] Tabula {'lattice' if lattice else 'stream'} page {page_num}: Table {i+1} - Shape: {df.shape}")
                    except Exception as clean_error:
                        self.logger.warning(f"[WARNING] Failed to clean Tabula table {i+1} on page {page_num}: {clean_error}")
                        # Try to add the table anyway if it has data
                        if not df.empty and len(df) > 1:
                            cleaned_tables.append(df)
            
            return cleaned_tables
            
        except Exception as e:
            error_msg = str(e).lower()
            # Declare globals at the beginning of the exception handler
            global TABULA_AVAILABLE, JAVA_AVAILABLE
            
            if 'technology' in error_msg and 'module' in error_msg:
                # JPype subprocess fallback issue - disable Tabula
                self.logger.warning(f"[WARNING] Tabula subprocess fallback failed - disabling Tabula")
                self.logger.info(f"[INFO] JPype 'technology' module issue - Tabula will be disabled")
                TABULA_AVAILABLE = False
                return []
            elif 'utf-8' in error_msg and 'codec' in error_msg:
                self.logger.warning(f"[WARNING] Tabula {'lattice' if lattice else 'stream'} - Encoding issue on page {page_num}: {e}")
                self.logger.info(f"[INFO] Tabula encoding error - PDF may contain non-UTF-8 characters")
                self.logger.info(f"[INFO] This is common with scanned PDFs or PDFs with special characters")
            elif any(keyword in error_msg for keyword in ['jvm', 'java_home', 'noclassdeffounderror', 'could not initialize']):
                self.logger.warning(f"[WARNING] Tabula {'lattice' if lattice else 'stream'} - Java environment issue: {e}")
                self.logger.info(f"[INFO] Tabula Java issues detected - falling back to other extraction methods")
                self.logger.info(f"[INFO] To fix Tabula Java issues: 1) Ensure Java JDK is installed, 2) Set JAVA_HOME environment variable")
                # Disable Tabula for future calls to avoid repeated errors
                TABULA_AVAILABLE = False
                JAVA_AVAILABLE = False
            else:
                self.logger.warning(f"[WARNING] Tabula {'lattice' if lattice else 'stream'} extraction failed for page {page_num}: {e}")
            return []
    
    def _clean_tabula_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean Tabula extracted DataFrame with encoding support"""
        try:
            # Remove completely empty rows/columns
            df = df.dropna(how='all', axis=0)  # Remove empty rows
            df = df.dropna(how='all', axis=1)  # Remove empty columns
            
            # Handle encoding issues in string columns
            for col in df.columns:
                if df[col].dtype == 'object':
                    # Try to fix encoding issues in string columns
                    try:
                        # Convert to string and handle encoding issues
                        df[col] = df[col].astype(str)
                        
                        # Replace common encoding artifacts
                        replacements = {
                            '\x92': "'",  # Smart quote
                            '\x93': '"',  # Smart quote
                            '\x94': '"',  # Smart quote
                            '\x85': '...',  # Ellipsis
                            '\x96': '-',  # En dash
                            '\x97': '-',  # Em dash
                            '\x91': "'",  # Smart quote
                            '\x80': '€',  # Euro symbol
                        }
                        
                        for bad_char, good_char in replacements.items():
                            df[col] = df[col].str.replace(bad_char, good_char, regex=False)
                            
                    except Exception as encoding_error:
                        # If encoding fix fails, continue with original data
                        self.logger.debug(f"[DEBUG] Encoding fix failed for column {col}: {encoding_error}")
                        continue
            
            # Clean column names
            if len(df) > 0:
                df.columns = [str(col).strip().replace('\n', ' ') for col in df.columns]
            
            # Clean data cells
            df = df.apply(lambda row: row.apply(lambda x: str(x).strip() if pd.notna(x) else x), axis=1)
            
            return df
            
        except Exception as e:
            self.logger.debug(f"[DEBUG] Failed to clean Tabula DataFrame: {e}")
            return df
    
    def _extract_with_pdfplumber(self, pdf_path: str, page_num: int) -> List[pd.DataFrame]:
        """Extract tables using pdfplumber"""
        try:
            with pdfplumber.open(pdf_path) as pdf:
                page = pdf.pages[page_num - 1]
                
                # Try different table settings
                table_settings = [
                    {},  # Default settings
                    {"vertical_strategy": "text", "horizontal_strategy": "text"},
                    {"vertical_strategy": "lines", "horizontal_strategy": "lines"},
                    {"vertical_strategy": "text", "horizontal_strategy": "lines"},
                    {"vertical_strategy": "lines", "horizontal_strategy": "text"}
                ]
                
                all_tables = []
                for i, settings in enumerate(table_settings):
                    try:
                        tables = page.extract_tables(table_settings=settings)
                        self.logger.debug(f"[DEBUG] PDFPlumber page {page_num} settings {i+1}: Found {len(tables)} tables")
                        
                        for table in tables:
                            if table and len(table) > 1:  # At least header + 1 row
                                df = pd.DataFrame(table[1:], columns=table[0])
                                if not df.empty:
                                    # Clean pdfplumber DataFrame
                                    df = self._clean_pdfplumber_dataframe(df)
                                    all_tables.append(df)
                    
                    except Exception as e:
                        self.logger.debug(f"[DEBUG] PDFPlumber settings {i+1} failed for page {page_num}: {e}")
                
                # Remove duplicate tables (same shape and content)
                unique_tables = []
                for df in all_tables:
                    is_duplicate = False
                    for existing_df in unique_tables:
                        if df.shape == existing_df.shape and df.equals(existing_df):
                            is_duplicate = True
                            break
                    if not is_duplicate:
                        unique_tables.append(df)
                
                self.logger.debug(f"[DEBUG] PDFPlumber page {page_num}: Found {len(unique_tables)} unique tables")
                return unique_tables
                
        except Exception as e:
            self.logger.debug(f"[DEBUG] PDFPlumber extraction failed for page {page_num}: {e}")
            return []
    
    def _clean_pdfplumber_dataframe(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean pdfplumber extracted DataFrame"""
        try:
            # Remove completely empty rows/columns
            df = df.dropna(how='all', axis=0)  # Remove empty rows
            df = df.dropna(how='all', axis=1)  # Remove empty columns
            
            # Clean column names
            if len(df) > 0:
                df.columns = [str(col).strip().replace('\n', ' ') for col in df.columns]
            
            # Clean data cells
            df = df.apply(lambda row: row.apply(lambda x: str(x).strip() if pd.notna(x) else x), axis=1)
            
            return df
            
        except Exception as e:
            self.logger.debug(f"[DEBUG] Failed to clean pdfplumber DataFrame: {e}")
            return df
