# Files API - Unified Search & Filtering

This module provides comprehensive file management capabilities with a unified search and filtering endpoint.

## 🚀 Features

### Unified File Search Endpoint

The files API provides a single powerful endpoint that handles all search and filtering scenarios:

#### **GET /** - Unified Search & Listing

A comprehensive endpoint that handles simple listing, legacy filtering, and advanced search all in one.

### Query Builder

A fluent query builder class for constructing complex search queries programmatically:

````python
from app.routes.files.helpers.query_builder import FileQueryBuilder

query = (FileQueryBuilder()
    .search_term("report", exact_match=False, case_sensitive=False)
    .file_types(["pdf", "docx"])
    .size_range(min_size=1000, max_size=10000000)
    .date_range(from_date=datetime(2024, 1, 1), to_date=datetime(2024, 12, 31))
    .sort("createdAt", "desc")
    .paginate(limit=50, offset=0)
    .build())

**Query Parameters:**
- `search` (str, optional): Search term for filename
- `search_mode` (SearchMode): Search mode - `contains`, `exact`, `starts_with`, `ends_with`
- `case_sensitive` (bool): Case sensitive search
- `file_type` (str, optional): Filter by single file type (legacy compatibility)
- `file_types` (List[str]): Filter by file types
- `folder_path` (str, optional): Filter by single folder path (legacy compatibility)
- `folder_paths` (List[str]): Filter by folder paths
- `content_types` (List[str]): Filter by content types
- `size_min` (int): Minimum file size in bytes
- `size_max` (int): Maximum file size in bytes
- `date_from` (datetime): Filter files created after this date
- `date_to` (datetime): Filter files created before this date
- `sort_field` (SortField): Field to sort by
- `sort_order` (SortOrder): Sort order - `asc` or `desc`
- `limit` (int): Maximum results to return (1-1000)
- `offset` (int): Number of results to skip
- `include_metadata` (bool): Include file metadata in response
- `include_urls` (bool): Include file URLs in response
- `include_stats` (bool): Include search statistics

**Usage Examples:**

**Simple listing:**
```bash
GET /?limit=50&offset=0
````

**Legacy filters:**

```bash
GET /?file_type=pdf&folder_path=documents/2024
```

**Advanced search:**

```bash
# Search for PDF files containing "report"
GET /?search=report&file_types=pdf&limit=50

# Large files sorted by size
GET /?size_min=1000000&size_max=10000000&sort_field=size&sort_order=desc

# Files from 2024 with statistics
GET /?date_from=2024-01-01&date_to=2024-12-31&include_stats=true

