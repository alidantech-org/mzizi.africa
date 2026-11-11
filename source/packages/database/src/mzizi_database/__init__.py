"""Database primitives: safe connections, transactions, ordered SQL application and verified reset of the disposable rewrite database."""

from .connection import (
    REWRITE_DATABASE,
    Connection,
    DatabaseSafetyError,
    Row,
    assert_rewrite_session,
    connect,
    required,
    rewrite_url,
    transaction,
)
from .migrate import apply_migrations, migration_files, reset_database

__all__ = [
    "REWRITE_DATABASE",
    "Connection",
    "DatabaseSafetyError",
    "Row",
    "apply_migrations",
    "assert_rewrite_session",
    "connect",
    "migration_files",
    "required",
    "reset_database",
    "rewrite_url",
    "transaction",
]
__version__ = "0.1.0"
