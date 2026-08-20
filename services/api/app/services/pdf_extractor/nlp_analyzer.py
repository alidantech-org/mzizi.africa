"""
NLP Analysis Module for PDF Extractor
Advanced natural language processing for table analysis, labeling, and continuity detection
"""

import spacy
import re
from collections import defaultdict, Counter
from typing import Dict, Any, List, Tuple, Optional
import pandas as pd
import logging


class PDFNLPAnalyzer:
    """Advanced NLP analysis for PDF table extraction"""
    
    def __init__(self):
        self.nlp = None
        self.logger = logging.getLogger(__name__)
        self.load_model()
    
    def load_model(self):
        """Load spaCy NLP model"""
        try:
            self.nlp = spacy.load("en_core_web_sm")
            self.logger.info("NLP model loaded successfully")
            return True
        except OSError:
            self.logger.warning("spaCy model not found. Install with: python -m spacy download en_core_web_sm")
            self.nlp = None
            return False
    
    def is_available(self):
        """Check if NLP model is available"""
        return self.nlp is not None
    
    def analyze_table_context(self, table_data: pd.DataFrame, page_text: str = "", page_num: int = 1) -> Dict[str, Any]:
        """Analyze table context for intelligent labeling"""
        if not self.is_available() or table_data.empty:
            return {}
        
        analysis = {}
        
        try:
            # Analyze column headers
            column_analysis = self.analyze_column_headers(table_data)
            if column_analysis:
                analysis['column_analysis'] = column_analysis
            
            # Analyze table content
            content_analysis = self.analyze_table_content(table_data)
            if content_analysis:
                analysis['content_analysis'] = content_analysis
            
            # Extract table labels from surrounding text
            if page_text:
                context_analysis = self.extract_table_context(page_text, page_num)
                if context_analysis:
                    analysis['context_analysis'] = context_analysis
            
            # Generate intelligent table label
            intelligent_label = self.generate_table_label(analysis, page_num)
            if intelligent_label:
                analysis['intelligent_label'] = intelligent_label
            
            # Detect figure/table numbering patterns
            numbering = self.detect_numbering_patterns(page_text, table_data)
            if numbering:
                analysis['numbering_patterns'] = numbering
            
        except Exception as e:
            self.logger.error(f"NLP analysis error: {e}")
        
        return analysis
    
    def analyze_column_headers(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze column headers to understand data types and entities"""
        if df.empty:
            return {}
        
        column_types = {}
        entity_types = defaultdict(list)
        
        for col in df.columns:
            col_text = str(col).strip()
            if not col_text or col_text.lower() in ['unnamed', 'nan']:
                continue
            
            doc = self.nlp(col_text)
            
            # Extract entities
            entities = [(ent.text, ent.label_) for ent in doc.ents]
            if entities:
                for ent_text, ent_label in entities:
                    entity_types[ent_label].append(ent_text)
            
            # Predict column type
            predicted_type = self.predict_column_type(col_text, df[col])
            
            column_types[col] = {
                'entities': entities,
                'predicted_type': predicted_type,
                'clean_name': self.clean_column_name(col_text)
            }
        
        return {
            'column_types': column_types,
            'entity_summary': dict(entity_types),
            'data_categories': self.categorize_columns(column_types)
        }
    
    def analyze_table_content(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Analyze table content for entities, patterns, and themes"""
        if df.empty:
            return {}
        
        nlp_insights = {}
        
        try:
            # Sample data for analysis (avoid processing huge datasets)
            sample_text = self.extract_sample_text(df)
            if sample_text:
                doc = self.nlp(sample_text)
                
                # Extract entities with frequency
                entity_counts = defaultdict(int)
                for ent in doc.ents:
                    if len(ent.text.strip()) > 2:  # Filter short entities
                        entity_counts[ent.label_] += 1
                
                if entity_counts:
                    nlp_insights['common_entities'] = dict(entity_counts)
                
                # Extract key phrases and concepts
                key_phrases = self.extract_key_phrases(doc)
                if key_phrases:
                    nlp_insights['key_phrases'] = key_phrases
                
                # Detect data patterns
                patterns = self.detect_data_patterns(df)
                if patterns:
                    nlp_insights['data_patterns'] = patterns
            
            # Analyze data quality
            quality_metrics = self.assess_data_quality(df)
            nlp_insights['quality_metrics'] = quality_metrics
            
        except Exception as e:
            self.logger.error(f"Content analysis error: {e}")
        
        return nlp_insights
    
    def extract_table_context(self, page_text: str, page_num: int) -> Dict[str, Any]:
        """Extract table context from surrounding text"""
        if not page_text or not self.is_available():
            return {}
        
        context = {}
        
        try:
            doc = self.nlp(page_text)
            
            # Look for table-related sentences
            table_sentences = []
            for sent in doc.sents:
                if any(token.text.lower() in ['table', 'figure', 'chart', 'data'] for token in sent):
                    table_sentences.append(sent.text.strip())
            
            if table_sentences:
                context['table_sentences'] = table_sentences
            
            # Extract potential table titles
            titles = self.extract_table_titles(page_text)
            if titles:
                context['potential_titles'] = titles
            
            # Find section headers near table content
            section_headers = self.extract_section_headers(page_text)
            if section_headers:
                context['section_headers'] = section_headers
            
            # Enhanced: Extract key themes and topics from page text
            themes = self.extract_page_themes(doc)
            if themes:
                context['page_themes'] = themes
            
            # Enhanced: Extract table purpose and meaning
            purpose = self.infer_table_purpose(page_text, doc)
            if purpose:
                context['table_purpose'] = purpose
            
            # Enhanced: Generate contextual description
            description = self.generate_table_description(page_text, doc, context)
            if description:
                context['table_description'] = description
            
        except Exception as e:
            self.logger.error(f"Context extraction error: {e}")
        
        return context
    
    def detect_table_continuity(self, current_table: pd.DataFrame, previous_tables: List[Dict[str, Any]], 
                              page_text: str = "") -> Dict[str, Any]:
        """Detect if current table continues from previous pages"""
        continuity_analysis = {
            'is_continuation': False,
            'continuity_score': 0.0,
            'related_tables': [],
            'continuation_type': None
        }
        
        if not previous_tables:
            return continuity_analysis
        
        try:
            # Compare column structures
            for prev_table in previous_tables[-3:]:  # Check last 3 tables
                prev_data = prev_table.get('data', pd.DataFrame())
                if prev_data.empty:
                    continue
                
                # Column similarity
                column_similarity = self.calculate_column_similarity(current_table, prev_data)
                
                # Data continuity patterns
                data_continuity = self.detect_data_continuity(current_table, prev_data)
                
                # Text context continuity
                context_continuity = self.detect_context_continuity(page_text, prev_table)
                
                # Calculate overall continuity score
                total_score = (column_similarity * 0.4 + 
                             data_continuity * 0.4 + 
                             context_continuity * 0.2)
                
                if total_score > 0.7:  # High threshold for continuity
                    continuity_analysis['is_continuation'] = True
                    continuity_analysis['continuity_score'] = total_score
                    continuity_analysis['related_tables'].append({
                        'table_id': prev_table.get('table_id', 'unknown'),
                        'page': prev_table.get('page_number', 'unknown'),
                        'similarity_score': total_score
                    })
                    
                    if total_score > 0.9:
                        continuity_analysis['continuation_type'] = 'direct_continuation'
                    else:
                        continuity_analysis['continuation_type'] = 'related_table'
        
        except Exception as e:
            self.logger.error(f"Continuity detection error: {e}")
        
        return continuity_analysis
    
    def detect_table_of_contents(self, pdf_text: str) -> Dict[str, Any]:
        """Detect and parse table of contents to identify table locations"""
        toc_analysis = {
            'has_toc': False,
            'toc_entries': [],
            'table_pages': []
        }
        
        if not pdf_text:
            return toc_analysis
        
        try:
            # Look for TOC patterns
            toc_patterns = [
                r'(?:table|figure|chart)\s+(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(\d+)',
                r'(\d+(?:\.\d+)*)\.*\s*(.+?)\s+(\d+)',
                r'contents?\s+(.+?)\s+(\d+)',
            ]
            
            toc_found = False
            for pattern in toc_patterns:
                matches = re.finditer(pattern, pdf_text, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    toc_found = True
                    if len(match.groups()) >= 3:
                        number = match.group(1)
                        title = match.group(2).strip()
                        page = match.group(3)
                        
                        toc_analysis['toc_entries'].append({
                            'number': number,
                            'title': title,
                            'page': int(page) if page.isdigit() else None,
                            'type': self.classify_toc_entry(title)
                        })
                        
                        # If it looks like a table entry
                        if any(keyword in title.lower() for keyword in ['table', 'figure', 'chart']):
                            toc_analysis['table_pages'].append({
                                'title': title,
                                'page': int(page) if page.isdigit() else None,
                                'number': number
                            })
            
            toc_analysis['has_toc'] = toc_found
            
        except Exception as e:
            self.logger.error(f"TOC detection error: {e}")
        
        return toc_analysis
    
    def generate_table_label(self, analysis: Dict[str, Any], page_num: int) -> str:
        """Generate intelligent table label based on NLP analysis"""
        label_parts = []
        
        # Add page context
        label_parts.append(f"Page_{page_num}")
        
        # Enhanced: Use context analysis for better labeling
        context_analysis = analysis.get('context_analysis', {})
        
        # Use table purpose for better naming
        if context_analysis.get('table_purpose'):
            purpose = context_analysis['table_purpose']
            purpose_labels = {
                'comparison': 'Comparison',
                'summary': 'Summary',
                'breakdown': 'Breakdown',
                'trend': 'Trends',
                'ranking': 'Ranking',
                'schedule': 'Schedule',
                'financial': 'Financial',
                'demographic': 'Demographics',
                'performance': 'Performance',
                'contact': 'Contacts',
                'data_presentation': 'Data'
            }
            if purpose in purpose_labels:
                label_parts.append(purpose_labels[purpose])
        
        # Use page themes for more specific naming
        if context_analysis.get('page_themes'):
            themes = context_analysis['page_themes'][:2]  # Use top 2 themes
            for theme in themes:
                # Clean theme name for label
                clean_theme = theme.replace(' ', '_').replace('-', '_').replace(',', '').replace('.', '')
                if len(clean_theme) > 15:  # Truncate long themes
                    clean_theme = clean_theme[:15]
                if clean_theme and clean_theme not in label_parts:
                    label_parts.append(clean_theme.title())
        
        # Add numbering if detected
        numbering = analysis.get('numbering_patterns', {})
        if numbering.get('table_number'):
            label_parts.append(f"Table_{numbering['table_number']}")
        elif numbering.get('figure_number'):
            label_parts.append(f"Figure_{numbering['figure_number']}")
        
        # Use potential titles for naming
        if context_analysis.get('potential_titles'):
            title = context_analysis['potential_titles'][0]
            # Clean title for label
            clean_title = title.replace(' ', '_').replace('-', '_').replace(',', '').replace('.', '')
            clean_title = ''.join(c for c in clean_title if c.isalnum() or c == '_')
            if len(clean_title) > 20:  # Truncate long titles
                clean_title = clean_title[:20]
            if clean_title and clean_title not in label_parts:
                label_parts.append(clean_title.title())
        
        # Add intelligent category based on content
        content_analysis = analysis.get('content_analysis', {})
        common_entities = content_analysis.get('common_entities', {})
        
        if common_entities:
            # Determine main theme
            main_entity = max(common_entities, key=common_entities.get)
            category_map = {
                'GPE': 'Geographic',
                'ORG': 'Organization',
                'PERSON': 'People',
                'MONEY': 'Financial',
                'DATE': 'Temporal',
                'CARDINAL': 'Numeric',
                'LOC': 'Location'
            }
            
            if main_entity in category_map:
                entity_label = category_map[main_entity]
                if entity_label not in label_parts:
                    label_parts.append(entity_label)
        
        # Add column-based category
        column_analysis = analysis.get('column_analysis', {})
        if column_analysis:
            categories = column_analysis.get('data_categories', {})
            if categories:
                main_category = max(categories, key=categories.get)
                if main_category.title() not in label_parts:
                    label_parts.append(main_category.title())
        
        # Fall back to generic label if still too generic
        if len(label_parts) <= 1 or (len(label_parts) == 2 and label_parts[0] == f"Page_{page_num}"):
            label_parts.append("DataTable")
        
        # Limit label length and join
        final_label = "_".join(label_parts[:4])  # Limit to 4 parts
        if len(final_label) > 50:  # Limit total length
            final_label = final_label[:50]
        
        return final_label
    
    def detect_numbering_patterns(self, page_text: str, table_data: pd.DataFrame) -> Dict[str, Any]:
        """Detect figure/table numbering patterns like 1.0, 1.1, etc."""
        patterns = {}
        
        if page_text:
            # Look for table/figure numbers
            table_patterns = [
                r'table\s+(\d+(?:\.\d+)*)',
                r'fig(?:ure)?\s+(\d+(?:\.\d+)*)',
                r'chart\s+(\d+(?:\.\d+)*)',
                r'(\d+\.\d+)\s*(?:table|figure|chart)',
            ]
            
            for pattern in table_patterns:
                matches = re.findall(pattern, page_text, re.IGNORECASE)
                if matches:
                    if 'table' in pattern:
                        patterns['table_number'] = matches[0]
                    elif 'fig' in pattern:
                        patterns['figure_number'] = matches[0]
                    else:
                        patterns['chart_number'] = matches[0]
        
        return patterns
    
    # Helper methods
    def predict_column_type(self, column_name: str, column_data: pd.Series) -> str:
        """Predict column type based on name and data"""
        name_lower = column_name.lower()
        sample_data = column_data.dropna().head(5)
        
        patterns = {
            'temporal': ['date', 'time', 'year', 'month', 'day', 'period'],
            'numeric': ['population', 'count', 'number', 'total', 'amount', 'quantity', 'value'],
            'geographic': ['name', 'county', 'city', 'region', 'location', 'area', 'district'],
            'political': ['party', 'political', 'government', 'election', 'vote', 'candidate'],
            'identifier': ['code', 'id', 'reference', 'number', 'ref'],
            'demographic': ['age', 'gender', 'sex', 'population', 'people'],
            'economic': ['gdp', 'income', 'salary', 'revenue', 'budget', 'cost', 'price'],
            'percentage': ['percent', 'rate', 'ratio', 'percentage', '%']
        }
        
        for data_type, keywords in patterns.items():
            if any(keyword in name_lower for keyword in keywords):
                return data_type
        
        return 'text'
    
    def clean_column_name(self, name: str) -> str:
        """Clean column name for better readability"""
        # Remove common artifacts
        cleaned = re.sub(r'[_\-\s]+', ' ', name)
        cleaned = re.sub(r'\d+$', '', cleaned)  # Remove trailing numbers
        cleaned = cleaned.strip().title()
        return cleaned
    
    def categorize_columns(self, column_types: Dict[str, Any]) -> Dict[str, int]:
        """Categorize columns by type"""
        categories = Counter()
        
        for col_info in column_types.values():
            category = col_info.get('predicted_type', 'text')
            categories[category] += 1
        
        return dict(categories)
    
    def extract_sample_text(self, df: pd.DataFrame, max_chars: int = 1000) -> str:
        """Extract sample text from DataFrame for NLP analysis"""
        try:
            # Get first few rows and columns
            sample_df = df.head(3).iloc[:, :5]
            text = sample_df.to_string()
            return text[:max_chars]
        except:
            return ""
    
    def extract_key_phrases(self, doc) -> List[str]:
        """Extract key phrases from spaCy doc"""
        phrases = []
        
        # Extract noun chunks
        for chunk in doc.noun_chunks:
            if len(chunk.text.split()) <= 4:  # Keep phrases short
                phrases.append(chunk.text.strip())
        
        return list(set(phrases))[:10]  # Return top 10 unique phrases
    
    def detect_data_patterns(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Detect patterns in the data"""
        patterns = {}
        
        try:
            # Check for percentage columns
            percent_cols = []
            for col in df.columns:
                sample = df[col].dropna().head(5)
                if any('%' in str(val) or val == 100 for val in sample):
                    percent_cols.append(col)
            
            if percent_cols:
                patterns['percentage_columns'] = percent_cols
            
            # Check for date patterns
            date_cols = []
            for col in df.columns:
                sample = df[col].dropna().head(5)
                if any(re.match(r'\d{4}[-/]\d{1,2}[-/]\d{1,2}', str(val)) for val in sample):
                    date_cols.append(col)
            
            if date_cols:
                patterns['date_columns'] = date_cols
        
        except Exception as e:
            self.logger.error(f"Pattern detection error: {e}")
        
        return patterns
    
    def assess_data_quality(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Assess data quality metrics"""
        return {
            'total_rows': int(len(df)),
            'total_columns': int(len(df.columns)),
            'empty_cells': int(df.isnull().sum().sum()),
            'duplicate_rows': int(df.duplicated().sum()),
            'completeness_ratio': round((1 - df.isnull().sum().sum() / (len(df) * len(df.columns))) * 100, 2)
        }
    
    def extract_table_titles(self, text: str) -> List[str]:
        """Extract potential table titles from text"""
        titles = []
        
        # Look for title patterns
        title_patterns = [
            r'(?:table|figure|chart)\s+\d+[.:]\s*([^\n]+)',
            r'^([A-Z][^.]*\b(?:table|figure|chart)\b[^.\n]*)',
            r'^([A-Z][^.]*\bdata\b[^.\n]*)',
        ]
        
        for pattern in title_patterns:
            matches = re.findall(pattern, text, re.MULTILINE | re.IGNORECASE)
            titles.extend([match.strip() for match in matches])
        
        return titles[:5]  # Return top 5
    
    def extract_section_headers(self, text: str) -> List[str]:
        """Extract section headers that might indicate table context"""
        headers = []
        
        # Look for section patterns
        header_patterns = [
            r'^\d+\.\s*([^\n]+)',  # Numbered sections
            r'^[A-Z][^.]*$',       # All caps headers
            r'^[A-Z][a-z]+[^:]*:',  # Title case with colon
        ]
        
        for pattern in header_patterns:
            matches = re.findall(pattern, text, re.MULTILINE)
            headers.extend([match.strip() for match in matches])
        
        return headers[:5]
    
    def calculate_column_similarity(self, df1: pd.DataFrame, df2: pd.DataFrame) -> float:
        """Calculate similarity between column structures"""
        if df1.empty or df2.empty:
            return 0.0
        
        cols1 = set(str(col).strip().lower() for col in df1.columns)
        cols2 = set(str(col).strip().lower() for col in df2.columns)
        
        if not cols1 or not cols2:
            return 0.0
        
        intersection = cols1.intersection(cols2)
        union = cols1.union(cols2)
        
        return len(intersection) / len(union) if union else 0.0
    
    def detect_data_continuity(self, df1: pd.DataFrame, df2: pd.DataFrame) -> float:
        """Detect if data continues between tables"""
        if df1.empty or df2.empty:
            return 0.0
        
        try:
            # Check if row numbers suggest continuation
            # (e.g., first table ends at row 50, second starts at row 51)
            if len(df1) > 0 and len(df2) > 0:
                # Simple heuristic: if columns are similar and data looks sequential
                col_sim = self.calculate_column_similarity(df1, df2)
                return col_sim * 0.8  # Weight by column similarity
        except:
            pass
        
        return 0.0
    
    def detect_context_continuity(self, page_text: str, previous_table: Dict[str, Any]) -> float:
        """Detect contextual continuity between pages"""
        if not page_text:
            return 0.0
        
        # Look for continuation indicators
        continuation_indicators = [
            'continued', 'cont.', 'continued from',
            'continued on', 'see next', 'see previous'
        ]
        
        text_lower = page_text.lower()
        continuation_score = 0.0
        
        for indicator in continuation_indicators:
            if indicator in text_lower:
                continuation_score += 0.3
        
        return min(continuation_score, 1.0)
    
    def classify_toc_entry(self, title: str) -> str:
        """Classify TOC entry type"""
        title_lower = title.lower()
        
        if any(keyword in title_lower for keyword in ['table', 'tab']):
            return 'table'
        elif any(keyword in title_lower for keyword in ['figure', 'fig', 'chart']):
            return 'figure'
        elif any(keyword in title_lower for keyword in ['appendix', 'app']):
            return 'appendix'
        else:
            return 'section'
    
    def extract_page_themes(self, doc) -> List[str]:
        """Extract key themes and topics from page text"""
        if not doc:
            return []
        
        themes = []
        
        try:
            # Extract key nouns and noun phrases
            noun_chunks = [chunk.text for chunk in doc.noun_chunks if len(chunk.text) > 3]
            
            # Count frequency of noun chunks
            noun_freq = {}
            for chunk in noun_chunks:
                chunk_lower = chunk.lower()
                if chunk_lower not in ['table', 'data', 'figure', 'page', 'section']:
                    noun_freq[chunk_lower] = noun_freq.get(chunk_lower, 0) + 1
            
            # Get top themes
            if noun_freq:
                sorted_themes = sorted(noun_freq.items(), key=lambda x: x[1], reverse=True)
                themes = [theme for theme, count in sorted_themes[:5]]
            
            # Extract named entities as themes
            entities = {}
            for ent in doc.ents:
                if ent.label_ in ['ORG', 'GPE', 'PERSON', 'EVENT', 'PRODUCT']:
                    entity_text = ent.text.strip()
                    if len(entity_text) > 2:
                        entities[entity_text] = entities.get(entity_text, 0) + 1
            
            if entities:
                sorted_entities = sorted(entities.items(), key=lambda x: x[1], reverse=True)
                themes.extend([entity for entity, count in sorted_entities[:3]])
            
        except Exception as e:
            self.logger.error(f"Theme extraction error: {e}")
        
        return themes[:5]  # Return top 5 themes
    
    def infer_table_purpose(self, page_text: str, doc) -> str:
        """Infer the purpose and meaning of the table from context"""
        if not page_text or not doc:
            return ""
        
        purpose_indicators = {
            'comparison': ['compare', 'comparison', 'versus', 'vs', 'against', 'difference'],
            'summary': ['summary', 'total', 'overall', 'aggregate', 'sum', 'summary'],
            'breakdown': ['breakdown', 'distribution', 'composition', 'breakdown'],
            'trend': ['trend', 'change', 'growth', 'decline', 'increase', 'decrease'],
            'ranking': ['ranking', 'rank', 'top', 'bottom', 'highest', 'lowest'],
            'schedule': ['schedule', 'timeline', 'date', 'time', 'period', 'deadline'],
            'financial': ['budget', 'cost', 'revenue', 'expense', 'financial', 'amount'],
            'demographic': ['population', 'age', 'gender', 'demographic', 'statistics'],
            'performance': ['performance', 'metrics', 'kpi', 'measure', 'indicator'],
            'contact': ['contact', 'address', 'phone', 'email', 'information']
        }
        
        text_lower = page_text.lower()
        purpose_scores = {}
        
        for purpose, indicators in purpose_indicators.items():
            score = sum(1 for indicator in indicators if indicator in text_lower)
            if score > 0:
                purpose_scores[purpose] = score
        
        if purpose_scores:
            # Return the purpose with highest score
            best_purpose = max(purpose_scores, key=purpose_scores.get)
            return best_purpose
        
        return "data_presentation"
    
    def generate_table_description(self, page_text: str, doc, context: Dict[str, Any]) -> str:
        """Generate a meaningful description of the table based on context"""
        if not page_text or not doc:
            return "Data table"
        
        description_parts = []
        
        try:
            # Use section headers if available
            if context.get('section_headers'):
                description_parts.append(f"Table in {context['section_headers'][0]} section")
            
            # Use table purpose
            if context.get('table_purpose'):
                purpose = context['table_purpose']
                if purpose == 'comparison':
                    description_parts.append("comparing different items")
                elif purpose == 'summary':
                    description_parts.append("providing summary information")
                elif purpose == 'breakdown':
                    description_parts.append("showing detailed breakdown")
                elif purpose == 'trend':
                    description_parts.append("displaying trends over time")
                elif purpose == 'ranking':
                    description_parts.append("ranking items by criteria")
                elif purpose == 'schedule':
                    description_parts.append("showing schedule or timeline")
                elif purpose == 'financial':
                    description_parts.append("presenting financial information")
                elif purpose == 'demographic':
                    description_parts.append("showing demographic data")
                elif purpose == 'performance':
                    description_parts.append("displaying performance metrics")
                elif purpose == 'contact':
                    description_parts.append("providing contact information")
            
            # Use themes if available
            if context.get('page_themes'):
                themes = context['page_themes'][:2]  # Use top 2 themes
                if len(themes) == 1:
                    description_parts.append(f"related to {themes[0]}")
                elif len(themes) == 2:
                    description_parts.append(f"related to {themes[0]} and {themes[1]}")
            
            # Use potential titles
            if context.get('potential_titles'):
                title = context['potential_titles'][0]
                description_parts.append(f"titled '{title}'")
            
            # Combine into description
            if description_parts:
                description = " ".join(description_parts)
                # Capitalize first letter
                description = description[0].upper() + description[1:] if description else description
                return description
            else:
                return "Data table"
                
        except Exception as e:
            self.logger.error(f"Description generation error: {e}")
            return "Data table"
