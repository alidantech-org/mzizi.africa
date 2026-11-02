"""Create file_types and directories tables and seed data

Revision ID: create_and_seed_tables
Revises:
Create Date: 2026-03-16 14:50:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
import sys
from datetime import datetime

# Add the parent directory to the path to import S3Service
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

try:
    from app.config.s3_service import S3Service
except ImportError:
    print("⚠️  Could not import S3Service, S3 directory creation will be skipped")
    S3Service = None

# revision identifiers, used by Alembic.
revision = "create_seed_file_tables"
down_revision = None
branch_labels = None
depends_on = None


def get_s3_service():
    """Get S3 service using existing configuration"""
    try:
        if S3Service is None:
            return None

        s3_service = S3Service()

        # Test bucket access
        if not s3_service.check_bucket_access():
            print("⚠️  S3 bucket is not accessible, skipping S3 directory creation")
            return None

        return s3_service
    except Exception as e:
        print(f"⚠️  Could not create S3 service: {e}")
        return None


def create_s3_directories(directories, s3_service):
    """Create directories in S3 bucket using S3Service"""
    if not s3_service:
        print("⚠️  S3 service not available, skipping S3 directory creation")
        return

    created_count = 0

    for directory in directories:
        # Create S3 "directory" (which is just a prefix with an empty object)
        s3_key = f"{directory['path']}/"

        try:
            # Create an empty object to represent the directory
            success = s3_service.upload_file(
                file_content=b"", s3_key=s3_key, content_type="application/x-directory"
            )

            if success:
                created_count += 1
                print(f"📁 Created S3 directory: {s3_key}")
            else:
                print(f"❌ Failed to create S3 directory: {s3_key}")

        except Exception as e:
            print(f"❌ Unexpected error creating S3 directory {s3_key}: {e}")

    print(f"✅ Created {created_count} directories in S3 bucket")


def load_file_types_from_csv(csv_path: str) -> list:
    """Load file types from CSV file"""
    file_types = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            file_types.append(
                {
                    "name": row["name"],
                    "code": row["code"],
                    "mime_type": row["mime_type"],
                    "extension": row["extension"],
                    "category": row["category"],
                    "is_previewable": row["is_previewable"].lower() == "true",
                    "max_size_mb": (
                        int(row["max_size_mb"]) if row["max_size_mb"] else None
                    ),
                    "allowed_extensions": row["allowed_extensions"],
                    "processing_strategy": row["processing_strategy"],
                    "description": row["description"],
                    # Add missing fields with current date/time
                    "is_active": True,
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return file_types


def load_directories_from_csv(csv_path: str) -> list:
    """Load directories from CSV file and calculate parent relationships"""
    directories = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            directories.append(
                {
                    "id": row["id"],
                    "name": row["name"],
                    "path": row["path"],
                    "depth": int(row["depth"]),
                    "description": row["description"],
                    "file_count": int(row["file_count"]) if row["file_count"] else 0,
                    "total_size_bytes": (
                        int(row["total_size_bytes"]) if row["total_size_bytes"] else 0
                    ),
                    "last_file_at": (
                        row["last_file_at"]
                        if row["last_file_at"] and row["last_file_at"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    # Add current date/time fields
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    # Calculate parent_id from path
    path_to_id = {d["path"]: d["id"] for d in directories}

    for directory in directories:
        # Calculate parent path
        path_parts = directory["path"].split("/")
        if len(path_parts) > 1:
            parent_path = "/".join(path_parts[:-1])
            directory["parent_id"] = path_to_id.get(parent_path)
        else:
            directory["parent_id"] = None  # Root directory

    return directories


def upgrade() -> None:
    """Create tables and seed data"""

    # Check if tables already have data before seeding
    conn = op.get_bind()

    # Check if file_types has data
    result = conn.execute(
        text(
            "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'file_types'"
        )
    )
    table_exists = result.fetchone()[0] > 0 if result else False

    has_file_types_data = False
    if table_exists:
        result = conn.execute(text("SELECT COUNT(*) as count FROM file_types"))
        has_file_types_data = result.fetchone()[0] > 0 if result else False

    # Check if directories has data
    has_directories_data = False
    if table_exists:
        result = conn.execute(
            text(
                "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_name = 'directories'"
            )
        )
        table_exists = result.fetchone()[0] > 0 if result else False

        if table_exists:
            result = conn.execute(text("SELECT COUNT(*) as count FROM directories"))
            has_directories_data = result.fetchone()[0] > 0 if result else False

    # Initialize directories variable for S3 creation
    directories = []

    # Create file_types table
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS file_types (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            code VARCHAR(50) NOT NULL UNIQUE,
            mime_type VARCHAR(255) NOT NULL UNIQUE,
            extension VARCHAR(50) NOT NULL,
            category VARCHAR(50) NOT NULL,
            is_previewable BOOLEAN DEFAULT false,
            max_size_mb INTEGER,
            allowed_extensions TEXT,
            processing_strategy VARCHAR(50),
            description TEXT,
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """
    )

    # Create file_types indexes
    op.execute(
        """
        CREATE INDEX IF NOT EXISTS ix_file_types_code ON file_types(code);
        CREATE INDEX IF NOT EXISTS ix_file_types_mime_type ON file_types(mime_type);
        CREATE INDEX IF NOT EXISTS ix_file_types_category ON file_types(category);
    """
    )

    print("✅ Created file_types table with indexes")

    # Load file types from CSV and seed
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "..",
        "app",
        "routes",
        "files",
        "_seed",
        "file_types.csv",
    )

    if not os.path.exists(csv_path):
        print(f"⚠️  CSV file not found: {csv_path}")
    elif has_file_types_data:
        print(f"⚠️  File types table already has data, skipping seeding")
    else:
        file_types = load_file_types_from_csv(csv_path)
        print(f"✅ Loaded {len(file_types)} file types from CSV")

        # Insert file types
        conn = op.get_bind()

        for i, file_type in enumerate(file_types, 1):
            print(
                f"📁 Inserting file type {i}/{len(file_types)}: {file_type['name']} ({file_type['code']})"
            )

            sql = text(
                """
                INSERT INTO file_types (
                    id, name, code, mime_type, extension, category, 
                    is_previewable, max_size_mb, allowed_extensions, 
                    processing_strategy, description, is_active, created_at, updated_at
                ) VALUES (
                    gen_random_uuid(), :name, :code, :mime_type, :extension, :category,
                    :is_previewable, :max_size_mb, :allowed_extensions,
                    :processing_strategy, :description, true, now(), now()
                ) ON CONFLICT (code) DO NOTHING
            """
            )

            conn.execute(sql, file_type)

        print(f"✅ Seeded {len(file_types)} file types")

    # Create directories table
    op.execute(
        """
        CREATE TABLE IF NOT EXISTS directories (
            id UUID PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            path VARCHAR(500) NOT NULL UNIQUE,
            parent_id UUID REFERENCES directories(id),
            depth INTEGER NOT NULL DEFAULT 0,
            description TEXT,
            file_count INTEGER DEFAULT 0,
            total_size_bytes BIGINT DEFAULT 0,
            last_file_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT true
        )
    """
    )

    # Create directories indexes
    op.execute(
        """
        CREATE INDEX IF NOT EXISTS ix_directories_path ON directories(path);
        CREATE INDEX IF NOT EXISTS ix_directories_parent_id ON directories(parent_id);
        CREATE INDEX IF NOT EXISTS ix_directories_depth ON directories(depth);
    """
    )

    print("✅ Created directories table with indexes")

    # Load directories from CSV and seed
    csv_path = os.path.join(
        os.path.dirname(os.path.dirname(__file__)),
        "..",
        "app",
        "routes",
        "files",
        "_seed",
        "directories.csv",
    )

    if not os.path.exists(csv_path):
        print(f"⚠️  CSV file not found: {csv_path}")
    elif has_directories_data:
        print(f"⚠️  Directories table already has data, skipping seeding")
        # Still load directories for S3 creation if CSV exists
        if os.path.exists(csv_path):
            directories = load_directories_from_csv(csv_path)
            print(f"📁 Loaded {len(directories)} directories from CSV for S3 creation")
    else:
        directories = load_directories_from_csv(csv_path)
        print(f"✅ Loaded {len(directories)} directories from CSV")

        # Sort by depth to ensure parents are created first
        sorted_directories = sorted(directories, key=lambda x: x["depth"])

        # Insert directories
        conn = op.get_bind()

        for directory in sorted_directories:
            parent_id = directory.get("parent_id")
            print(
                f"📁 Inserting directory: {directory['name']} (parent_id: {parent_id})"
            )

            sql = text(
                """
                INSERT INTO directories (
                    id, name, path, parent_id, depth, description, 
                    file_count, total_size_bytes, last_file_at, 
                    created_at, updated_at, is_active
                ) VALUES (
                    :id, :name, :path, :parent_id, :depth, :description,
                    :file_count, :total_size_bytes, :last_file_at,
                    :created_at, :updated_at, :is_active
                ) 
                ON CONFLICT (id) DO NOTHING
            """
            )

            conn.execute(sql, directory)

        print(f"✅ Seeded {len(directories)} directories")

    # Create directories in S3 bucket using S3Service only if data was actually seeded
    s3_service = get_s3_service()
    if s3_service and directories and not has_directories_data:
        create_s3_directories(directories, s3_service)
    elif s3_service and has_directories_data:
        print(
            "⚠️  Directories already exist in database, skipping S3 directory creation"
        )
    elif s3_service and not directories:
        print("⚠️  No directories available for S3 creation")
    elif not s3_service:
        print("⚠️  S3 service not available, skipping S3 directory creation")


