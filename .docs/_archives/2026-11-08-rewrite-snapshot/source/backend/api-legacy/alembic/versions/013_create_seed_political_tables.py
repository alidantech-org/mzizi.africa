"""Create political parties tables and seed data

Revision ID: create_seed_political_tables
Revises: create_seed_statistics_tables
Create Date: 2026-03-22 23:45:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
from datetime import datetime, date
from ulid import ulid
from sqlalchemy import text

# Import SQLAlchemy models for table creation
from app.routes.political.models import Parties, PartyStructure, PartyPositions, PartyIdeology, PartyMembership, PartyPositionHolders

# revision identifiers, used by Alembic.
revision = "create_seed_political_tables"
down_revision = "create_seed_statistics_tables"
branch_labels = None
depends_on = None


def resolve_geo_unit_id(geo_unit_code: str, conn) -> Optional[str]:
    """Resolve geo unit ID from geo unit code"""
    if not geo_unit_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM geographic.geo_units WHERE geo_unit_code = :code"),
            {"code": geo_unit_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve geo unit code '{geo_unit_code}': {e}")
        return None


def resolve_party_id(party_code: str, conn) -> Optional[str]:
    """Resolve party ID from party code"""
    if not party_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM political.parties WHERE party_code = :code"),
            {"code": party_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve party code '{party_code}': {e}")
        return None


def resolve_party_structure_id(unit_code: str, conn) -> Optional[str]:
    """Resolve party structure ID from unit code"""
    if not unit_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM political.party_structure WHERE unit_code = :code"),
            {"code": unit_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve party structure unit code '{unit_code}': {e}")
        return None


def resolve_party_position_id(position_code: str, conn) -> Optional[str]:
    """Resolve party position ID from position code"""
    if not position_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM political.party_positions WHERE position_code = :code"),
            {"code": position_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve party position code '{position_code}': {e}")
        return None


def resolve_person_id(person_code: str, conn) -> Optional[str]:
    """Resolve person ID from person code"""
    if not person_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM people.people WHERE person_code = :code"),
            {"code": person_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve person code '{person_code}': {e}")
        return None


def parse_date(date_str: str) -> Optional[date]:
    """Parse date string safely"""
    if not date_str or date_str.strip() == "":
        return None
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        print(f"⚠️  Invalid date format: {date_str}")
        return None


def parse_boolean(bool_str: str) -> Optional[bool]:
    """Parse boolean string safely"""
    if not bool_str or bool_str.strip() == "":
        return None
    return bool_str.strip().lower() in ("true", "1", "yes")


def load_parties_from_csv(csv_path: str, conn) -> list:
    """Load parties from CSV file"""
    parties = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)

            party_data = {
                "id": str(ulid()),
                "party_code": row["party_code"],
                "geo_unit_id": geo_unit_id,
                "geo_unit_code": row["geo_unit_code"],
                "name": row["name"],
                "abbreviation": row["abbreviation"],
                "symbol_url": row.get("symbol_url", ""),
                "founded_date": parse_date(row["founded_date"]),
                "dissolved_date": parse_date(row["dissolved_date"]),
                "status": row["status"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            parties.append(party_data)

    return parties


def load_party_structure_from_csv(csv_path: str, conn) -> list:
    """Load party structure from CSV file"""
    structures = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            party_id = resolve_party_id(row["party_code"], conn)
            parent_unit_id = resolve_party_structure_id(row["parent_unit_code"], conn) if row["parent_unit_code"] else None

            structure_data = {
                "id": str(ulid()),
                "party_id": party_id,
                "parent_unit_id": parent_unit_id,
                "party_code": row["party_code"],
                "parent_unit_code": row["parent_unit_code"],
                "unit_code": row["unit_code"],
                "name": row["name"],
                "level": row["level"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            structures.append(structure_data)

    return structures


def load_party_positions_from_csv(csv_path: str, conn) -> list:
    """Load party positions from CSV file"""
    positions = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            party_id = resolve_party_id(row["party_code"], conn)
            unit_id = resolve_party_structure_id(row["unit_code"], conn) if row["unit_code"] else None

            position_data = {
                "id": str(ulid()),
                "party_id": party_id,
                "unit_id": unit_id,
                "party_code": row["party_code"],
                "unit_code": row["unit_code"],
                "position_code": row["position_code"],
                "name": row["name"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            positions.append(position_data)

    return positions


def load_party_ideology_from_csv(csv_path: str, conn) -> list:
    """Load party ideology from CSV file"""
    ideologies = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            party_id = resolve_party_id(row["party_code"], conn)

            ideology_data = {
                "id": str(ulid()),
                "party_id": party_id,
                "party_code": row["party_code"],
                "ideology_code": row["ideology_code"],
                "description": row["description"],
                "valid_from": parse_date(row["valid_from"]),
                "valid_to": parse_date(row["valid_to"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            ideologies.append(ideology_data)

    return ideologies


def load_party_membership_from_csv(csv_path: str, conn) -> list:
    """Load party membership from CSV file"""
    memberships = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            person_id = resolve_person_id(row["person_code"], conn)
            party_id = resolve_party_id(row["party_code"], conn)

            membership_data = {
                "id": str(ulid()),
                "person_id": person_id,
                "party_id": party_id,
                "person_code": row["person_code"],
                "party_code": row["party_code"],
                "membership_type": row["membership_type"],
                "role_title": row["role_title"],
                "valid_from": parse_date(row["valid_from"]),
                "valid_to": parse_date(row["valid_to"]),
                "is_active": parse_boolean(row["is_active"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            memberships.append(membership_data)

    return memberships


def load_party_position_holders_from_csv(csv_path: str, conn) -> list:
    """Load party position holders from CSV file"""
    holders = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            position_id = resolve_party_position_id(row["position_code"], conn)
            person_id = resolve_person_id(row["person_code"], conn)

            holder_data = {
                "id": str(ulid()),
                "position_id": position_id,
                "person_id": person_id,
                "position_code": row["position_code"],
                "person_code": row["person_code"],
                "valid_from": parse_date(row["valid_from"]),
                "valid_to": parse_date(row["valid_to"]),
                "is_active": parse_boolean(row["is_active"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            holders.append(holder_data)

    return holders


def upgrade() -> None:
    """Create political parties tables and seed data using SQLAlchemy models"""
    conn = op.get_bind()

    # Create schema
    try:
        op.execute("CREATE SCHEMA IF NOT EXISTS political")
        print("✅ Created political schema")
    except Exception as e:
        print(f"⚠️  Error creating political schema: {e}")
        conn.rollback()

    # Create enum types
    try:
        op.execute("CREATE TYPE political.party_status_enum AS ENUM ('active', 'dissolved', 'suspended', 'inactive')")
        print("✅ Created party_status_enum")
    except Exception as e:
        print(f"⚠️  Error creating party_status_enum (may exist): {e}")
        conn.rollback()

    try:
        op.execute("CREATE TYPE political.membership_type_enum AS ENUM ('member', 'leader', 'official', 'supporter')")
        print("✅ Created membership_type_enum")
    except Exception as e:
        print(f"⚠️  Error creating membership_type_enum (may exist): {e}")
        conn.rollback()

    # Create tables using SQLAlchemy models
    print("🏗️  Creating political tables using SQLAlchemy models...")

    try:
        Parties.__table__.create(conn, checkfirst=True)
        print("✅ Created parties table")
    except Exception as e:
        print(f"⚠️  Error creating parties table: {e}")
        conn.rollback()

    try:
        PartyStructure.__table__.create(conn, checkfirst=True)
        print("✅ Created party_structure table")
    except Exception as e:
        print(f"⚠️  Error creating party_structure table: {e}")
        conn.rollback()

    try:
        PartyPositions.__table__.create(conn, checkfirst=True)
        print("✅ Created party_positions table")
    except Exception as e:
        print(f"⚠️  Error creating party_positions table: {e}")
        conn.rollback()

    try:
        PartyIdeology.__table__.create(conn, checkfirst=True)
        print("✅ Created party_ideology table")
    except Exception as e:
        print(f"⚠️  Error creating party_ideology table: {e}")
        conn.rollback()

    try:
        PartyMembership.__table__.create(conn, checkfirst=True)
        print("✅ Created party_membership table")
    except Exception as e:
        print(f"⚠️  Error creating party_membership table: {e}")
        conn.rollback()

    try:
        PartyPositionHolders.__table__.create(conn, checkfirst=True)
        print("✅ Created party_position_holders table")
    except Exception as e:
        print(f"⚠️  Error creating party_position_holders table: {e}")
        conn.rollback()

    # Load seed data
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "political", "_seed")

    # Load parties
    print("🌱 Seeding parties...")
    parties_csv = os.path.join(csv_dir, "parties.csv")
    if os.path.exists(parties_csv):
        try:
            parties = load_parties_from_csv(parties_csv, conn)
            print(f"📊 Parsed {len(parties)} parties from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, party in enumerate(parties, 1):
                try:
                    print(f"💾 Inserting party {i}: {party['party_code']} - {party['name']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.parties (
                            id, party_code, geo_unit_id, geo_unit_code, name, abbreviation, symbol_url,
                            founded_date, dissolved_date, status, created_at, updated_at
                        ) VALUES (
                            :id, :party_code, :geo_unit_id, :geo_unit_code, :name, :abbreviation, :symbol_url,
                            :founded_date, :dissolved_date, :status, :created_at, :updated_at
                        )
                    """
                        ),
                        party,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Parties seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading parties: {e}")
    else:
        print(f"⚠️  Parties CSV file not found: {parties_csv}")

    # Load party structure
    print("🌱 Seeding party structure...")
    structure_csv = os.path.join(csv_dir, "party_structure.csv")
    if os.path.exists(structure_csv):
        try:
            structures = load_party_structure_from_csv(structure_csv, conn)
            print(f"📊 Parsed {len(structures)} party structures from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, structure in enumerate(structures, 1):
                try:
                    print(f"💾 Inserting party structure {i}: {structure['unit_code']} - {structure['name']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.party_structure (
                            id, party_id, parent_unit_id, party_code, parent_unit_code, unit_code, name, level, created_at, updated_at
                        ) VALUES (
                            :id, :party_id, :parent_unit_id, :party_code, :parent_unit_code, :unit_code, :name, :level, :created_at, :updated_at
                        )
                    """
                        ),
                        structure,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party structure {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party structure {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Party structure seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading party structure: {e}")
    else:
        print(f"⚠️  Party structure CSV file not found: {structure_csv}")

    # Load party positions
    print("🌱 Seeding party positions...")
    positions_csv = os.path.join(csv_dir, "party_positions.csv")
    if os.path.exists(positions_csv):
        try:
            positions = load_party_positions_from_csv(positions_csv, conn)
            print(f"📊 Parsed {len(positions)} party positions from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, position in enumerate(positions, 1):
                try:
                    print(f"💾 Inserting party position {i}: {position['position_code']} - {position['name']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.party_positions (
                            id, party_id, unit_id, party_code, unit_code, position_code, name, created_at, updated_at
                        ) VALUES (
                            :id, :party_id, :unit_id, :party_code, :unit_code, :position_code, :name, :created_at, :updated_at
                        )
                    """
                        ),
                        position,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party position {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party position {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Party positions seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading party positions: {e}")
    else:
        print(f"⚠️  Party positions CSV file not found: {positions_csv}")

    # Load party ideology
    print("🌱 Seeding party ideology...")
    ideology_csv = os.path.join(csv_dir, "party_ideology.csv")
    if os.path.exists(ideology_csv):
        try:
            ideologies = load_party_ideology_from_csv(ideology_csv, conn)
            print(f"📊 Parsed {len(ideologies)} party ideologies from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, ideology in enumerate(ideologies, 1):
                try:
                    print(f"💾 Inserting party ideology {i}: {ideology['ideology_code']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.party_ideology (
                            id, party_id, party_code, ideology_code, description, valid_from, valid_to, created_at, updated_at
                        ) VALUES (
                            :id, :party_id, :party_code, :ideology_code, :description, :valid_from, :valid_to, :created_at, :updated_at
                        )
                    """
                        ),
                        ideology,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party ideology {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party ideology {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Party ideology seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading party ideology: {e}")
    else:
        print(f"⚠️  Party ideology CSV file not found: {ideology_csv}")

    # Load party membership
    print("🌱 Seeding party membership...")
    membership_csv = os.path.join(csv_dir, "party_membership.csv")
    if os.path.exists(membership_csv):
        try:
            memberships = load_party_membership_from_csv(membership_csv, conn)
            print(f"📊 Parsed {len(memberships)} party memberships from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, membership in enumerate(memberships, 1):
                try:
                    print(f"💾 Inserting party membership {i}: {membership['person_code']} -> {membership['party_code']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.party_membership (
                            id, person_id, party_id, person_code, party_code, membership_type, role_title,
                            valid_from, valid_to, is_active, created_at, updated_at
                        ) VALUES (
                            :id, :person_id, :party_id, :person_code, :party_code, :membership_type, :role_title,
                            :valid_from, :valid_to, :is_active, :created_at, :updated_at
                        )
                    """
                        ),
                        membership,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party membership {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party membership {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Party membership seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading party membership: {e}")
    else:
        print(f"⚠️  Party membership CSV file not found: {membership_csv}")

    # Load party position holders
    print("🌱 Seeding party position holders...")
    holders_csv = os.path.join(csv_dir, "party_position_holders.csv")
    if os.path.exists(holders_csv):
        try:
            holders = load_party_position_holders_from_csv(holders_csv, conn)
            print(f"📊 Parsed {len(holders)} party position holders from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, holder in enumerate(holders, 1):
                try:
                    print(f"💾 Inserting party position holder {i}: {holder['person_code']} -> {holder['position_code']}")
                    conn.execute(
                        text(
                            """
                        INSERT INTO political.party_position_holders (
                            id, position_id, person_id, position_code, person_code, valid_from, valid_to, is_active, created_at, updated_at
                        ) VALUES (
                            :id, :position_id, :person_id, :position_code, :person_code, :valid_from, :valid_to, :is_active, :created_at, :updated_at
                        )
                    """
                        ),
                        holder,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted party position holder {i}")
                except Exception as e:
                    print(f"❌ Failed to insert party position holder {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Party position holders seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading party position holders: {e}")
    else:
        print(f"⚠️  Party position holders CSV file not found: {holders_csv}")

    print("✅ Political parties tables and seed data created successfully!")


def downgrade() -> None:
    """Remove political parties tables and schema"""
    conn = op.get_bind()

    # Drop tables in reverse order of creation (due to foreign key dependencies)
    try:
        op.drop_table("party_position_holders", schema="political")
        print("✅ Dropped party_position_holders table")
    except Exception as e:
        print(f"⚠️  Error dropping party_position_holders (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("party_membership", schema="political")
        print("✅ Dropped party_membership table")
    except Exception as e:
        print(f"⚠️  Error dropping party_membership (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("party_ideology", schema="political")
        print("✅ Dropped party_ideology table")
    except Exception as e:
        print(f"⚠️  Error dropping party_ideology (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("party_positions", schema="political")
        print("✅ Dropped party_positions table")
    except Exception as e:
        print(f"⚠️  Error dropping party_positions (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("party_structure", schema="political")
        print("✅ Dropped party_structure table")
    except Exception as e:
        print(f"⚠️  Error dropping party_structure (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("parties", schema="political")
        print("✅ Dropped parties table")
    except Exception as e:
        print(f"⚠️  Error dropping parties (may not exist): {e}")
        conn.rollback()

    # Drop enum types
    try:
        op.execute("DROP TYPE IF EXISTS political.membership_type_enum")
        print("✅ Dropped membership_type_enum")
    except Exception as e:
        print(f"⚠️  Error dropping membership_type_enum (may not exist): {e}")
        conn.rollback()

    try:
        op.execute("DROP TYPE IF EXISTS political.party_status_enum")
        print("✅ Dropped party_status_enum")
    except Exception as e:
        print(f"⚠️  Error dropping party_status_enum (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS political CASCADE")
        print("✅ Dropped political schema")
    except Exception as e:
        print(f"⚠️  Error dropping political schema (may not exist): {e}")
        conn.rollback()

    print("✅ Political parties tables downgrade completed!")
