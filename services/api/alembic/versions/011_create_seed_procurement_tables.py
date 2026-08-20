"""Create procurement tables and seed with sample data

Revision ID: create_seed_procurement_tables
Revises: create_seed_debt_tables
Create Date: 2026-03-22 18:21:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
import decimal
from datetime import datetime
from decimal import Decimal
from ulid import ulid
from sqlalchemy import text
from app.routes.procurement.models import (
    Tenders,
    Bids,
    Contracts,
)

# revision identifiers, used by Alembic.
revision = "create_seed_procurement_tables"
down_revision = "create_seed_debt_tables"
branch_labels = None
depends_on = None


def resolve_finance_entity_id(entity_code: str, conn) -> Optional[str]:
    """Resolve finance entity ID from entity code"""
    if not entity_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM entities.finance_entities WHERE entity_code = :code"),
            {"code": entity_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve finance entity code '{entity_code}': {e}")
        return None


def resolve_legal_entity_id(entity_code: str, conn) -> Optional[str]:
    """Resolve legal entity ID from entity code"""
    if not entity_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM entities.legal_entities WHERE entity_code = :code"),
            {"code": entity_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve legal entity code '{entity_code}': {e}")
        return None


def resolve_geo_unit_id(geo_code: str, conn) -> Optional[str]:
    """Resolve geo unit ID from geo unit code"""
    if not geo_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM geographic.geo_units WHERE geo_unit_code = :code"),
            {"code": geo_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve geo unit code '{geo_code}': {e}")
        return None


def resolve_tender_id(tender_code: str, conn) -> Optional[str]:
    """Resolve tender ID from tender code"""
    if not tender_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM procurement.tenders WHERE tender_code = :code"),
            {"code": tender_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve tender code '{tender_code}': {e}")
        return None


def resolve_office_id(office_code: str, conn) -> Optional[str]:
    """Resolve office ID from office code"""
    if not office_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM offices.offices WHERE office_code = :code"),
            {"code": office_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve office code '{office_code}': {e}")
        return None


def resolve_office_holder_id(office_holder_code: str, conn) -> Optional[str]:
    """Resolve office holder ID from person code"""
    if not office_holder_code:
        return None

    try:
        result = conn.execute(
            text(
                "SELECT id FROM offices.holders WHERE person_code = :code AND is_current = true"
            ),
            {"code": office_holder_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve office holder code '{office_holder_code}': {e}")
        return None


def load_tenders_from_csv(csv_path: str, conn) -> list:
    """Load tenders from CSV file"""
    tenders = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            issuing_entity_id = resolve_finance_entity_id(
                row["issuing_entity_code"], conn
            )
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
            procuring_office_id = resolve_office_id(row["procuring_office_code"], conn)
            procuring_office_holder_id = resolve_office_holder_id(
                row["procuring_office_holder_code"], conn
            )

            tender_data = {
                "id": str(ulid()),
                "tender_code": row["tender_code"],
                "title": row["title"],
                "description": row["description"],
                "issuing_entity_code": row["issuing_entity_code"],
                "issuing_entity_id": issuing_entity_id,
                "geo_unit_code": row["geo_unit_code"],
                "geo_unit_id": geo_unit_id,
                "procuring_office_code": row["procuring_office_code"],
                "procuring_office_id": procuring_office_id,
                "procuring_office_holder_id": procuring_office_holder_id,
                "tender_type": row["tender_type"],
                "procurement_method": row["procurement_method"],
                "estimated_value": Decimal(row["estimated_value"]),
                "currency_code": row["currency_code"],
                "publication_date": datetime.strptime(
                    row["publication_date"], "%Y-%m-%d"
                ).date(),
                "closing_date": datetime.strptime(
                    row["closing_date"], "%Y-%m-%d"
                ).date(),
                "status": row["status"],
                "status_code": row["status_code"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            tenders.append(tender_data)

    return tenders


def load_bids_from_csv(csv_path: str, conn) -> list:
    """Load bids from CSV file"""
    bids = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            tender_id = resolve_tender_id(row["tender_code"], conn)
            bidder_entity_id = resolve_legal_entity_id(row["bidder_entity_code"], conn)

            bid_data = {
                "id": str(ulid()),
                "bid_code": row["bid_code"],
                "tender_code": row["tender_code"],
                "tender_id": tender_id,
                "bidder_entity_code": row["bidder_entity_code"],
                "bidder_entity_id": bidder_entity_id,
                "bidder_name": row["bidder_name"],
                "bid_amount": Decimal(row["bid_amount"]),
                "currency_code": row["currency_code"],
                "submission_date": datetime.strptime(
                    row["submission_date"], "%Y-%m-%d"
                ).date(),
                "status": row["status"],
                "status_code": row["status_code"],
                "is_compliant": row["is_compliant"].lower() == "true",
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            bids.append(bid_data)

    return bids


def load_contracts_from_csv(csv_path: str, conn) -> list:
    """Load contracts from CSV file"""
    contracts = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            try:
                # Resolve foreign keys
                tender_id = resolve_tender_id(row["tender_code"], conn)
                awarded_to_entity_id = resolve_legal_entity_id(
                    row["awarded_to_entity_code"], conn
                )
                contracting_entity_id = resolve_finance_entity_id(
                    row["contracting_entity_code"], conn
                )
                geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
                contracting_office_id = resolve_office_id(
                    row["contracting_office_code"], conn
                )
                contracting_office_holder_id = resolve_office_holder_id(
                    row["contracting_office_holder_code"], conn
                )

                # Safe decimal conversion
                try:
                    contract_value = (
                        Decimal(row["contract_value"])
                        if row["contract_value"]
                        else Decimal("0.00")
                    )
                except (ValueError, decimal.InvalidOperation) as e:
                    print(
                        f"⚠️  Invalid decimal value in contract {row.get('contract_code', 'unknown')}: {row['contract_value']} - {e}"
                    )
                    contract_value = Decimal("0.00")

                contract_data = {
                    "id": str(ulid()),
                    "contract_code": row["contract_code"],
                    "tender_code": row["tender_code"],
                    "tender_id": tender_id,
                    "awarded_to_entity_code": row["awarded_to_entity_code"],
                    "awarded_to_entity_id": awarded_to_entity_id,
                    "contracting_entity_code": row["contracting_entity_code"],
                    "contracting_entity_id": contracting_entity_id,
                    "geo_unit_code": row["geo_unit_code"],
                    "geo_unit_id": geo_unit_id,
                    "contracting_office_code": row["contracting_office_code"],
                    "contracting_office_id": contracting_office_id,
                    "contracting_office_holder_code": row[
                        "contracting_office_holder_code"
                    ],
                    "contracting_office_holder_id": contracting_office_holder_id,
                    "contract_title": row["contract_title"],
                    "contract_value": contract_value,
                    "currency_code": row["currency_code"],
                    "start_date": datetime.strptime(
                        row["start_date"], "%Y-%m-%d"
                    ).date(),
                    "end_date": (
                        datetime.strptime(row["end_date"], "%Y-%m-%d").date()
                        if row["end_date"]
                        else None
                    ),
                    "awarded_date": datetime.strptime(
                        row["awarded_date"], "%Y-%m-%d"
                    ).date(),
                    "status": row["status"],
                    "status_code": row["status_code"],
                    "created_at": datetime.now(),
                    "updated_at": datetime.now(),
                }

                contracts.append(contract_data)
            except Exception as e:
                print(f"❌ Error processing contract row {row}: {e}")
                continue

    return contracts


def upgrade() -> None:
    """Create procurement tables and seed with sample data"""
    print("🏗️  Creating procurement tables using SQLAlchemy models...")

    # Create procurement schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS procurement")
    print("✅ Created procurement schema")

    # Create tables using SQLAlchemy models
    Tenders.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created tenders table")

    Bids.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created bids table")

    Contracts.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created contracts table")

    print("🎉 Procurement schema and tables created successfully!")

    # Now seed the data
    print("🌱 Starting procurement data seeding...")

    # Get the directory containing this migration file
    migration_dir = os.path.dirname(os.path.abspath(__file__))
    csv_dir = os.path.join(
        migration_dir, "..", "..", "app", "routes", "procurement", "_seed"
    )

    # Seed tenders
    print("🌱 Seeding tenders...")
    tenders_csv = os.path.join(csv_dir, "tenders.csv")
    if os.path.exists(tenders_csv):
        try:
            conn = op.get_bind()
            tenders = load_tenders_from_csv(tenders_csv, conn)
            print(f"📊 Parsed {len(tenders)} tenders from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, tender in enumerate(tenders, 1):
                try:
                    print(
                        f"💾 Inserting tender {i}: {tender['tender_code']} - {tender['title']}"
                    )
                    conn.execute(Tenders.__table__.insert(), tender)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted tender {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert tender {i}: {e}")
                    print(f"   Tender data: {tender}")

            print(
                f"📈 Tenders insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading tenders CSV: {e}")
    else:
        print(f"⚠️  Tenders CSV file not found: {tenders_csv}")

    # Seed bids
    print("🌱 Seeding bids...")
    bids_csv = os.path.join(csv_dir, "bids.csv")
    if os.path.exists(bids_csv):
        try:
            conn = op.get_bind()
            bids = load_bids_from_csv(bids_csv, conn)
            print(f"📊 Parsed {len(bids)} bids from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, bid in enumerate(bids, 1):
                try:
                    print(f"💾 Inserting bid {i}: {bid['bid_code']}")
                    conn.execute(Bids.__table__.insert(), bid)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted bid {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert bid {i}: {e}")
                    print(f"   Bid data: {bid}")

            print(
                f"📈 Bids insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading bids CSV: {e}")
    else:
        print(f"⚠️  Bids CSV file not found: {bids_csv}")

    # Seed contracts
    print("🌱 Seeding contracts...")
    contracts_csv = os.path.join(csv_dir, "contracts.csv")
    if os.path.exists(contracts_csv):
        try:
            conn = op.get_bind()
            contracts = load_contracts_from_csv(contracts_csv, conn)
            print(f"📊 Parsed {len(contracts)} contracts from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, contract in enumerate(contracts, 1):
                try:
                    print(f"💾 Inserting contract {i}: {contract['contract_code']}")
                    conn.execute(Contracts.__table__.insert(), contract)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted contract {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert contract {i}: {e}")
                    print(f"   Contract data: {contract}")

            print(
                f"📈 Contracts insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading contracts CSV: {e}")
    else:
        print(f"⚠️  Contracts CSV file not found: {contracts_csv}")

    print("🔄 Back-populating resolved IDs in procurement tables...")

    # Back-populate tender IDs
    try:
        conn.execute(
            text(
                """
            UPDATE procurement.tenders 
            SET issuing_entity_id = fe.id
            FROM entities.finance_entities fe
            WHERE procurement.tenders.issuing_entity_code = fe.entity_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.tenders 
            SET geo_unit_id = gu.id
            FROM geographic.geo_units gu
            WHERE procurement.tenders.geo_unit_code = gu.geo_unit_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.tenders 
            SET procuring_office_id = o.id
            FROM offices.offices o
            WHERE procurement.tenders.procuring_office_code = o.office_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.tenders 
            SET procuring_office_holder_id = h.id
            FROM offices.holders h
            WHERE procurement.tenders.procuring_office_holder_code = h.person_code AND h.is_current = true
        """
            )
        )
        print("✅ Back-populated tender IDs")
    except Exception as e:
        print(f"⚠️  Error back-populating tender IDs: {e}")

    # Back-populate contract IDs
    try:
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET tender_id = t.id
            FROM procurement.tenders t
            WHERE procurement.contracts.tender_code = t.tender_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET awarded_to_entity_id = le.id
            FROM entities.legal_entities le
            WHERE procurement.contracts.awarded_to_entity_code = le.entity_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET contracting_entity_id = fe.id
            FROM entities.finance_entities fe
            WHERE procurement.contracts.contracting_entity_code = fe.entity_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET geo_unit_id = gu.id
            FROM geographic.geo_units gu
            WHERE procurement.contracts.geo_unit_code = gu.geo_unit_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET contracting_office_id = o.id
            FROM offices.offices o
            WHERE procurement.contracts.contracting_office_code = o.office_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.contracts 
            SET contracting_office_holder_id = h.id
            FROM offices.holders h
            WHERE procurement.contracts.contracting_office_holder_code = h.person_code AND h.is_current = true
        """
            )
        )
        print("✅ Back-populated contract IDs")
    except Exception as e:
        print(f"⚠️  Error back-populating contract IDs: {e}")

    # Back-populate bid IDs
    try:
        conn.execute(
            text(
                """
            UPDATE procurement.bids 
            SET tender_id = t.id
            FROM procurement.tenders t
            WHERE procurement.bids.tender_code = t.tender_code
        """
            )
        )
        conn.execute(
            text(
                """
            UPDATE procurement.bids 
            SET bidder_entity_id = le.id
            FROM entities.legal_entities le
            WHERE procurement.bids.bidder_entity_code = le.entity_code
        """
            )
        )
        print("✅ Back-populated bid IDs")
    except Exception as e:
        print(f"⚠️  Error back-populating bid IDs: {e}")

    print("🎉 Procurement data seeding completed!")


def downgrade() -> None:
    """Remove procurement tables and data"""
    print("🗑️  Removing procurement data and tables...")

    # Drop tables in correct order (respecting foreign key dependencies)
    try:
        op.drop_table("contracts", schema="procurement")
        print("✅ Dropped contracts table")
    except Exception as e:
        print(f"⚠️  Could not drop contracts table: {e}")

    try:
        op.drop_table("bids", schema="procurement")
        print("✅ Dropped bids table")
    except Exception as e:
        print(f"⚠️  Could not drop bids table: {e}")

    try:
        op.drop_table("tenders", schema="procurement")
        print("✅ Dropped tenders table")
    except Exception as e:
        print(f"⚠️  Could not drop tenders table: {e}")

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS procurement CASCADE")
        print("✅ Dropped procurement schema")
    except Exception as e:
        print(f"⚠️  Could not drop procurement schema: {e}")

    print("🎉 Procurement tables and schema removed successfully!")
