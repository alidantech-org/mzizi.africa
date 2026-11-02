"""Create entities tables and seed data

Revision ID: create_seed_entities_tables
Revises: create_seed_offices_tables
Create Date: 2026-03-22 00:00:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.entities.models import (
    LegalEntities,
    Ownership,
    Profile,
    Location,
    FinanceEntities,
    FinanceEntityLevels,
)

# revision identifiers, used by Alembic.
revision = "create_seed_entities_tables"
down_revision = "create_seed_offices_tables"
branch_labels = None
depends_on = None


def load_legal_entities_from_csv(csv_path: str) -> list:
    """Load legal entities from CSV file"""
    legal_entities = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Legal Entities Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty legal entities row {row_num}")
                continue

            legal_entities.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "entity_code": row["entity_code"],
                    "official_name": row["official_name"],
                    "registration_number": (
                        row["registration_number"]
                        if row["registration_number"].strip()
                        else None
                    ),
                    "tax_pin": row["tax_pin"] if row["tax_pin"].strip() else None,
                    "entity_type": row["entity_type"],
                    "registration_date": (
                        datetime.strptime(row["registration_date"], "%Y-%m-%d").date()
                        if row["registration_date"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "is_verified": row["is_verified"].lower() == "true",
                    "parent_entity_code": (
                        row["parent_entity_code"]
                        if row.get("parent_entity_code")
                        and row["parent_entity_code"].strip()
                        else None
                    ),
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(legal_entities)} legal entities from CSV")
    return legal_entities


def load_ownership_from_csv(csv_path: str) -> list:
    """Load ownership from CSV file"""
    ownership = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Ownership Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty ownership row {row_num}")
                continue

            ownership.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "entity_code": row["entity_code"],
                    "person_code": row["person_code"],
                    "ownership_percentage": (
                        int(row["ownership_percentage"])
                        if row.get("ownership_percentage")
                        and row["ownership_percentage"].strip()
                        else None
                    ),
                    "position": (
                        row["position"]
                        if row.get("position") and row["position"].strip()
                        else None
                    ),
                    "start_date": (
                        datetime.strptime(row["start_date"], "%Y-%m-%d").date()
                        if row.get("start_date") and row["start_date"].strip()
                        else None
                    ),
                    "end_date": (
                        datetime.strptime(row["end_date"], "%Y-%m-%d").date()
                        if row.get("end_date") and row["end_date"].strip()
                        else None
                    ),
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(ownership)} ownership records from CSV")
    return ownership


def load_profiles_from_csv(csv_path: str) -> list:
    """Load profiles from CSV file"""
    profiles = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Profiles Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty profiles row {row_num}")
                continue

            profiles.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "entity_code": row["entity_code"],
                    "logo_url": (
                        row["logo_url"]
                        if row.get("logo_url") and row["logo_url"].strip()
                        else None
                    ),
                    "website_url": (
                        row["website_url"]
                        if row.get("website_url") and row["website_url"].strip()
                        else None
                    ),
                    "hq_address": (
                        row["hq_address"]
                        if row.get("hq_address") and row["hq_address"].strip()
                        else None
                    ),
                    "social_links": (
                        eval(row["social_links"])
                        if row.get("social_links") and row["social_links"].strip()
                        else {}
                    ),
                    "industry_sector": (
                        row["industry_sector"]
                        if row.get("industry_sector") and row["industry_sector"].strip()
                        else None
                    ),
                    "email": (
                        row.get("email")
                        if row.get("email") and row["email"].strip()
                        else None
                    ),
                    "phone": (
                        row.get("phone")
                        if row.get("phone") and row["phone"].strip()
                        else None
                    ),
                    "description": (
                        row.get("description")
                        if row.get("description") and row["description"].strip()
                        else None
                    ),
                    "employee_count": (
                        row.get("employee_count")
                        if row.get("employee_count") and row["employee_count"].strip()
                        else None
                    ),
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(profiles)} profiles from CSV")
    return profiles


def load_locations_from_csv(csv_path: str) -> list:
    """Load locations from CSV file"""
    locations = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Locations Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty locations row {row_num}")
                continue

            locations.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "entity_code": row["entity_code"],
                    "geo_unit_code": row["geo_unit_code"],
                    "location_name": (
                        row["location_name"]
                        if row.get("location_name") and row["location_name"].strip()
                        else None
                    ),
                    "physical_address": (
                        row["physical_address"]
                        if row.get("physical_address")
                        and row["physical_address"].strip()
                        else None
                    ),
                    "location_type": (
                        row["location_type"]
                        if row.get("location_type") and row["location_type"].strip()
                        else None
                    ),
                    "is_main_office": row["is_main_office"].lower() == "true",
                    "contact_info": (
                        eval(row["contact_info"])
                        if row.get("contact_info") and row["contact_info"].strip()
                        else {}
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(locations)} locations from CSV")
    return locations


def load_finance_entities_from_csv(csv_path: str) -> list:
    """Load finance entities from CSV file"""
    finance_entities = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Finance Entities Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty finance entities row {row_num}")
                continue

            finance_entities.append(
                {
                    "id": str(ulid()),
                    "entity_code": row["entity_code"],
                    "name": row["name"],
                    "level_code": row["level_code"],
                    "level_order": (
                        int(row["level_order"])
                        if row.get("level_order") and row["level_order"].strip()
                        else 0
                    ),
                    "parent_code": (
                        row["parent_code"]
                        if row.get("parent_code") and row["parent_code"].strip()
                        else None
                    ),
                    "legal_entity_code": (
                        row["legal_entity_code"]
                        if row.get("legal_entity_code")
                        else None
                    ),
                    "institution_code": (
                        row["institution_code"]
                        if row.get("institution_code")
                        and row["institution_code"].strip()
                        else None
                    ),
                    "geo_unit_code": (
                        row["geo_unit_code"]
                        if row.get("geo_unit_code") and row["geo_unit_code"].strip()
                        else None
                    ),
                }
            )

    print(f"✅ Loaded {len(finance_entities)} finance entities from CSV")
    return finance_entities


def load_finance_entity_levels_from_csv(csv_path: str) -> list:
    """Load finance entity levels from CSV file"""
    finance_entity_levels = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Finance Levels Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty finance levels row {row_num}")
                continue

            finance_entity_levels.append(
                {
                    "id": str(ulid()),
                    "level_code": row["level_code"],
                    "level_name": row["level_name"],
                    "level_order": (
                        int(row["level_order"])
                        if row.get("level_order") and row["level_order"].strip()
                        else 0
                    ),
                    "description": (
                        row["description"]
                        if row.get("description") and row["description"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "geo_level_code": (
                        row["geo_level_code"]
                        if row.get("geo_level_code") and row["geo_level_code"].strip()
                        else None
                    ),
                }
            )

    print(f"✅ Loaded {len(finance_entity_levels)} finance entity levels from CSV")
    return finance_entity_levels


def upgrade() -> None:
    """Create entities tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating entities tables using SQLAlchemy models...")

    # Create entities schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS entities")
    print("✅ Created entities schema")

    # Create PostGIS extension first - handle transaction properly
    print("🌍 Enabling PostGIS extension...")
    try:
        # Try to create extension using op.execute to avoid transaction issues
        op.execute("CREATE EXTENSION IF NOT EXISTS postgis")
        print("✅ PostGIS extension enabled")
    except Exception as e:
        print(f"⚠️  Could not enable PostGIS extension: {e}")
        print("   Spatial features will be disabled")
        # Don't rollback - let migration continue

    # Create tables using SQLAlchemy models
    LegalEntities.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created legal_entities table")

    Ownership.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created ownership table")

    Profile.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created profiles table")

    Location.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created locations table")

    FinanceEntityLevels.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created finance_entity_levels table")

    FinanceEntities.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created finance_entities table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "entities", "_seed")

    # Seed legal entities
    print("🌱 Seeding legal entities...")
    legal_entities_csv = os.path.join(csv_dir, "legal_entities.csv")
    if os.path.exists(legal_entities_csv):
        try:
            legal_entities = load_legal_entities_from_csv(legal_entities_csv)
            print(f"📊 Parsed {len(legal_entities)} legal entities from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, legal_entity in enumerate(legal_entities, 1):
                try:
                    print(
                        f"💾 Inserting legal entity {i}: {legal_entity['entity_code']} - {legal_entity['official_name']}"
                    )
                    conn.execute(LegalEntities.__table__.insert(), legal_entity)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted legal entity {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert legal entity {i}: {e}")
                    print(f"   Legal entity data: {legal_entity}")

            print(
                f"📈 Legal entities insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Legal entities data completed")

        except Exception as e:
            print(f"❌ Error loading legal entities CSV: {e}")
    else:
        print(f"⚠️  Legal entities CSV file not found: {legal_entities_csv}")

    # Seed ownership
    print("🌱 Seeding ownership...")
    ownership_csv = os.path.join(csv_dir, "ownership.csv")
    if os.path.exists(ownership_csv):
        try:
            ownership = load_ownership_from_csv(ownership_csv)
            print(f"📊 Parsed {len(ownership)} ownership records from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # First, create lookups for foreign key relationships
            entity_lookup = {}
            result = conn.execute(
                text("SELECT id, entity_code FROM entities.legal_entities")
            )
            for row in result:
                entity_lookup[row[1]] = row[0]  # entity_code -> id mapping

            person_lookup = {}
            result = conn.execute(text("SELECT id, person_code FROM people.people"))
            for row in result:
                person_lookup[row[1]] = row[0]  # person_code -> id mapping

            for i, ownership_record in enumerate(ownership, 1):
                try:
                    # Lookup foreign key IDs using codes
                    entity_code = ownership_record["entity_code"]
                    person_code = ownership_record["person_code"]

                    if entity_code not in entity_lookup:
                        print(f"⚠️  Entity code {entity_code} not found in database")
                        continue

                    if person_code not in person_lookup:
                        print(f"⚠️  Person code {person_code} not found in database")
                        continue

                    ownership_record["entity_id"] = entity_lookup[entity_code]
                    ownership_record["person_id"] = person_lookup[person_code]

                    print(f"💾 Inserting ownership {i}: {person_code} → {entity_code}")
                    conn.execute(Ownership.__table__.insert(), ownership_record)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted ownership {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert ownership {i}: {e}")
                    print(f"   Ownership data: {ownership_record}")

            print(
                f"📈 Ownership insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Ownership data completed")

        except Exception as e:
            print(f"❌ Error loading ownership CSV: {e}")
    else:
        print(f"⚠️  Ownership CSV file not found: {ownership_csv}")

    # Seed profiles
    print("🌱 Seeding profiles...")
    profiles_csv = os.path.join(csv_dir, "profiles.csv")
    if os.path.exists(profiles_csv):
        try:
            profiles = load_profiles_from_csv(profiles_csv)
            print(f"📊 Parsed {len(profiles)} profiles from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # First, create a lookup for entity IDs by entity_code
            entity_lookup = {}
            result = conn.execute(
                text("SELECT id, entity_code FROM entities.legal_entities")
            )
            for row in result:
                entity_lookup[row[1]] = row[0]  # entity_code -> id mapping

            for i, profile in enumerate(profiles, 1):
                try:
                    # Lookup foreign key ID using entity_code
                    entity_code = profile["entity_code"]

                    if entity_code not in entity_lookup:
                        print(f"⚠️  Entity code {entity_code} not found in database")
                        continue

                    profile["entity_id"] = entity_lookup[entity_code]

                    print(f"💾 Inserting profile {i}: {entity_code}")
                    conn.execute(Profile.__table__.insert(), profile)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted profile {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert profile {i}: {e}")
                    print(f"   Profile data: {profile}")

            print(
                f"📈 Profiles insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Profiles data completed")

        except Exception as e:
            print(f"❌ Error loading profiles CSV: {e}")
    else:
        print(f"⚠️  Profiles CSV file not found: {profiles_csv}")

    # Seed locations
    print("🌱 Seeding locations...")
    locations_csv = os.path.join(csv_dir, "locations.csv")
    if os.path.exists(locations_csv):
        try:
            locations = load_locations_from_csv(locations_csv)
            print(f"📊 Parsed {len(locations)} locations from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # First, create lookups for foreign key relationships
            entity_lookup = {}
            result = conn.execute(
                text("SELECT id, entity_code FROM entities.legal_entities")
            )
            for row in result:
                entity_lookup[row[1]] = row[0]  # entity_code -> id mapping

            geo_unit_lookup = {}
            result = conn.execute(
                text("SELECT id, geo_unit_code FROM geographic.geo_units")
            )
            for row in result:
                geo_unit_lookup[row[1]] = row[0]  # geo_unit_code -> id mapping

            for i, location in enumerate(locations, 1):
                try:
                    # Lookup foreign key IDs using codes
                    entity_code = location["entity_code"]
                    geo_unit_code = location["geo_unit_code"]

                    if entity_code not in entity_lookup:
                        print(f"⚠️  Entity code {entity_code} not found in database")
                        continue

                    if geo_unit_code not in geo_unit_lookup:
                        print(f"⚠️  Geo unit code {geo_unit_code} not found in database")
                        continue

                    location["entity_id"] = entity_lookup[entity_code]
                    location["geo_unit_id"] = geo_unit_lookup[geo_unit_code]

                    print(f"💾 Inserting location {i}: {entity_code} → {geo_unit_code}")
                    conn.execute(Location.__table__.insert(), location)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted location {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert location {i}: {e}")
                    print(f"   Location data: {location}")

            print(
                f"📈 Locations insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Locations data completed")

        except Exception as e:
            print(f"❌ Error loading locations CSV: {e}")
    else:
        print(f"⚠️  Locations CSV file not found: {locations_csv}")

    # Seed finance entities
    print("🌱 Seeding finance entities...")
    finance_entities_csv = os.path.join(csv_dir, "finance_entities.csv")
    if os.path.exists(finance_entities_csv):
        try:
            finance_entities = load_finance_entities_from_csv(finance_entities_csv)
            print(f"📊 Parsed {len(finance_entities)} finance entities from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # Create lookups for foreign key relationships
            institution_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, institution_code FROM governance.institutions")
                )
                for row in result:
                    institution_lookup[row[1]] = row[
                        0
                    ]  # institution_code -> id mapping
                print(
                    f"✅ Built institution lookup with {len(institution_lookup)} entries"
                )
            except Exception as e:
                print(f"⚠️  Could not build institution lookup: {e}")

            finance_entity_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, entity_code FROM entities.finance_entities")
                )
                for row in result:
                    finance_entity_lookup[row[1]] = row[0]  # entity_code -> id mapping
                print(
                    f"✅ Built finance entity lookup with {len(finance_entity_lookup)} entries"
                )
            except Exception as e:
                print(f"⚠️  Could not build finance entity lookup: {e}")

            legal_entity_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, entity_code FROM entities.legal_entities")
                )
                for row in result:
                    legal_entity_lookup[row[1]] = row[0]  # entity_code -> id mapping
                print(
                    f"✅ Built legal entity lookup with {len(legal_entity_lookup)} entries"
                )
            except Exception as e:
                print(f"⚠️  Could not build legal entity lookup: {e}")

            geo_unit_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, geo_unit_code FROM geographic.geo_units")
                )
                for row in result:
                    geo_unit_lookup[row[1]] = row[0]  # geo_unit_code -> id mapping
                print(f"✅ Built geo unit lookup with {len(geo_unit_lookup)} entries")
            except Exception as e:
                print(f"⚠️  Could not build geo unit lookup: {e}")

            for i, finance_entity in enumerate(finance_entities, 1):
                try:
                    # Lookup foreign key IDs using codes
                    institution_code = finance_entity.get("institution_code")
                    parent_code = finance_entity.get("parent_code")
                    legal_entity_code = finance_entity.get("legal_entity_code")
                    geo_unit_code = finance_entity.get("geo_unit_code")

                    # Resolve institution_id from institution_code
                    if institution_code and institution_code not in institution_lookup:
                        print(
                            f"⚠️  Institution code {institution_code} not found in database"
                        )
                        continue

                    if institution_code:
                        finance_entity["institution_id"] = institution_lookup[
                            institution_code
                        ]

                    # Resolve parent_id from parent_code (self-referencing)
                    if parent_code and parent_code not in finance_entity_lookup:
                        print(
                            f"⚠️  Parent finance entity code {parent_code} not found in database"
                        )
                        continue

                    if parent_code:
                        finance_entity["parent_id"] = finance_entity_lookup[parent_code]

                    # Resolve legal_entity_id from legal_entity_code
                    if legal_entity_code and legal_entity_code.strip():
                        if legal_entity_code in legal_entity_lookup:
                            finance_entity["legal_entity_id"] = legal_entity_lookup[
                                legal_entity_code
                            ]
                        else:
                            print(
                                f"⚠️  Legal entity code {legal_entity_code} not found in database"
                            )
                            continue

                    # Resolve geo_unit_id from geo_unit_code
                    if geo_unit_code and geo_unit_code.strip():
                        if geo_unit_code in geo_unit_lookup:
                            finance_entity["geo_unit_id"] = geo_unit_lookup[
                                geo_unit_code
                            ]
                        else:
                            print(
                                f"⚠️  Geo unit code {geo_unit_code} not found in database"
                            )
                            continue

                    print(f"💾 Inserting finance entity {i}: {finance_entity['name']}")
                    conn.execute(FinanceEntities.__table__.insert(), finance_entity)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted finance entity {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert finance entity {i}: {e}")
                    print(f"   Finance entity data: {finance_entity}")

            print(
                f"📈 Finance entities insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Finance entities data completed")

        except Exception as e:
            print(f"❌ Error loading finance entities CSV: {e}")
    else:
        print(f"⚠️  Finance entities CSV file not found: {finance_entities_csv}")

    # Seed finance entity levels
    print("🌱 Seeding finance entity levels...")
    finance_entity_levels_csv = os.path.join(csv_dir, "finance_entity_levels.csv")
    if os.path.exists(finance_entity_levels_csv):
        try:
            finance_entity_levels = load_finance_entity_levels_from_csv(
                finance_entity_levels_csv
            )
            print(
                f"📊 Parsed {len(finance_entity_levels)} finance entity levels from CSV"
            )

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # Create lookup for geographic levels
            geo_level_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, geo_level_code FROM geographic.geo_levels")
                )
                for row in result:
                    geo_level_lookup[row[1]] = row[0]  # geo_level_code -> id mapping
                print(f"✅ Built geo level lookup with {len(geo_level_lookup)} entries")
            except Exception as e:
                print(f"⚠️  Could not build geo level lookup: {e}")

            for i, finance_entity_level in enumerate(finance_entity_levels, 1):
                try:
                    # Resolve geo_level_id from geo_level_code
                    geo_level_code = finance_entity_level.get("geo_level_code")
                    if geo_level_code and geo_level_code.strip():
                        if geo_level_code in geo_level_lookup:
                            finance_entity_level["geo_level_id"] = geo_level_lookup[
                                geo_level_code
                            ]
                        else:
                            print(
                                f"⚠️  Geo level code {geo_level_code} not found in database"
                            )
                            continue

                    print(
                        f"💾 Inserting finance entity level {i}: {finance_entity_level['level_name']}"
                    )
                    conn.execute(
                        FinanceEntityLevels.__table__.insert(), finance_entity_level
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted finance entity level {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert finance entity level {i}: {e}")
                    print(f"   Finance entity level data: {finance_entity_level}")

            print(
                f"📈 Finance entity levels insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Finance entity levels data completed")

        except Exception as e:
            print(f"❌ Error loading finance entity levels CSV: {e}")
    else:
        print(
            f"⚠️  Finance entity levels CSV file not found: {finance_entity_levels_csv}"
        )

    print("✅ Entities tables seeding completed!")


def downgrade() -> None:
    """Remove entities tables and data"""
    print("🗑️  Removing entities tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables in reverse order of creation with error handling
    try:
        op.execute("DROP TABLE IF EXISTS entities.locations CASCADE")
        print("✅ Dropped locations table")
    except Exception as e:
        print(f"⚠️  Error dropping locations (may not exist): {e}")
        # Reset transaction state
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS entities.profiles CASCADE")
        print("✅ Dropped profiles table")
    except Exception as e:
        print(f"⚠️  Error dropping profiles (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS entities.ownership CASCADE")
        print("✅ Dropped ownership table")
    except Exception as e:
        print(f"⚠️  Error dropping ownership (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS entities.legal_entities CASCADE")
        print("✅ Dropped legal_entities table")
    except Exception as e:
        print(f"⚠️  Error dropping legal_entities (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS entities.finance_entities CASCADE")
        print("✅ Dropped finance_entities table")
    except Exception as e:
        print(f"⚠️  Error dropping finance_entities (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TABLE IF EXISTS entities.finance_entity_levels CASCADE")
        print("✅ Dropped finance_entity_levels table")
    except Exception as e:
        print(f"⚠️  Error dropping finance_entity_levels (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS entities CASCADE")
        print("✅ Dropped entities schema")
    except Exception as e:
        print(f"⚠️  Error dropping entities schema (may not exist): {e}")
        conn.rollback()

    print("✅ Entities tables downgrade completed!")
