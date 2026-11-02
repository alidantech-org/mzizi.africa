"""
Files Controller - File management and retrieval endpoints
"""

from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    Form,
    Query,
)
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from datetime import datetime
from uuid import UUID

from app.config.database import get_db
from .files_service import FileService
from .files_interface import FileInterface
from .models.dto.search import SearchMode


def parse_comma_separated_list(value: Optional[str]) -> Optional[List[str]]:
    """Parse comma-separated query parameter into list"""
    if not value:
        return None
    return [item.strip() for item in value.split(",") if item.strip()]


from app.routes.files.models.dto.file import FileResponse
from app.routes.files.models.dto.search import FileSearchResponse
from app.routes.files.models.dto.upload import FileUploadResponse
from .helpers.api_query_builder import FileQueryBuilder

router = APIRouter()

# Initialize background worker for folder statistics updates
try:
    from .helpers.utils.background_tasks import start_background_worker

    start_background_worker()
    print("Background task worker started for folder statistics updates")
except ImportError:
    print(
        "Background tasks module not available, folder statistics will be updated synchronously"
    )
except Exception as e:
    print(f"Failed to start background worker: {e}")


def get_file_service(db: Session = Depends(get_db)) -> FileInterface:
    """Dependency to get file service"""
    return FileService(db)


@router.get("/", summary="Search and list files", response_model=FileSearchResponse)
async def list_files(
    # Search parameters
    search: Optional[str] = FileInterface.SEARCH_TERM,
    search_mode=FileInterface.SEARCH_MODE,
    case_sensitive: bool = FileInterface.CASE_SENSITIVE,
    # Filter parameters
    file_type_codes: Optional[str] = Query(
        None, description="Comma-separated list of file type codes"
    ),
    directory_ids: Optional[str] = Query(
        None, description="Comma-separated list of directory UUIDs"
    ),
    content_types: Optional[str] = Query(
        None, description="Comma-separated list of content types"
    ),
    folder: Optional[str] = Query(
        None,
        description="Filter by folder path using S3 key pattern (e.g., input/uploads)",
    ),
    category: Optional[str] = Query(
        None,
        description="Filter by file type category (e.g., document, image, audio, video, archive, data)",
    ),
    # Size filters
    size_min: Optional[int] = FileInterface.SIZE_MIN,
    size_max: Optional[int] = FileInterface.SIZE_MAX,
    # Date filters
    date_from: Optional[datetime] = FileInterface.DATE_FROM,
    date_to: Optional[datetime] = FileInterface.DATE_TO,
    # Sorting
    sort_field=FileInterface.SORT_FIELD,
    sort_order=FileInterface.SORT_ORDER,
    # Pagination
    limit: int = FileInterface.LIMIT,
    offset: int = FileInterface.OFFSET,
    # Response options
    include_metadata: bool = FileInterface.INCLUDE_METADATA,
    include_urls: bool = FileInterface.INCLUDE_URLS,
    include_stats: bool = FileInterface.INCLUDE_STATS,
    file_service: FileInterface = Depends(get_file_service),
):
    """
    Comprehensive file search and listing endpoint

    **Features:**
    - Simple listing (no parameters): List all files with pagination
    - Advanced search: Text search with multiple modes and filters
    - Comprehensive filtering: File type codes, directory UUIDs, content types, size ranges, date ranges, folder paths
    - Multiple sorting options: By filename, date, size, file type, directory
    - Pagination with limits and offset
    - Optional metadata and URL inclusion
    - Search statistics and aggregations

    **Usage Examples:**

    **Simple listing:**
    - `GET /?limit=50&offset=0` - List first 50 files

    **File type filtering:**
    - `GET /?file_type_codes=pdf&limit=50` - Filter by PDF files
    - `GET /?file_type_codes=pdf,jpeg,png` - Filter by multiple file types

    **Directory filtering:**
    - `GET /?directory_ids=550e8400-e29b-41d4-a716-446655440000` - Filter by directory UUID
    - `GET /?directory_ids=uuid1,uuid2` - Filter by multiple directories

    **Folder path filtering:**
    - `GET /?folder=input/uploads` - Filter by folder path (matches S3 keys starting with "input/uploads/")
    - `GET /?folder=input/uploads/pdf` - Filter by PDF folder
    - `GET /?folder=input/uploads/image/2026/03/16` - Filter by specific date folder

    **Advanced search:**
    - `GET /?search=report&file_type_codes=pdf&limit=50` - Search for PDF files containing "report"
    - `GET /?size_min=1000000&size_max=10000000&sort_field=size&sort_order=desc` - Large files sorted by size
    - `GET /?date_from=2024-01-01&date_to=2024-12-31&include_stats=true` - Files from 2024 with statistics

    **Complex filtering:**
    - `GET /?search=financial&file_type_codes=pdf,xlsx&folder=input/uploads&size_min=1000&sort_field=createdAt&sort_order=desc`

    **Search modes:**
    - `search_mode=contains` - Partial match (default)
    - `search_mode=exact` - Exact filename match
    - `search_mode=starts_with` - Starts with term
    - `search_mode=ends_with` - Ends with term
    """
    # Parse comma-separated parameters
    parsed_file_type_codes = parse_comma_separated_list(file_type_codes)
    parsed_directory_ids = parse_comma_separated_list(directory_ids)
    parsed_content_types = parse_comma_separated_list(content_types)

    # Build query using query builder
    query_builder = FileQueryBuilder()

    # Handle search term
    if search:
        exact_match = search_mode == SearchMode.EXACT
        query_builder.search_term(
            search, exact_match=exact_match, case_sensitive=case_sensitive
        )

    # Apply filters
    if parsed_file_type_codes:
        query_builder.file_type_codes(parsed_file_type_codes)
    if parsed_directory_ids:
        query_builder.directory_ids(parsed_directory_ids)
    if parsed_content_types:
        query_builder.content_types(parsed_content_types)
    if folder:
        query_builder.folder_path(folder)
    if category:
        query_builder.category_filter(category)
    if size_min is not None or size_max is not None:
        query_builder.size_range(size_min, size_max)
    if date_from or date_to:
        query_builder.date_range(date_from, date_to)

    # Apply sorting and pagination
    query_builder.sort(sort_field, sort_order)
    query_builder.paginate(limit, offset)
    query_builder.include_metadata(include_metadata)
    query_builder.include_urls(include_urls)

    # Execute search
    return await file_service.search_files(query_builder.build(), include_stats)


