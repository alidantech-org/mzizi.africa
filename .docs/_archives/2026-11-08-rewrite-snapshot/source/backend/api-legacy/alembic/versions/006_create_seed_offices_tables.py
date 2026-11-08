"""Create offices tables and seed data

Revision ID: create_seed_offices_tables
Revises: create_seed_people_tables
Create Date: 2026-03-22 00:00:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.offices.models import (
    Offices,
    SelectionMethods,
    SelectionRules,
    Holders,
)

# revision identifiers, used by Alembic.
revision = "create_seed_offices_tables"
down_revision = "create_seed_people_tables"
branch_labels = None
depends_on = None


def load_selection_methods_from_csv(csv_path: str) -> list:
    """Load selection methods from CSV file"""
    selection_methods = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Selection Methods Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty selection methods row {row_num}")
                continue

            selection_methods.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "selection_method_code": row["selection_method_code"],
                    "name": row["name"],
                    "description": (
                        row["description"] if row["description"].strip() else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(selection_methods)} selection methods from CSV")
    return selection_methods


def load_offices_from_csv(csv_path: str) -> list:
    """Load offices from CSV file"""
    offices = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Offices Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty offices row {row_num}")
                continue

            offices.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "office_code": row["office_code"],
                    "title": row["title"],
                    "institution_code": row["institution_code"],
                    "parent_office_code": (
                        row["parent_office_code"]
                        if row["parent_office_code"].strip()
                        else None
                    ),
                    "is_singleton": row["is_singleton"].lower() == "true",
                    "max_terms": (
                        int(row["max_terms"]) if row["max_terms"].strip() else None
                    ),
                    "term_duration_years": (
                        int(row["term_duration_years"])
                        if row["term_duration_years"].strip()
                        else None
                    ),
                    "retirement_age": (
                        int(row["retirement_age"])
                        if row["retirement_age"].strip()
                        else None
                    ),
                    "description": (
                        row["description"] if row["description"].strip() else None
                    ),
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(offices)} offices from CSV")
    return offices


def load_selection_rules_from_csv(csv_path: str) -> list:
    """Load selection rules from CSV file"""
    selection_rules = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Selection Rules Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty selection rules row {row_num}")
                continue

            selection_rules.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "office_code": row["office_code"],
                    "selection_method_code": row["selection_method_code"],
                    "appointing_institution_code": row["appointing_institution_code"],
                    "appointing_office_code": (
                        row["appointing_office_code"]
                        if row["appointing_office_code"].strip()
                        else None
                    ),
                    "is_ex_officio": row["is_ex_officio"].lower() == "true",
                    "description": (
                        row["description"] if row["description"].strip() else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(selection_rules)} selection rules from CSV")
    return selection_rules


def load_holders_from_csv(csv_path: str) -> list:
    """Load holders from CSV file"""
    holders = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Holders Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty holders row {row_num}")
                continue

            holders.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "office_code": row["office_code"],
                    "person_code": row["person_code"],
                    "geo_unit_code": row["geo_unit_code"],
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
                    "term_number": (
                        int(row["term_number"]) if row["term_number"].strip() else None
                    ),
                    "departure_reason": (
                        row["departure_reason"]
                        if row["departure_reason"].strip()
                        else None
                    ),
                    "is_current": row["is_current"].lower() == "true",
                    "status": row["status"] if row["status"].strip() else None,
                    "is_active": row["is_active"].lower() == "true",
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(holders)} holders from CSV")
    return holders


def upgrade() -> None:
    """Create offices tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating offices tables using SQLAlchemy models...")

    # Create offices schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS offices")
    print("✅ Created offices schema")

    # Create tables using SQLAlchemy models
    SelectionMethods.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created selection_methods table")

    Offices.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created offices table")

    SelectionRules.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created selection_rules table")

    Holders.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created holders table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "offices", "_seed")

    # Seed selection methods
    print("🌱 Seeding selection methods...")
    selection_methods_csv = os.path.join(csv_dir, "selection_methods.csv")
    if os.path.exists(selection_methods_csv):
        try:
            selection_methods = load_selection_methods_from_csv(selection_methods_csv)
            print(f"📊 Parsed {len(selection_methods)} selection methods from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, selection_method in enumerate(selection_methods, 1):
                try:
                    print(
                        f"💾 Inserting selection method {i}: {selection_method['selection_method_code']} - {selection_method['name']}"
                    )
                    conn.execute(SelectionMethods.__table__.insert(), selection_method)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted selection method {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert selection method {i}: {e}")
                    print(f"   Selection method data: {selection_method}")

            print(
                f"📈 Selection methods insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading selection methods CSV: {e}")
    else:
        print(f"⚠️  Selection methods CSV file not found: {selection_methods_csv}")

    # Seed offices
    print("🌱 Seeding offices...")
    offices_csv = os.path.join(csv_dir, "offices.csv")
    if os.path.exists(offices_csv):
        try:
            offices = load_offices_from_csv(offices_csv)
            print(f"📊 Parsed {len(offices)} offices from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # Create lookup for institution foreign key relationships
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

            # Create lookup for parent office relationships
            office_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, office_code FROM offices.offices")
                )
                for row in result:
                    office_lookup[row[1]] = row[0]  # office_code -> id mapping
                print(f"✅ Built office lookup with {len(office_lookup)} entries")
            except Exception as e:
                print(f"⚠️  Could not build office lookup: {e}")

            for i, office in enumerate(offices, 1):
                try:
                    # Lookup foreign key IDs using codes
                    institution_code = office["institution_code"]
                    parent_office_code = office["parent_office_code"]

                    if institution_code and institution_code not in institution_lookup:
                        print(
                            f"⚠️  Institution code {institution_code} not found in database"
                        )
                        continue

                    if parent_office_code and parent_office_code not in office_lookup:
                        print(
                            f"⚠️  Parent office code {parent_office_code} not found in database"
                        )
                        continue

                    # Add foreign key IDs to office record
                    if institution_code:
                        office["institution_id"] = institution_lookup[institution_code]

                    if parent_office_code:
                        office["parent_office_id"] = office_lookup[parent_office_code]

                    print(
                        f"💾 Inserting office {i}: {office['office_code']} - {office['title']}"
                    )
                    conn.execute(Offices.__table__.insert(), office)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted office {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert office {i}: {e}")
                    print(f"   Office data: {office}")

            print(
                f"📈 Offices insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading offices CSV: {e}")
    else:
        print(f"⚠️  Offices CSV file not found: {offices_csv}")

    # Seed selection rules
    print("🌱 Seeding selection rules...")
    selection_rules_csv = os.path.join(csv_dir, "selection_rules.csv")
    if os.path.exists(selection_rules_csv):
        try:
            selection_rules = load_selection_rules_from_csv(selection_rules_csv)
            print(f"📊 Parsed {len(selection_rules)} selection rules from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # Create lookups for foreign key relationships
            office_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, office_code FROM offices.offices")
                )
                for row in result:
                    office_lookup[row[1]] = row[0]  # office_code -> id mapping
                print(f"✅ Built office lookup with {len(office_lookup)} entries")
            except Exception as e:
                print(f"⚠️  Could not build office lookup: {e}")

            selection_method_lookup = {}
            try:
                result = conn.execute(
                    text(
                        "SELECT id, selection_method_code FROM offices.selection_methods"
                    )
                )
                for row in result:
                    selection_method_lookup[row[1]] = row[
                        0
                    ]  # selection_method_code -> id mapping
                print(
                    f"✅ Built selection method lookup with {len(selection_method_lookup)} entries"
                )
            except Exception as e:
                print(f"⚠️  Could not build selection method lookup: {e}")

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

            appointing_office_lookup = {}
            try:
                result = conn.execute(
                    text("SELECT id, office_code FROM offices.offices")
                )
                for row in result:
                    appointing_office_lookup[row[1]] = row[
                        0
                    ]  # office_code -> id mapping
                print(
                    f"✅ Built appointing office lookup with {len(appointing_office_lookup)} entries"
                )
            except Exception as e:
                print(f"⚠️  Could not build appointing office lookup: {e}")

            for i, selection_rule in enumerate(selection_rules, 1):
                try:
                    # Lookup foreign key IDs using codes
                    office_code = selection_rule["office_code"]
                    selection_method_code = selection_rule["selection_method_code"]
                    appointing_institution_code = selection_rule[
                        "appointing_institution_code"
                    ]
                    appointing_office_code = selection_rule["appointing_office_code"]

                    if office_code not in office_lookup:
                        print(f"⚠️  Office code {office_code} not found in database")
                        continue

                    if selection_method_code not in selection_method_lookup:
                        print(
                            f"⚠️  Selection method code {selection_method_code} not found in database"
                        )
                        continue

                    if (
                        appointing_institution_code
                        and appointing_institution_code not in institution_lookup
                    ):
                        print(
                            f"⚠️  Appointing institution code {appointing_institution_code} not found in database"
                        )
                        continue

                    if (
                        appointing_office_code
                        and appointing_office_code not in appointing_office_lookup
                    ):
                        print(
                            f"⚠️  Appointing office code {appointing_office_code} not found in database"
                        )
                        continue

                    # Add foreign key IDs to selection rule record
                    selection_rule["office_id"] = office_lookup[office_code]
                    selection_rule["selection_method_id"] = selection_method_lookup[
                        selection_method_code
                    ]

                    if appointing_institution_code:
                        selection_rule["appointing_institution_id"] = (
                            institution_lookup[appointing_institution_code]
                        )

                    if appointing_office_code:
                        selection_rule["appointing_office_id"] = (
                            appointing_office_lookup[appointing_office_code]
                        )

                    print(
                        f"💾 Inserting selection rule {i}: {selection_rule['office_code']} -> {selection_rule['selection_method_code']}"
                    )
                    conn.execute(SelectionRules.__table__.insert(), selection_rule)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted selection rule {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert selection rule {i}: {e}")
                    print(f"   Selection rule data: {selection_rule}")

            print(
                f"📈 Selection rules insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading selection rules CSV: {e}")
    else:
        print(f"⚠️  Selection rules CSV file not found: {selection_rules_csv}")

    # Seed holders
    print("🌱 Seeding holders...")
    holders_csv = os.path.join(csv_dir, "holders.csv")
    if os.path.exists(holders_csv):
        try:
            holders = load_holders_from_csv(holders_csv)
            print(f"📊 Parsed {len(holders)} holders from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            # First, create lookups for foreign key relationships
            office_lookup = {}
            result = conn.execute(text("SELECT id, office_code FROM offices.offices"))
            for row in result:
                office_lookup[row[1]] = row[0]  # office_code -> id mapping

            person_lookup = {}
            result = conn.execute(text("SELECT id, person_code FROM people.people"))
            for row in result:
                person_lookup[row[1]] = row[0]  # person_code -> id mapping

            geo_unit_lookup = {}
            result = conn.execute(
                text("SELECT id, geo_unit_code FROM geographic.geo_units")
            )
            for row in result:
                geo_unit_lookup[row[1]] = row[0]  # geo_unit_code -> id mapping

            for i, holder in enumerate(holders, 1):
                try:
                    # Lookup foreign key IDs using codes
                    office_code = holder["office_code"]
                    person_code = holder["person_code"]
                    geo_unit_code = holder["geo_unit_code"]

                    if office_code not in office_lookup:
                        print(f"⚠️  Office code {office_code} not found in database")
                        continue

                    if person_code not in person_lookup:
                        print(f"⚠️  Person code {person_code} not found in database")
                        continue

                    if geo_unit_code not in geo_unit_lookup:
                        print(f"⚠️  Geo unit code {geo_unit_code} not found in database")
                        continue

                    holder["office_id"] = office_lookup[office_code]
                    holder["person_id"] = person_lookup[person_code]
                    holder["geo_unit_id"] = geo_unit_lookup[geo_unit_code]

                    print(
                        f"💾 Inserting holder {i}: {person_code} -> {office_code} in {geo_unit_code}"
                    )
                    conn.execute(Holders.__table__.insert(), holder)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted holder {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert holder {i}: {e}")
                    print(f"   Holder data: {holder}")

            print(
                f"📈 Holders insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading holders CSV: {e}")
    else:
        print(f"⚠️  Holders CSV file not found: {holders_csv}")

    print("✅ Offices tables seeding completed!")


def downgrade() -> None:
    """Remove offices tables and data"""
    print("🗑️  Removing offices tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables in reverse order of creation with error handling
    try:
        op.drop_table("holders", schema="offices")
        print("✅ Dropped holders table")
    except Exception as e:
        print(f"⚠️  Error dropping holders (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("selection_rules", schema="offices")
        print("✅ Dropped selection_rules table")
    except Exception as e:
        print(f"⚠️  Error dropping selection_rules (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("offices", schema="offices")
        print("✅ Dropped offices table")
    except Exception as e:
        print(f"⚠️  Error dropping offices (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("selection_methods", schema="offices")
        print("✅ Dropped selection_methods table")
    except Exception as e:
        print(f"⚠️  Error dropping selection_methods (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS offices CASCADE")
        print("✅ Dropped offices schema")
    except Exception as e:
        print(f"⚠️  Error dropping offices schema (may not exist): {e}")
        conn.rollback()

    print("✅ Offices tables downgrade completed!")
