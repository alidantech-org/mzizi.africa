"""
1_core Package - Core scraping models
"""

from .source import Source
from .query import Query
from .query_run import QueryRun
from .query_result import QueryResult

__all__ = [
    "Source",
    "Query", 
    "QueryRun",
    "QueryResult",
]
