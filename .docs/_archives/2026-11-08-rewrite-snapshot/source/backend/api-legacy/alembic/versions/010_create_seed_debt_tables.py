"""Create debt tables and seed data

Revision ID: create_seed_debt_tables
Revises: create_seed_entities_tables
Create Date: 2026-03-22 00:00:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
from datetime import datetime
from decimal import Decimal
from ulid import ulid
from sqlalchemy import text
from app.routes.debt.models import (
    Loans,
    LoanDisbursements,
    LoanRepayments,
)

# revision identifiers, used by Alembic.
revision = "create_seed_debt_tables"
down_revision = "create_seed_entities_tables"
branch_labels = None
depends_on = None


def resolve_entity_id(conn, entity_code: str) -> Optional[str]:
    """Resolve entity code to entity ID, return None if not found"""
    try:
        result = conn.execute(
            text(
                "SELECT id FROM entities.finance_entities WHERE entity_code = :entity_code"
            ),
            {"entity_code": entity_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved entity '{entity_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Entity '{entity_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving entity '{entity_code}': {e}")
        return None


def resolve_loan_id(conn, loan_code: str) -> Optional[str]:
    """Resolve loan code to loan ID, return None if not found"""
    try:
        result = conn.execute(
            text("SELECT id FROM debt.loans WHERE loan_code = :loan_code"),
            {"loan_code": loan_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved loan '{loan_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Loan '{loan_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving loan '{loan_code}': {e}")
        return None


def load_loans_from_csv(csv_path: str, conn) -> list:
    """Load loans from CSV file with foreign key resolution"""
    loan_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Loans Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty loans row {row_num}")
                continue

            # Resolve foreign keys with graceful error handling
            borrower_entity_id = resolve_entity_id(conn, row["borrower_entity_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            loan_records.append(
                {
                    "id": str(ulid()),
                    "loan_code": row["loan_code"],
                    "borrower_entity_code": row["borrower_entity_code"],
                    "borrower_entity_id": borrower_entity_id,
                    "lender_name": row["lender_name"],
                    "lender_code": row["lender_code"],
                    "principal_amount": Decimal(row["principal_amount"]),
                    "currency_code": row["currency_code"],
                    "interest_rate": (
                        Decimal(row["interest_rate"]) if row["interest_rate"] else None
                    ),
                    "start_date": datetime.strptime(
                        row["start_date"], "%Y-%m-%d"
                    ).date(),
                    "end_date": (
                        datetime.strptime(row["end_date"], "%Y-%m-%d").date()
                        if row["end_date"]
                        else None
                    ),
                    "status": row["status"],
                    "status_code": row["status_code"],
                }
            )

    print(f"✅ Loaded {len(loan_records)} loan records from CSV")
    return loan_records


def load_loan_disbursements_from_csv(csv_path: str, conn) -> list:
    """Load loan disbursements from CSV file with foreign key resolution"""
    disbursement_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Loan Disbursements Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty loan disbursements row {row_num}")
                continue

            # Resolve foreign keys
            loan_id = resolve_loan_id(conn, row["loan_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            disbursement_records.append(
                {
                    "id": str(ulid()),
                    "disbursement_code": row["disbursement_code"],
                    "loan_code": row["loan_code"],
                    "loan_id": loan_id,
                    "amount": Decimal(row["amount"]),
                    "currency_code": row["currency_code"],
                    "disbursement_date": datetime.strptime(
                        row["disbursement_date"], "%Y-%m-%d"
                    ).date(),
                    "status": row["status"],
                    "status_code": row["status_code"],
                    "ledger_entry_id": (
                        row["ledger_entry_id"] if row["ledger_entry_id"] else None
                    ),
                    "ledger_entry_code": (
                        row["ledger_entry_code"] if row["ledger_entry_code"] else None
                    ),
                }
            )

    print(f"✅ Loaded {len(disbursement_records)} loan disbursement records from CSV")
    return disbursement_records


def load_loan_repayments_from_csv(csv_path: str, conn) -> list:
    """Load loan repayments from CSV file with foreign key resolution"""
    repayment_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Loan Repayments Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty loan repayments row {row_num}")
                continue

            # Resolve foreign keys
            loan_id = resolve_loan_id(conn, row["loan_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            repayment_records.append(
                {
                    "id": str(ulid()),
                    "repayment_code": row["repayment_code"],
                    "loan_code": row["loan_code"],
                    "loan_id": loan_id,
                    "amount": Decimal(row["amount"]),
                    "currency_code": row["currency_code"],
                    "principal_paid": Decimal(row["principal_paid"]),
                    "interest_paid": Decimal(row["interest_paid"]),
                    "payment_date": datetime.strptime(
                        row["payment_date"], "%Y-%m-%d"
                    ).date(),
                    "status": row["status"],
                    "status_code": row["status_code"],
                    "ledger_entry_id": (
                        row["ledger_entry_id"] if row["ledger_entry_id"] else None
                    ),
                    "ledger_entry_code": (
                        row["ledger_entry_code"] if row["ledger_entry_code"] else None
                    ),
                }
            )

    print(f"✅ Loaded {len(repayment_records)} loan repayment records from CSV")
    return repayment_records


def upgrade() -> None:
    """Create debt tables and seed with sample data"""
    print("🏗️  Creating debt tables using SQLAlchemy models...")

    # Create debt schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS debt")
    print("✅ Created debt schema")

    # Create tables using SQLAlchemy models
    Loans.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created loans table")

    LoanDisbursements.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created loan_disbursements table")

    LoanRepayments.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created loan_repayments table")

    print("🎉 Debt schema and tables created successfully!")

    # Now seed the data
    print("🌱 Starting debt data seeding...")

    # Get the directory containing this migration file
    migration_dir = os.path.dirname(os.path.abspath(__file__))
    csv_dir = os.path.join(migration_dir, "..", "..", "app", "routes", "debt", "_seed")

    # Seed loans
    print("🌱 Seeding loans...")
    loans_csv = os.path.join(csv_dir, "loans.csv")
    if os.path.exists(loans_csv):
        try:
            conn = op.get_bind()
            loans = load_loans_from_csv(loans_csv, conn)
            print(f"📊 Parsed {len(loans)} loans from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, loan in enumerate(loans, 1):
                try:
                    print(
                        f"💾 Inserting loan {i}: {loan['loan_code']} - {loan['lender_name']}"
                    )
                    conn.execute(Loans.__table__.insert(), loan)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted loan {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert loan {i}: {e}")
                    print(f"   Loan data: {loan}")

            print(
                f"📈 Loans insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
        except Exception as e:
            print(f"❌ Error loading loans CSV: {e}")
    else:
        print(f"⚠️  Loans CSV file not found: {loans_csv}")

    # Seed loan disbursements
    print("🌱 Seeding loan disbursements...")
    loan_disbursements_csv = os.path.join(csv_dir, "loan_disbursements.csv")
    if os.path.exists(loan_disbursements_csv):
        try:
            conn = op.get_bind()
            loan_disbursements = load_loan_disbursements_from_csv(
                loan_disbursements_csv, conn
            )
            print(f"📊 Parsed {len(loan_disbursements)} loan disbursements from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, disbursement in enumerate(loan_disbursements, 1):
                try:
                    print(
                        f"💾 Inserting loan disbursement {i}: {disbursement['disbursement_code']}"
                    )
                    conn.execute(LoanDisbursements.__table__.insert(), disbursement)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted loan disbursement {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert loan disbursement {i}: {e}")
                    print(f"   Loan disbursement data: {disbursement}")

            print(
                f"📈 Loan disbursements insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
        except Exception as e:
            print(f"❌ Error loading loan disbursements CSV: {e}")
    else:
        print(f"⚠️  Loan disbursements CSV file not found: {loan_disbursements_csv}")

    # Seed loan repayments
    print("🌱 Seeding loan repayments...")
    loan_repayments_csv = os.path.join(csv_dir, "loan_repayments.csv")
    if os.path.exists(loan_repayments_csv):
        try:
            conn = op.get_bind()
            loan_repayments = load_loan_repayments_from_csv(loan_repayments_csv, conn)
            print(f"📊 Parsed {len(loan_repayments)} loan repayments from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, repayment in enumerate(loan_repayments, 1):
                try:
                    print(
                        f"💾 Inserting loan repayment {i}: {repayment['repayment_code']}"
                    )
                    conn.execute(LoanRepayments.__table__.insert(), repayment)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted loan repayment {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert loan repayment {i}: {e}")
                    print(f"   Loan repayment data: {repayment}")

            print(
                f"📈 Loan repayments insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
        except Exception as e:
            print(f"❌ Error loading loan repayments CSV: {e}")
    else:
        print(f"⚠️  Loan repayments CSV file not found: {loan_repayments_csv}")

    print("🎉 Debt data seeding completed!")


def downgrade() -> None:
    """Remove debt schema and tables"""
    print("🗑️  Removing debt schema and tables...")

    try:
        conn = op.get_bind()

        # Delete loan repayments
        result = conn.execute(text("DELETE FROM debt.loan_repayments"))
        print(f"🗑️  Deleted {result.rowcount} loan repayment records")

        # Delete loan disbursements
        result = conn.execute(text("DELETE FROM debt.loan_disbursements"))
        print(f"🗑️  Deleted {result.rowcount} loan disbursement records")

        # Delete loans
        result = conn.execute(text("DELETE FROM debt.loans"))
        print(f"🗑️  Deleted {result.rowcount} loan records")

        # Drop foreign key constraints first
        op.drop_constraint(
            "fk_loan_repayments_loan_id_loans", "loan_repayments", schema="debt"
        )
        op.drop_constraint(
            "fk_loan_disbursements_loan_id_loans", "loan_disbursements", schema="debt"
        )
        op.drop_constraint(
            "fk_loans_borrower_entity_id_finance_entities", "loans", schema="debt"
        )
        print("✅ Dropped foreign key constraints")

        # Drop tables
        op.drop_table("loan_repayments", schema="debt")
        op.drop_table("loan_disbursements", schema="debt")
        op.drop_table("loans", schema="debt")
        print("✅ Dropped debt tables")

        # Drop schema
        op.execute("DROP SCHEMA IF EXISTS debt CASCADE")
        print("✅ Dropped debt schema")

        print("✅ Debt schema and tables removed successfully!")
    except Exception as e:
        print(f"❌ Error removing debt schema and tables: {e}")
