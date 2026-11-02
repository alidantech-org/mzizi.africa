"""Create governance tables and seed data

Revision ID: create_seed_governance_tables
Revises: create_seed_legal_tables
Create Date: 2026-03-21 02:00:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.governance.models import (
    ArmsOfGovernment,
    Institutions,
    InstitutionRelationships,
)

# revision identifiers, used by Alembic.
revision = "create_seed_governance_tables"
down_revision = "create_seed_legal_tables"
branch_labels = None
depends_on = None


def load_arms_of_government_from_csv(csv_path: str) -> list:
    """Load arms of government from CSV file"""
    arms = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            arms.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "arm_code": row["arm_code"],
                    "name": row["name"],
                    "description": row["description"],
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return arms


def load_institutions_from_csv(csv_path: str) -> list:
    """Load institutions from CSV file"""
    institutions = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row in reader:
            institutions.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "institution_code": row["institution_code"],
                    "name": row["name"],
                    "description": row["description"],
                    "arm_code": row["arm_code"] if row["arm_code"].strip() else None,
                    "institution_type": (
                        row["institution_type"]
                        if row["institution_type"].strip()
                        else None
                    ),
                    "sub_type": row["sub_type"] if row["sub_type"].strip() else None,
                    "geo_level_code": (
                        row["geo_level_code"] if row["geo_level_code"].strip() else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    return institutions


def load_institution_relationships_from_csv(csv_path: str) -> list:
    """Load institution relationships from CSV file"""
    relationships = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    print(f"📁 Loading relationships from CSV: {csv_path}")
    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty row {row_num}")
                continue

            relationships.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "parent_institution_code": row["parent_institution_code"],
                    "child_institution_code": row["child_institution_code"],
                    "relationship_type": row["relationship_type"],
                    "description": row["description"],
                    "start_date": (
                        datetime.strptime(row["start_date"], "%Y-%m-%d").date()
                        if row["start_date"].strip()
                        else None
                    ),
                    "end_date": (
                        datetime.strptime(row["end_date"], "%Y-%m-%d").date()
                        if row["end_date"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(relationships)} relationships from CSV")
    return relationships


def upgrade() -> None:
    """Create governance tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating governance tables using SQLAlchemy models...")

    # Create governance schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS governance")
    print("✅ Created governance schema")

    # Create tables using SQLAlchemy models
    ArmsOfGovernment.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created arms_of_government table")

    Institutions.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created institutions table")

    InstitutionRelationships.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created institution_relationships table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "governance", "_seed")

    # Seed arms_of_government
    print("🌱 Seeding arms of government...")
    arms_csv = os.path.join(csv_dir, "arms_of_government.csv")
    if os.path.exists(arms_csv):
        arms = load_arms_of_government_from_csv(arms_csv)

        conn = op.get_bind()
        for arm in arms:
            conn.execute(ArmsOfGovernment.__table__.insert(), arm)

        print(f"✅ Seeded {len(arms)} arms of government")

    # Seed institutions
    print("🌱 Seeding institutions...")
    institutions_csv = os.path.join(csv_dir, "institutions.csv")
    if os.path.exists(institutions_csv):
        institutions = load_institutions_from_csv(institutions_csv)

        conn = op.get_bind()
        institution_lookup = {}

        for institution in institutions:
            conn.execute(Institutions.__table__.insert(), institution)
            institution_lookup[institution["institution_code"]] = institution["id"]

        print(f"✅ Seeded {len(institutions)} institutions")

    # Seed institution relationships
    print("🌱 Seeding institution relationships...")
    relationships_csv = os.path.join(csv_dir, "institution_relationships.csv")
    if os.path.exists(relationships_csv):
        try:
            relationships = load_institution_relationships_from_csv(relationships_csv)
            print(f"📊 Parsed {len(relationships)} relationships from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, relationship in enumerate(relationships, 1):
                try:
                    print(
                        f"💾 Inserting relationship {i}: {relationship['parent_institution_code']} -> {relationship['child_institution_code']}"
                    )
                    conn.execute(
                        InstitutionRelationships.__table__.insert(), relationship
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted relationship {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert relationship {i}: {e}")
                    print(f"   Relationship data: {relationship}")

            print(
                f"📈 Insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            if successful_inserts > 0:
                # Now update foreign key relationships
                print("🔄 Updating foreign key relationships...")

                for i, relationship in enumerate(relationships, 1):
                    parent_code = relationship["parent_institution_code"]
                    child_code = relationship["child_institution_code"]

                    if (
                        parent_code
                        and parent_code.strip()
                        and parent_code in institution_lookup
                        and child_code
                        and child_code.strip()
                        and child_code in institution_lookup
                    ):
                        parent_id = institution_lookup[parent_code]
                        child_id = institution_lookup[child_code]

                        sql = text(
                            """
                            UPDATE governance.institution_relationships 
                            SET parent_institution_id = :parent_id, child_institution_id = :child_id
                            WHERE parent_institution_code = :parent_institution_code AND child_institution_code = :child_institution_code
                            """
                        )
                        try:
                            conn.execute(
                                sql,
                                {
                                    "parent_id": parent_id,
                                    "child_id": child_id,
                                    "parent_institution_code": parent_code,
                                    "child_institution_code": child_code,
                                },
                            )
                            print(
                                f"✅ Updated foreign keys for relationship {i}: {parent_code} -> {child_code}"
                            )
                        except Exception as e:
                            print(
                                f"❌ Failed to update foreign keys for relationship {i}: {e}"
                            )

                print("✅ Updated foreign key relationships")

        except Exception as e:
            print(f"❌ Error during relationships seeding: {e}")
            import traceback

            traceback.print_exc()

    print("🎉 Governance domain migration completed successfully!")


def downgrade() -> None:
    """Remove governance tables and schema using SQLAlchemy models"""
    print("🗑️  Dropping governance tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables using SQLAlchemy models (in reverse order of creation) with error handling
    try:
        InstitutionRelationships.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped institution_relationships table")
    except Exception as e:
        print(f"⚠️  Error dropping institution_relationships (may not exist): {e}")
        conn.rollback()

    try:
        Institutions.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped institutions table")
    except Exception as e:
        print(f"⚠️  Error dropping institutions (may not exist): {e}")
        conn.rollback()

    try:
        ArmsOfGovernment.__table__.drop(op.get_bind(), checkfirst=True)
        print("✅ Dropped arms_of_government table")
    except Exception as e:
        print(f"⚠️  Error dropping arms_of_government (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS governance")
        print("✅ Dropped governance schema")
    except Exception as e:
        print(f"⚠️  Error dropping governance schema (may not exist): {e}")
        conn.rollback()

    print("✅ Governance tables and schema dropped")
