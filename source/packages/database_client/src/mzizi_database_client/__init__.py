"""Typed async HTTP client for the Rust database service's named operations.

This package knows HTTP and JSON. It never holds a database connection string, never builds
SQL and never knows a table or schema name exists; those stay inside the Rust service. Hand-
written for now (`.docs/decisions/DEC-DATABASE-ACCESS-LIFECYCLE.md`): the official Dryv
`python-client-sdk` pack currently fails to load against the running Dryv engine, and
`axum-backend` fails the same way on the server side. Swapping in generated code later is a
drop-in replacement; every model and method here mirrors the Dryv-authored operation contract
in `dryv/contracts/apps/database/filesystem.ts`.
"""

from mzizi_database_client.client import DatabaseClient
from mzizi_database_client.errors import ApiError, Conflict, Denied
from mzizi_database_client.models import CreateFolderRequest, CreateFolderResponse, Folder

__all__ = [
    "ApiError",
    "Conflict",
    "CreateFolderRequest",
    "CreateFolderResponse",
    "DatabaseClient",
    "Denied",
    "Folder",
]
__version__ = "0.1.0"