@router.get(
    "/by-id/{file_id}", summary="Get file details by ID", response_model=FileResponse
)
async def get_file_details(
    file_id: UUID, file_service: FileInterface = Depends(get_file_service)
):
    """Get detailed information about a specific file by its database ID"""
    return await file_service.get_file_by_id(file_id)


@router.get("/types", summary="Get file types", response_model=Dict[str, Any])
async def get_file_types(
    limit: int = FileInterface.TYPES_LIMIT,
    offset: int = FileInterface.TYPES_OFFSET,
    search: Optional[str] = None,
    category: Optional[str] = None,
    file_service: FileInterface = Depends(get_file_service),
):
    """Get list of available file types and their counts with pagination"""
    filters = {}
    if search:
        filters["search"] = {"term": search}
    if category:
        filters["categories"] = [category]

    return await file_service.get_file_types(
        limit=limit, offset=offset, filters=filters
    )


@router.get(
    "/categories", summary="Get file type categories", response_model=Dict[str, Any]
)
async def get_file_type_categories(
    refresh: bool = Query(
        False,
        description="Force refresh of cached data by bypassing cache",
    ),
    file_service: FileInterface = Depends(get_file_service),
):
    """
    Get all unique file type categories from the database

    **Returns:**
    - Dictionary with file_type_categories as key and list of categories as value

    **Example Response:**
    {
        "file_type_categories": ["document", "data", "image", "audio", "video", "archive"]
    }
    """
    try:
        categories = await file_service.get_file_type_categories(refresh=refresh)
        return {"file_type_categories": categories}

    except Exception as e:
        raise Exception(f"Error getting file type categories: {str(e)}")


