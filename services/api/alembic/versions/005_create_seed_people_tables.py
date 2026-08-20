"""Create people tables and seed data

Revision ID: create_seed_people_tables
Revises: create_seed_governance_tables
Create Date: 2026-03-22 00:00:00.000000

"""

from alembic import op
from sqlalchemy.sql import text
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.people.models import (
    People,
    Profile,
)

# revision identifiers, used by Alembic.
revision = "create_seed_people_tables"
down_revision = "create_seed_governance_tables"
branch_labels = None
depends_on = None


def load_people_from_csv(csv_path: str) -> list:
    """Load people from CSV file"""
    people = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 People Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty people row {row_num}")
                continue

            people.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "person_code": row["person_code"],
                    "full_name": row["full_name"],
                    "alternate_names": (
                        eval(row["alternate_names"])
                        if row["alternate_names"].strip()
                        else []
                    ),
                    "title_prefix": (
                        row["title_prefix"] if row["title_prefix"].strip() else None
                    ),
                    "title_suffix": (
                        row["title_suffix"] if row["title_suffix"].strip() else None
                    ),
                    "gender": row["gender"] if row["gender"].strip() else None,
                    "is_pwd": row["is_pwd"].lower() == "true",
                    "search_vector": (
                        row["search_vector"] if row["search_vector"].strip() else None
                    ),
                    "status": row["status"],
                    "date_of_birth": (
                        datetime.strptime(row["date_of_birth"], "%Y-%m-%d").date()
                        if row["date_of_birth"].strip()
                        else None
                    ),
                    "date_of_death": (
                        datetime.strptime(row["date_of_death"], "%Y-%m-%d").date()
                        if row["date_of_death"].strip()
                        else None
                    ),
                    "place_of_birth": (
                        row["place_of_birth"] if row["place_of_birth"].strip() else None
                    ),
                    "status_source_url": (
                        row["status_source_url"]
                        if row["status_source_url"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                    "last_verified_at": (
                        datetime.strptime(row["last_verified_at"], "%Y-%m-%dT%H:%M:%SZ")
                        if row["last_verified_at"].strip()
                        else None
                    ),
                    "created_at": (
                        datetime.strptime(row["created_at"], "%Y-%m-%dT%H:%M:%SZ")
                        if row["created_at"].strip()
                        else current_time
                    ),
                    "updated_at": (
                        datetime.strptime(row["updated_at"], "%Y-%m-%dT%H:%M:%SZ")
                        if row["updated_at"].strip()
                        else current_time
                    ),
                }
            )

    print(f"✅ Loaded {len(people)} people from CSV")
    return people


def load_profiles_from_csv(csv_path: str) -> list:
    """Load profiles from CSV file"""
    profiles = []
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Profile Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty profile row {row_num}")
                continue

            profiles.append(
                {
                    "id": str(ulid()),  # Add ULID ID
                    "person_code": row[
                        "person_code"
                    ],  # Will be used to lookup person_id
                    "avatar_url": (
                        row["avatar_url"] if row["avatar_url"].strip() else None
                    ),
                    "bio": row["bio"] if row["bio"].strip() else None,
                    "social_links": (
                        eval(row["social_links"]) if row["social_links"].strip() else {}
                    ),
                    "education": {},  # Default empty
                    "career_history": {},  # Default empty
                    "email": None,  # Default empty
                    "phone": None,  # Default empty
                    "website": None,  # Default empty
                    "created_at": current_time,
                    "updated_at": current_time,
                }
            )

    print(f"✅ Loaded {len(profiles)} profiles from CSV")
    return profiles


def upgrade() -> None:
    """Create people tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating people tables using SQLAlchemy models...")

    # Create people schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS people")
    print("✅ Created people schema")

    # Create tables using SQLAlchemy models
    People.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created people table")

    Profile.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created profiles table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "people", "_seed")

    # Seed people
    print("🌱 Seeding people...")
    people_csv = os.path.join(csv_dir, "people.csv")
    if os.path.exists(people_csv):
        try:
            people = load_people_from_csv(people_csv)
            print(f"📊 Parsed {len(people)} people from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, person in enumerate(people, 1):
                try:
                    print(
                        f"💾 Inserting person {i}: {person['person_code']} - {person['full_name']}"
                    )
                    conn.execute(People.__table__.insert(), person)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted person {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert person {i}: {e}")
                    print(f"   Person data: {person}")

            print(
                f"📈 Insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading people CSV: {e}")
    else:
        print(f"⚠️  People CSV file not found: {people_csv}")

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

            # First, create a lookup for person IDs by person_code
            people_lookup = {}
            result = conn.execute(text("SELECT id, person_code FROM people.people"))
            for row in result:
                people_lookup[row[1]] = row[0]  # person_code -> id mapping

            for i, profile in enumerate(profiles, 1):
                try:
                    # Lookup person_id using person_code
                    person_code = profile["person_code"]
                    if person_code not in people_lookup:
                        print(f"⚠️  Person code {person_code} not found in database")
                        continue

                    profile["person_id"] = people_lookup[person_code]
                    # Remove person_code as it's not a column in the profiles table
                    profile_data = {
                        k: v for k, v in profile.items() if k != "person_code"
                    }

                    print(f"💾 Inserting profile {i}: {person_code}")
                    conn.execute(Profile.__table__.insert(), profile_data)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted profile {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert profile {i}: {e}")
                    print(f"   Profile data: {profile}")

            print(
                f"📈 Profile insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading profiles CSV: {e}")
    else:
        print(f"⚠️  Profiles CSV file not found: {profiles_csv}")

    print("✅ People tables seeding completed!")


def downgrade() -> None:
    """Remove people tables and data"""
    print("🗑️  Removing people tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables with error handling
    try:
        op.drop_table("profiles", schema="people")
        print("✅ Dropped profiles table")
    except Exception as e:
        print(f"⚠️  Error dropping profiles (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("people", schema="people")
        print("✅ Dropped people table")
    except Exception as e:
        print(f"⚠️  Error dropping people (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS people CASCADE")
        print("✅ Dropped people schema")
    except Exception as e:
        print(f"⚠️  Error dropping people schema (may not exist): {e}")
        conn.rollback()

    print("✅ People tables downgrade completed!")