# Complex filtering
GET /?search=financial&file_types=pdf,xlsx&folder_paths=finance/2024&size_min=1000&sort_field=createdAt&sort_order=desc
```

### Response Format

The unified search endpoint returns a comprehensive response:

```json
{
    "files": [...],
    "total": 150,
    "limit": 50,
    "offset": 0,
    "has_more": true,
    "search_time_ms": 45.2,
    "filter_summary": "search: 'report' (partial, case-insensitive) | file types: pdf, docx | sort: createdAt desc | limit: 50, offset: 0",
    "file_type_counts": {"pdf": 80, "docx": 70},
    "folder_counts": {"documents/2024": 100, "reports/": 50},
    "size_stats": {"min": 1024, "max": 10485760, "avg": 5242880},
    "applied_filters": {...}
}
```

## 🔍 Search Features

### Text Search

- **Contains**: Partial match within filename
- **Exact**: Exact filename match
- **Case Sensitive**: Optional case-sensitive matching
- **Performance**: Optimized database queries with proper indexing

### Filtering Options

- **File Types**: Filter by detected file type (pdf, image, document, etc.)
- **Folder Paths**: Filter by storage folder paths
- **Content Types**: Filter by MIME content types
- **Size Range**: Filter by file size in bytes
- **Date Range**: Filter by creation/update dates
- **Metadata**: Filter by custom metadata key-value pairs

### Sorting Options

- **Filename**: Alphabetical sorting
- **Created At**: Sort by creation date
- **Updated At**: Sort by last update date
- **Size**: Sort by file size
- **File Type**: Sort by file type
- **Folder Path**: Sort by folder location

### Pagination

- **Limits**: Configurable limits (1-1000 results)
- **Offsets**: Skip results for pagination
- **Has More**: Boolean indicating if more results exist

### Statistics & Aggregations

- **File Type Counts**: Count of files by type
- **Folder Counts**: Count of files by folder
- **Size Statistics**: Min, max, average file sizes
- **Search Performance**: Search execution time

## 🛠️ Implementation Details

### Architecture

- **Controller**: HTTP request handling and validation
- **Service**: Business logic and query processing
- **Repository**: Database operations and SQL queries
- **Query Builder**: Fluent interface for query construction
- **Helpers**: Utility classes and functions

### Database Optimization

- **Indexed Fields**: Proper database indexing on searchable fields
- **Efficient Queries**: Optimized SQL with proper filtering
- **Pagination**: Database-level pagination for performance
- **Count Queries**: Separate count queries for total results

### Performance Features

- **Search Timing**: Track search execution time
- **Query Optimization**: Efficient database queries
- **Memory Management**: Proper result set handling
- **Caching**: Ready for future caching implementation

## 📝 Usage Examples

### Basic Search

```python
# Search for files containing "report"
response = await file_service.advanced_search({
    'filters': {
        'search': {
            'term': 'report',
            'exact_match': False,
            'case_sensitive': False
        }
    },
    'sort': {'field': 'createdAt', 'order': 'desc'},
    'pagination': {'limit': 25, 'offset': 0}
})
```

### Complex Filtering

```python
# Complex search with multiple filters
query = (FileQueryBuilder()
    .search_term("financial", exact_match=False)
    .file_types(["pdf", "xlsx", "csv"])
    .folder_paths(["finance/2024", "reports/"])
    .size_range(min_size=1000, max_size=50000000)
    .date_range(
        from_date=datetime(2024, 1, 1),
        to_date=datetime(2024, 12, 31)
    )
    .metadata_filter("department", "finance")
    .sort(SortField.SIZE, SortOrder.DESC)
    .paginate(limit=100, offset=0)
    .include_metadata(True)
    .build())

response = await file_service.advanced_search(query)
```

### API Usage

```bash
# Search via GET parameters
curl "http://localhost:8000/files/search?search=report&file_types=pdf&size_min=1000&sort_field=createdAt&sort_order=desc&limit=50"

# Search via POST body
curl -X POST "http://localhost:8000/files/search/advanced" \
  -H "Content-Type: application/json" \
  -d '{
    "search": "report",
    "file_types": ["pdf"],
    "size_min": 1000,
    "sort_field": "createdAt",
    "sort_order": "desc",
    "limit": 50
  }'
```

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL`: Database connection string
- `S3_BUCKET`: S3 bucket name
- `S3_REGION`: AWS region
- `MAX_SEARCH_LIMIT`: Maximum search results limit (default: 1000)

### Database Indexes

Recommended indexes for optimal performance:

```sql
CREATE INDEX idx_files_filename ON files(filename);
CREATE INDEX idx_files_file_type ON files(file_type);
CREATE INDEX idx_files_folder_path ON files(folder_path);
CREATE INDEX idx_files_created_at ON files(created_at);
CREATE INDEX idx_files_size_bytes ON files(size_bytes);
CREATE INDEX idx_files_content_type ON files(content_type);
```

## 🚀 Future Enhancements

### Planned Features

- **Full-Text Search**: Integration with PostgreSQL full-text search
- **Faceted Search**: Advanced faceted search capabilities
- **Search Suggestions**: Auto-complete and search suggestions
- **Search History**: User search history and saved searches
- **Bulk Operations**: Bulk file operations based on search results
- **Export**: Export search results to various formats

### Performance Improvements

- **Caching**: Redis caching for frequent searches
- **Async Processing**: Background processing for large searches
- **Elasticsearch**: Integration with Elasticsearch for advanced search
- **Query Optimization**: Advanced query optimization techniques

## 🐛 Troubleshooting

### Common Issues

1. **Slow Search**: Check database indexes and query complexity
2. **No Results**: Verify filter parameters and data existence
3. **Memory Issues**: Reduce limit or implement pagination
4. **Invalid Dates**: Ensure date format is ISO 8601 compliant

### Debug Mode

Enable debug logging for detailed search information:

```python
import logging
logging.getLogger('app.routes.files').setLevel(logging.DEBUG)
```

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Query Builder Pattern](https://martinfowler.com/eaaCatalog/queryObject.html)
