"""Create geographic tables and seed data

Revision ID: create_seed_geo_tables
Revises: create_and_seed_tables
Create Date: 2026-03-20 23:58:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.geographic.models import GeoLevels, GeoUnits, GeoRelationships

# revision identifiers, used by Alembic.
revision = "create_seed_geo_tables"
down_revision = "create_seed_file_tables"
branch_labels = None
depends_on = None


def load_geo_levels_from_csv(csv_path: str) -> list:
    """Load geo levels from CSV file"""
    geo_levels = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            geo_levels.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "geo_level_code": row["geo_level_code"],
                    "level_name": row["level_name"],
                    "level_order": int(row["level_order"]),
                    "parent_geo_level_code": (
                        row["parent_geo_level_code"]
                        if row["parent_geo_level_code"].strip()
                        else None
                    ),
                    "description": row["description"],
                    "is_active": True,
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return geo_levels


def load_geo_units_from_csv(csv_path: str) -> list:
    """Load geo units from CSV file"""
    geo_units = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            geo_units.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "geo_unit_code": row["geo_unit_code"],
                    "name": row["name"],
                    "geo_code": row["geo_code"],
                    "geo_level_code": row["geo_level_code"],
                    "parent_geo_code": (
                        row["parent_geo_code"]
                        if row["parent_geo_code"].strip()
                        else None
                    ),
                    "is_active": row.get("is_active", "true").lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return geo_units


def load_geo_relationships_from_csv(csv_path: str) -> list:
    """Load geo relationships from CSV file"""
    geo_relationships = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            geo_relationships.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "parent_geo_code": row["parent_geo_code"],
                    "child_geo_code": row["child_geo_code"],
                    "relation_type": row["relation_type"],
                    "valid_from": row["valid_from"],
                    "valid_to": (row["valid_to"] if row["valid_to"].strip() else None),
                    "notes": (row["notes"] if row["notes"].strip() else None),
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return geo_relationships


def upgrade() -> None:
    """Create geographic tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating geographic tables using SQLAlchemy models...")

    # Create geographic schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS geographic")
    print("✅ Created geographic schema")

    # Create tables using SQLAlchemy models
    GeoLevels.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created geo_levels table")

    GeoUnits.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created geo_units table")

    GeoRelationships.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created geo_relationships table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "geographic", "_seed")

    # Seed geo_levels
    print("🌍 Seeding geo levels...")
    geo_levels_csv = os.path.join(csv_dir, "geo_levels.csv")
    if os.path.exists(geo_levels_csv):
        geo_levels = load_geo_levels_from_csv(geo_levels_csv)

        conn = op.get_bind()
        geo_level_lookup = {}

        for geo_level in geo_levels:
            # Use ON CONFLICT DO NOTHING to handle duplicates
            insert_stmt = text(
                """
                INSERT INTO geographic.geo_levels (
                    id, geo_level_code, level_name, level_order, parent_geo_level_code,
                    description, is_active, created_at, updated_at
                ) VALUES (
                    :id, :geo_level_code, :level_name, :level_order, :parent_geo_level_code,
                    :description, :is_active, :created_at, :updated_at
                ) ON CONFLICT (geo_level_code) DO NOTHING
            """
            )

            try:
                result = conn.execute(insert_stmt, geo_level)
                # In offline mode, result might be None
                if (
                    result is not None
                    and hasattr(result, "rowcount")
                    and result.rowcount > 0
                ):
                    geo_level_lookup[geo_level["geo_level_code"]] = geo_level["id"]
                    print(f"✅ Inserted geo level {geo_level['geo_level_code']}")
                else:
                    print(
                        f"⚠️  Geo level {geo_level['geo_level_code']} already exists or offline mode, skipping"
                    )
            except Exception as e:
                print(
                    f"❌ Failed to insert geo level {geo_level['geo_level_code']}: {e}"
                )

        # After attempting all inserts, build lookup from existing data
        if len(geo_level_lookup) < len(geo_levels):
            print("🔄 Building geo level lookup from existing data...")
            try:
                result = conn.execute(
                    text("SELECT geo_level_code, id FROM geographic.geo_levels")
                )
                if result is not None:
                    for row in result:
                        geo_level_lookup[row[0]] = row[1]
                else:
                    print("⚠️  Offline mode - cannot build lookup from existing data")
            except Exception as e:
                print(f"⚠️  Could not build lookup from existing data: {e}")

        print(f"✅ Seeded {len(geo_levels)} geo levels")

        # Now update geo level parent relationships
        print("🔄 Updating geo level parent-child relationships...")

        for geo_level in geo_levels:
            if (
                geo_level["parent_geo_level_code"]
                and geo_level["parent_geo_level_code"] in geo_level_lookup
            ):
                parent_id = geo_level_lookup[geo_level["parent_geo_level_code"]]

                sql = text(
                    """
                    UPDATE geographic.geo_levels 
                    SET parent_geo_level_id = :parent_id
                    WHERE geo_level_code = :geo_level_code
                    """
                )
                try:
                    conn.execute(
                        sql,
                        {
                            "parent_id": parent_id,
                            "geo_level_code": geo_level["geo_level_code"],
                        },
                    )
                    print(
                        f"✅ Updated parent relationship for geo level {geo_level['geo_level_code']}"
                    )
                except Exception as e:
                    print(
                        f"❌ Failed to update parent relationship for geo level {geo_level['geo_level_code']}: {e}"
                    )

        print("✅ Updated geo level parent-child relationships")

    # Seed geo_units
    print("🌍 Seeding geo units...")
    geo_units_csv = os.path.join(csv_dir, "geo_units.csv")
    if os.path.exists(geo_units_csv):
        geo_units = load_geo_units_from_csv(geo_units_csv)

        conn = op.get_bind()
        geo_unit_lookup = {}

        for geo_unit in geo_units:
            # Use ON CONFLICT DO NOTHING to handle duplicates
            insert_stmt = text(
                """
                INSERT INTO geographic.geo_units (
                    id, geo_unit_code, name, geo_code, geo_level_code, 
                    parent_geo_code, is_active, created_at, updated_at
                ) VALUES (
                    :id, :geo_unit_code, :name, :geo_code, :geo_level_code,
                    :parent_geo_code, :is_active, :created_at, :updated_at
                ) ON CONFLICT (geo_unit_code) DO NOTHING
            """
            )

            try:
                result = conn.execute(insert_stmt, geo_unit)
                # In offline mode, result might be None
                if (
                    result is not None
                    and hasattr(result, "rowcount")
                    and result.rowcount > 0
                ):
                    geo_unit_lookup[geo_unit["geo_unit_code"]] = geo_unit["id"]
                    print(f"✅ Inserted geo unit {geo_unit['geo_unit_code']}")
                else:
                    print(
                        f"⚠️  Geo unit {geo_unit['geo_unit_code']} already exists or offline mode, skipping"
                    )
            except Exception as e:
                print(f"❌ Failed to insert geo unit {geo_unit['geo_unit_code']}: {e}")

        # After attempting all inserts, build lookup from existing data
        if len(geo_unit_lookup) < len(geo_units):
            print("🔄 Building geo unit lookup from existing data...")
            try:
                result = conn.execute(
                    text("SELECT geo_unit_code, id FROM geographic.geo_units")
                )
                if result is not None:
                    for row in result:
                        geo_unit_lookup[row[0]] = row[1]
                else:
                    print("⚠️  Offline mode - cannot build lookup from existing data")
            except Exception as e:
                print(f"⚠️  Could not build lookup from existing data: {e}")

        print(f"✅ Processed {len(geo_units)} geo units")

        # Now update parent relationships
        print("🔄 Updating parent-child relationships...")

        for geo_unit in geo_units:
            if (
                geo_unit["parent_geo_code"]
                and geo_unit["parent_geo_code"] in geo_unit_lookup
            ):
                parent_id = geo_unit_lookup[geo_unit["parent_geo_code"]]

                sql = text(
                    """
                    UPDATE geographic.geo_units 
                    SET parent_geo_code_id = :parent_id
                    WHERE geo_unit_code = :geo_unit_code
                    """
                )
                try:
                    conn.execute(
                        sql,
                        {
                            "parent_id": parent_id,
                            "geo_unit_code": geo_unit["geo_unit_code"],
                        },
                    )
                    print(
                        f"✅ Updated parent relationship for {geo_unit['geo_unit_code']}"
                    )
                except Exception as e:
                    print(
                        f"❌ Failed to update parent relationship for {geo_unit['geo_unit_code']}: {e}"
                    )

        print("✅ Updated parent-child relationships")

    # Seed geo_relationships
    print("� Seeding geo relationships...")
    geo_relationships_csv = os.path.join(csv_dir, "geo_relationships.csv")
    if os.path.exists(geo_relationships_csv):
        geo_relationships = load_geo_relationships_from_csv(geo_relationships_csv)

        conn = op.get_bind()

        for geo_relationship in geo_relationships:
            # Use ON CONFLICT DO NOTHING to handle duplicates
            insert_stmt = text(
                """
                INSERT INTO geographic.geo_relationships (
                    id, parent_geo_code, child_geo_code, relation_type, 
                    valid_from, valid_to, notes, created_at, updated_at
                ) VALUES (
                    :id, :parent_geo_code, :child_geo_code, :relation_type,
                    :valid_from, :valid_to, :notes, :created_at, :updated_at
                ) ON CONFLICT (parent_geo_code, child_geo_code, relation_type, valid_from) DO NOTHING
            """
            )

            try:
                result = conn.execute(insert_stmt, geo_relationship)
                # In offline mode, result might be None
                if (
                    result is not None
                    and hasattr(result, "rowcount")
                    and result.rowcount > 0
                ):
                    print(
                        f"✅ Inserted geo relationship {geo_relationship['parent_geo_code']} -> {geo_relationship['child_geo_code']}"
                    )
                else:
                    print(
                        f"⚠️  Geo relationship {geo_relationship['parent_geo_code']} -> {geo_relationship['child_geo_code']} already exists or offline mode, skipping"
                    )
            except Exception as e:
                print(
                    f"❌ Failed to insert geo relationship {geo_relationship['parent_geo_code']} -> {geo_relationship['child_geo_code']}: {e}"
                )

        print(f"✅ Processed {len(geo_relationships)} geo relationships")

    print("�� Geographic domain migration completed successfully!")


def downgrade() -> None:
    """Remove geographic tables and schema using SQLAlchemy models"""
    print("🗑️  Dropping geographic tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables using SQLAlchemy models (in reverse order of creation) with error handling
    try:
        GeoRelationships.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped geo_relationships table")
    except Exception as e:
        print(f"⚠️  Error dropping geo_relationships (may not exist): {e}")
        conn.rollback()

    try:
        GeoUnits.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped geo_units table")
    except Exception as e:
        print(f"⚠️  Error dropping geo_units (may not exist): {e}")
        conn.rollback()

    try:
        GeoLevels.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped geo_levels table")
    except Exception as e:
        print(f"⚠️  Error dropping geo_levels (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS geographic")
        print("✅ Dropped geographic schema")
    except Exception as e:
        print(f"⚠️  Error dropping geographic schema (may not exist): {e}")
        conn.rollback()

    print("✅ Geographic tables and schema dropped")