def downgrade() -> None:
    """Remove all tables and data - WARNING: This will delete all data!"""

    print("⚠️  WARNING: This will permanently delete all file types and directories!")
    print("⚠️  This action cannot be undone and will result in complete data loss!")

    # Ask for confirmation (in production, this should be protected)
    # For now, we'll add a safety check - only allow downgrade if explicitly forced
    # In a real application, you might want to add an environment variable check

    # Remove from S3 bucket using S3Service
    s3_service = get_s3_service()

    if s3_service:
        # Get CSV file path to know which directories to remove
        csv_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "..",
            "seeds",
            "files",
            "directories.csv",
        )

        if os.path.exists(csv_path):
            directories = load_directories_from_csv(csv_path)

            removed_count = 0

            for directory in directories:
                s3_key = f"{directory['path']}/"

                try:
                    # Delete directory object from S3
                    success = s3_service.delete_file(s3_key)

                    if success:
                        removed_count += 1
                        print(f"🗑️  Removed S3 directory: {s3_key}")
                    else:
                        print(f"⚠️  Could not remove S3 directory: {s3_key}")

                except Exception as e:
                    print(f"⚠️  Unexpected error removing S3 directory {s3_key}: {e}")

            print(f"✅ Removed {removed_count} directories from S3 bucket")

    # Drop indexes and tables with error handling
    print("🗑️  Dropping database indexes and tables...")
    conn = op.get_bind()

    try:
        op.execute("DROP INDEX IF EXISTS ix_file_types_code")
        print("✅ Dropped ix_file_types_code index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_file_types_code (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP INDEX IF EXISTS ix_file_types_mime_type")
        print("✅ Dropped ix_file_types_mime_type index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_file_types_mime_type (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP INDEX IF EXISTS ix_file_types_category")
        print("✅ Dropped ix_file_types_category index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_file_types_category (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS file_types")
        print("✅ Dropped file_types table")
    except Exception as e:
        print(f"⚠️  Error dropping file_types (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP INDEX IF EXISTS ix_directories_path")
        print("✅ Dropped ix_directories_path index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_directories_path (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP INDEX IF EXISTS ix_directories_parent_id")
        print("✅ Dropped ix_directories_parent_id index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_directories_parent_id (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP INDEX IF EXISTS ix_directories_depth")
        print("✅ Dropped ix_directories_depth index")
    except Exception as e:
        print(f"⚠️  Error dropping ix_directories_depth (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS directories")
        print("✅ Dropped directories table")
    except Exception as e:
        print(f"⚠️  Error dropping directories (may not exist): {e}")
        conn.rollback()

    print("❌ Removed all file types and directories tables and indexes")
    print("⚠️  All file management data has been permanently deleted!")
