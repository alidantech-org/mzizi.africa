"""Create legal tables and seed data

Revision ID: create_seed_legal_tables
Revises: create_seed_geo_tables
Create Date: 2026-03-21 01:57:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid

from app.routes.legal.models.constitution_sections import ConstitutionSections
from app.routes.legal.models.constitutions import Constitutions

# revision identifiers, used by Alembic.
revision = "create_seed_legal_tables"
down_revision = "create_seed_geo_tables"
branch_labels = None
depends_on = None


def load_constitutions_from_csv(csv_path: str) -> list:
    """Load constitutions from CSV file"""
    constitutions = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            constitutions.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "constitution_code": row["constitution_code"],
                    "name": row["name"],
                    "effective_from": (
                        datetime.strptime(row["effective_from"], "%Y-%m-%d").date()
                        if row["effective_from"].strip()
                        else None
                    ),
                    "effective_to": (
                        datetime.strptime(row["effective_to"], "%Y-%m-%d").date()
                        if row["effective_to"].strip()
                        else None
                    ),
                    "status": row["status"],
                    "document_uri": row["document_uri"],
                    "document_hash": row["document_hash"],
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return constitutions


def load_constitution_sections_from_csv(csv_path: str) -> list:
    """Load constitution sections from CSV file"""
    sections = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            sections.append(
                {
                    "constitution_code": row["constitution_code"],
                    "parent_section_code": (
                        row["parent_section_code"]
                        if row["parent_section_code"].strip()
                        else None
                    ),
                    "previous_version_code": (
                        row["previous_version_code"]
                        if row["previous_version_code"].strip()
                        else None
                    ),
                    "section_type": row["section_type"],
                    "section_code": row["section_code"],
                    "title": row["title"],
                    "content": row["content"] if row["content"].strip() else None,
                    "link_url": row["link_url"] if row["link_url"].strip() else None,
                    "sort_order": int(row["sort_order"]),
                    "valid_from": (
                        datetime.strptime(row["valid_from"], "%Y-%m-%d").date()
                        if row["valid_from"].strip()
                        else None
                    ),
                    "valid_to": (
                        datetime.strptime(row["valid_to"], "%Y-%m-%d").date()
                        if row["valid_to"].strip()
                        else None
                    ),
                    "transaction_at": (
                        datetime.strptime(row["transaction_at"], "%Y-%m-%dT%H:%M:%SZ")
                        if row["transaction_at"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return sections


def upgrade() -> None:
    """Create legal tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating legal tables using SQLAlchemy models...")

    # Create legal schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS legal")
    print("✅ Created legal schema")

    # Create tables using SQLAlchemy models
    Constitutions.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created constitutions table")

    ConstitutionSections.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created constitution_sections table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "legal", "_seed")

    # Seed constitutions
    print("⚖️ Seeding constitutions...")
    constitutions_csv = os.path.join(csv_dir, "constitutions.csv")
    if os.path.exists(constitutions_csv):
        constitutions = load_constitutions_from_csv(constitutions_csv)

        conn = op.get_bind()
        constitution_lookup = {}

        for constitution in constitutions:
            # Use ON CONFLICT DO NOTHING to handle duplicates
            insert_stmt = text(
                """
                INSERT INTO legal.constitutions (
                    id, constitution_code, name, effective_from, effective_to, 
                    status, document_uri, document_hash
                ) VALUES (
                    :id, :constitution_code, :name, :effective_from, :effective_to,
                    :status, :document_uri, :document_hash
                ) ON CONFLICT (constitution_code) DO NOTHING
            """
            )

            try:
                result = conn.execute(insert_stmt, constitution)
                # In offline mode, result might be None
                if (
                    result is not None
                    and hasattr(result, "rowcount")
                    and result.rowcount > 0
                ):
                    constitution_lookup[constitution["constitution_code"]] = (
                        constitution["id"]
                    )
                    print(
                        f"✅ Inserted constitution {constitution['constitution_code']}"
                    )
                else:
                    print(
                        f"⚠️  Constitution {constitution['constitution_code']} already exists or offline mode, skipping"
                    )
            except Exception as e:
                print(
                    f"❌ Failed to insert constitution {constitution['constitution_code']}: {e}"
                )

        # After attempting all inserts, build lookup from existing data
        if len(constitution_lookup) < len(constitutions):
            print("🔄 Building constitution lookup from existing data...")
            try:
                result = conn.execute(
                    text("SELECT constitution_code, id FROM legal.constitutions")
                )
                if result is not None:
                    for row in result:
                        constitution_lookup[row[0]] = row[1]
                else:
                    print("⚠️  Offline mode - cannot build lookup from existing data")
            except Exception as e:
                print(f"⚠️  Could not build lookup from existing data: {e}")

        print(f"✅ Seeded {len(constitutions)} constitutions")

        # Create a lookup for section IDs by code (for parent relationships)
        section_lookup = {}

        # Seed constitution sections
        print("📄 Seeding constitution sections...")
        sections_csv = os.path.join(csv_dir, "constitution_sections.csv")
        if os.path.exists(sections_csv):
            sections = load_constitution_sections_from_csv(sections_csv)
        else:
            sections = []
            print("⚠️  Constitution sections CSV file not found")

        for section in sections:
            # Add UUID to the data
            section["id"] = str(ulid())

            # Set constitution_id from lookup
            if section["constitution_code"] in constitution_lookup:
                section["constitution_id"] = constitution_lookup[
                    section["constitution_code"]
                ]
            else:
                print(f"⚠️  Constitution code {section['constitution_code']} not found")
                continue

            # Use ON CONFLICT DO NOTHING to handle duplicates
            insert_stmt = text(
                """
                INSERT INTO legal.constitution_sections (
                    id, constitution_id, constitution_code, parent_section_code, 
                    previous_version_code, section_type, section_code, title, content, 
                    link_url, sort_order, valid_from, valid_to, transaction_at, 
                    is_active, created_at, updated_at
                ) VALUES (
                    :id, :constitution_id, :constitution_code, :parent_section_code,
                    :previous_version_code, :section_type, :section_code, :title, :content,
                    :link_url, :sort_order, :valid_from, :valid_to, :transaction_at,
                    :is_active, :created_at, :updated_at
                ) ON CONFLICT (constitution_code, section_code) DO NOTHING
            """
            )

            try:
                result = conn.execute(insert_stmt, section)
                # In offline mode, result might be None
                if (
                    result is not None
                    and hasattr(result, "rowcount")
                    and result.rowcount > 0
                ):
                    section_lookup[section["section_code"]] = section["id"]
                    print(f"✅ Inserted section {section['section_code']}")
                else:
                    print(
                        f"⚠️  Section {section['section_code']} already exists or offline mode, skipping"
                    )
            except Exception as e:
                print(f"❌ Failed to insert section {section['section_code']}: {e}")

        # After attempting all inserts, build lookup from existing data
        if len(section_lookup) < len(sections):
            print("🔄 Building section lookup from existing data...")
            try:
                result = conn.execute(
                    text("SELECT section_code, id FROM legal.constitution_sections")
                )
                if result is not None:
                    for row in result:
                        section_lookup[row[0]] = row[1]
                else:
                    print("⚠️  Offline mode - cannot build lookup from existing data")
            except Exception as e:
                print(f"⚠️  Could not build lookup from existing data: {e}")

        print(f"✅ Seeded {len(sections)} constitution sections")

        # Now update parent relationships
        print("🔄 Updating parent-child relationships...")

        for section in sections:
            if (
                section["parent_section_code"]
                and section["parent_section_code"] in section_lookup
            ):
                parent_id = section_lookup[section["parent_section_code"]]
                section_id = section_lookup[section["section_code"]]

                sql = text(
                    """
                    UPDATE legal.constitution_sections 
                    SET parent_section_id = :parent_id
                    WHERE id = :section_id
                """
                )
                conn.execute(sql, {"parent_id": parent_id, "section_id": section_id})

        print("✅ Updated parent-child relationships")

    print("🎉 Legal domain migration completed successfully!")


def downgrade() -> None:
    """Remove legal tables and schema using SQLAlchemy models"""
    print("🗑️  Dropping legal tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables using SQLAlchemy models (in reverse order of creation) with error handling
    try:
        ConstitutionSections.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped constitution_sections table")
    except Exception as e:
        print(f"⚠️  Error dropping constitution_sections (may not exist): {e}")
        conn.rollback()

    try:
        Constitutions.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped constitutions table")
    except Exception as e:
        print(f"⚠️  Error dropping constitutions (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS legal")
        print("✅ Dropped legal schema")
    except Exception as e:
        print(f"⚠️  Error dropping legal schema (may not exist): {e}")
        conn.rollback()

    print("✅ Legal tables and schema dropped")