@router.get("/analytics", summary="Get file analytics", response_model=Dict[str, Any])
async def get_file_analytics(
    # Filter parameters (reduced to 5 as requested)
    file_type: Optional[str] = Query(
        None,
        description="Filter by file type category (e.g., document, image, audio, video, archive, data)",
    ),
    folder: Optional[str] = Query(
        None,
        description="Filter by folder path using S3 key pattern (e.g., input/uploads)",
    ),
    size_range: Optional[str] = Query(
        None,
        description="Filter by size range (e.g., 0-1MB, 1-10MB, 10-50MB, 50-100MB, 100MB+)",
    ),
    date_from: Optional[datetime] = Query(
        None,
        description="Filter files from this date onwards",
    ),
    date_to: Optional[datetime] = Query(
        None,
        description="Filter files up to this date",
    ),
    refresh: bool = Query(
        False,
        description="Force refresh of cached data by bypassing cache",
    ),
    file_service: FileInterface = Depends(get_file_service),
):
    """
    Get comprehensive file analytics with filtering and time-based grouping

    **Features:**
    - Summary statistics (total files, storage, averages)
    - File type distribution for pie charts
    - Folder distribution for bar charts
    - Size distribution analysis
    - Monthly trends for area/line charts
    - Weekly trends for detailed analysis
    - Growth metrics with percentages
    - All data grouped by month and week for charts

    **Filter Options (5 parameters):**
    - `file_type`: Filter by category (document, image, video, audio, archive, data)
    - `folder`: Filter by folder path (e.g., input/uploads)
    - `size_range`: Filter by size range (0-1MB, 1-10MB, 10-50MB, 50-100MB, 100MB+)
    - `date_from`: Start date for filtering
    - `date_to`: End date for filtering

    **Response Structure:**
    ```json
    {
        "summary": {
            "total_files": 1250,
            "total_size_mb": 5240.8,
            "total_size_gb": 5.12,
            "avg_file_size_mb": 4.19,
            "total_folders": 45
        },
        "file_type_distribution": [
            {"type": "PDF", "count": 450, "size_mb": 1800},
            {"type": "JPEG", "count": 300, "size_mb": 1200}
        ],
        "folder_distribution": [
            {"folder": "uploads", "files": 800, "size_mb": 3200},
            {"folder": "documents", "files": 450, "size_mb": 2040}
        ],
        "size_distribution": [
            {"range": "0-1MB", "count": 525, "percentage": 42},
            {"range": "1-10MB", "count": 363, "percentage": 29}
        ],
        "monthly_trends": [
            {"date": "2024-01", "uploads": 120, "size": 504, "storage": 1200},
            {"date": "2024-02", "uploads": 150, "size": 630, "storage": 1830}
        ],
        "weekly_trends": [
            {"date": "2024-W01", "uploads": 30, "size": 126, "storage": 300},
            {"date": "2024-W02", "uploads": 35, "size": 147, "storage": 447}
        ],
        "growth_metrics": [
            {"date": "2024-01", "file_growth": 120, "storage_growth": 504, "file_growth_percent": 10.5},
            {"date": "2024-02", "file_growth": 150, "storage_growth": 630, "file_growth_percent": 12.5}
        ]
    }
    ```

    **Usage Examples:**

    **Get all analytics:**
    - `GET /analytics` - All data with no filters

    **Filter by file type:**
    - `GET /analytics?file_type=document` - Analytics for documents only

    **Filter by folder:**
    - `GET /analytics?folder=input/uploads` - Analytics for specific folder

    **Filter by date range:**
    - `GET /analytics?date_from=2024-01-01&date_to=2024-12-31` - 2024 analytics

    **Combine filters:**
    - `GET /analytics?file_type=image&folder=input/uploads&size_range=1-10MB&date_from=2024-01-01&date_to=2024-03-31`

    **Chart Data Examples:**

    **Pie Chart Data (file_type_distribution):**
    ```json
    [
        {"type": "PDF", "count": 450, "color": "#ef4444"},
        {"type": "JPEG", "count": 300, "color": "#3b82f6"}
    ]
    ```

    **Bar Chart Data (folder_distribution):**
    ```json
    [
        {"folder": "uploads", "files": 800, "size_mb": 3200},
        {"folder": "documents", "files": 450, "size_mb": 2040}
    ]
    ```

    **Area Chart Data (monthly_trends):**
    ```json
    [
        {"date": "2024-01", "uploads": 120, "downloads": 276, "size": 504},
        {"date": "2024-02", "uploads": 150, "downloads": 345, "size": 630}
    ]
    ```

    **Line Chart Data (growth_metrics):**
    ```json
    [
        {"date": "2024-01", "storage": 1200, "storage_growth_percent": 10.5},
        {"date": "2024-02", "storage": 1830, "storage_growth_percent": 12.5}
    ]
    ```
    """
    try:
        return await file_service.get_file_analytics(
            file_type=file_type,
            folder=folder,
            size_range=size_range,
            date_from=date_from,
            date_to=date_to,
            refresh=refresh,
        )
    except Exception as e:
        raise Exception(f"Error getting file analytics: {str(e)}")


@router.post("/cache/clear", summary="Clear file cache", response_model=Dict[str, Any])
async def clear_file_cache(
    cache_type: Optional[str] = Query(
        None,
        description="Specific cache type to clear (search, categories, types, analytics, folders, all)",
    ),
    pattern: Optional[str] = Query(
        None,
        description="Custom pattern for selective cache clearing (e.g., file_search:*)",
    ),
    file_service: FileInterface = Depends(get_file_service),
):
    """
    Clear file-related cache entries with optional selective clearing

    **Cache Types:**
    - `search`: Clear search result caches
    - `categories`: Clear file type categories cache
    - `types`: Clear file types by category caches
    - `analytics`: Clear analytics caches
    - `folders`: Clear folder structure caches
    - `all`: Clear all file-related caches (default)

    **Usage Examples:**

    **Clear all caches:**
    - `POST /cache/clear` - Clears all file-related caches

    **Clear specific cache type:**
    - `POST /cache/clear?cache_type=search` - Clear only search caches
    - `POST /cache/clear?cache_type=analytics` - Clear only analytics caches

    **Clear with custom pattern:**
    - `POST /cache/clear?pattern=file_search:*` - Clear all search caches
    - `POST /cache/clear?pattern=analytics:*` - Clear all analytics caches

    **Returns:**
    - Success message with details of what was cleared
    """
    try:
        file_service._clear_file_cache(cache_type=cache_type, pattern=pattern)

        cleared_type = cache_type or "all"
        if pattern:
            cleared_type += f" with pattern '{pattern}'"

        return {
            "success": True,
            "message": f"Cache cleared successfully for: {cleared_type}",
            "cache_type": cache_type,
            "pattern": pattern,
            "timestamp": datetime.utcnow().isoformat(),
        }

    except Exception as e:
        raise Exception(f"Error clearing cache: {str(e)}")


@router.get("/folders", summary="Get folder structure", response_model=Dict[str, Any])
async def get_folder_structure(
    limit: int = FileInterface.FOLDERS_LIMIT,
    offset: int = FileInterface.FOLDERS_OFFSET,
    search: Optional[str] = None,
    max_depth: Optional[int] = None,
    min_depth: Optional[int] = None,
    path: Optional[str] = None,  # Filter by exact path
    file_service: FileInterface = Depends(get_file_service),
):
    """Get the folder structure of stored files with pagination and proper labeling"""
    filters = {}
    if search:
        filters["search"] = {"term": search}
    if max_depth is not None or min_depth is not None:
        filters["depth"] = {}
        if max_depth is not None:
            filters["depth"]["max"] = max_depth
        if min_depth is not None:
            filters["depth"]["min"] = min_depth

    # Add path filter if provided
    if path:
        filters["path"] = {"exact": path}

    return await file_service.get_folder_structure(
        limit=limit, offset=offset, filters=filters
    )


@router.post("/upload", summary="Upload single file", response_model=FileUploadResponse)
async def upload_single_file(
    file: UploadFile = File(...),
    description: Optional[str] = Form(None),
    upload_path: Optional[str] = Form("default"),  # Options: "default" or "assets"
    file_service: FileInterface = Depends(get_file_service),
):
    """Upload a single file to S3 bucket"""
    content = await file.read()
    content_type = file.content_type or "application/octet-stream"
    metadata = {"upload_source": "api_single_upload"}
    if description:
        metadata["description"] = description

    uploaded_file = await file_service.create_file(
        filename=file.filename,
        content=content,
        content_type=content_type,
        metadata=metadata,
        upload_path=upload_path,
    )

    return FileUploadResponse(file=uploaded_file)


@router.delete("/{s3_key:path}", summary="Delete file", response_model=Dict[str, Any])
async def delete_file(
    s3_key: str, file_service: FileInterface = Depends(get_file_service)
):
    """Delete a file from S3 and database"""
    return await file_service.delete_file(s3_key)
