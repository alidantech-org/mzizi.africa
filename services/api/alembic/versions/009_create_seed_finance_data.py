"""Seed finance transaction tables with sample data

Revision ID: create_seed_finance_data
Revises: create_seed_finance_tables
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
from app.routes.finance.models import (
    RevenueLog,
    Budgets,
    Transfers,
    ExpenditureWorkflow,
    LedgerEntries,
)

# revision identifiers, used by Alembic.
revision = "create_seed_finance_data"
down_revision = "create_seed_finance_tables"
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


def resolve_fiscal_year_id(conn, fiscal_year_code: str) -> Optional[str]:
    """Resolve fiscal year code to ID, return None if not found"""
    try:
        result = conn.execute(
            text(
                "SELECT id FROM finance.fiscal_years WHERE fiscal_year_code = :fiscal_year_code"
            ),
            {"fiscal_year_code": fiscal_year_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved fiscal year '{fiscal_year_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Fiscal year '{fiscal_year_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving fiscal year '{fiscal_year_code}': {e}")
        return None


def resolve_revenue_category_id(conn, category_code: str) -> Optional[str]:
    """Resolve revenue category code to ID, return None if not found"""
    try:
        result = conn.execute(
            text(
                "SELECT id FROM finance.revenue_categories WHERE category_code = :category_code"
            ),
            {"category_code": category_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved revenue category '{category_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Revenue category '{category_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving revenue category '{category_code}': {e}")
        return None


def resolve_workflow_stage_id(conn, stage_code: str) -> Optional[str]:
    """Resolve workflow stage code to ID, return None if not found"""
    try:
        result = conn.execute(
            text(
                "SELECT id FROM finance.workflow_stages WHERE stage_code = :stage_code"
            ),
            {"stage_code": stage_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved workflow stage '{stage_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Workflow stage '{stage_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving workflow stage '{stage_code}': {e}")
        return None


def load_revenue_log_from_csv(csv_path: str, conn) -> list:
    """Load revenue log from CSV file with foreign key resolution"""
    revenue_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Revenue Log Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty revenue log row {row_num}")
                continue

            # Resolve foreign keys with graceful error handling
            entity_id = resolve_entity_id(conn, row["entity_code"])
            fiscal_year_id = resolve_fiscal_year_id(conn, row["fiscal_year_code"])
            category_id = resolve_revenue_category_id(conn, row["category_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            revenue_records.append(
                {
                    "id": str(ulid()),
                    "entity_id": entity_id,
                    "entity_code": row["entity_code"],
                    "fiscal_year_id": fiscal_year_id,
                    "fiscal_year_code": row["fiscal_year_code"],
                    "source_id": category_id,
                    "category_code": row["category_code"],
                    "amount": Decimal(row["amount"]),
                    "fund_restriction": row.get("fund_restriction"),
                    "received_date": datetime.strptime(
                        row["received_date"], "%Y-%m-%d"
                    ).date(),
                }
            )

    print(f"✅ Loaded {len(revenue_records)} revenue log records from CSV")
    return revenue_records


def load_budgets_from_csv(csv_path: str, conn) -> list:
    """Load budgets from CSV file with foreign key resolution"""
    budget_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Budgets Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty budgets row {row_num}")
                continue

            # Resolve foreign keys
            entity_id = resolve_entity_id(conn, row["entity_code"])
            fiscal_year_id = resolve_fiscal_year_id(conn, row["fiscal_year_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            budget_records.append(
                {
                    "id": str(ulid()),
                    "entity_id": entity_id,
                    "entity_code": row["entity_code"],
                    "fiscal_year_id": fiscal_year_id,
                    "fiscal_year_code": row["fiscal_year_code"],
                    "budget_code": row["budget_code"],
                    "program_code": row["program_code"],
                    "approved_amount": Decimal(row["approved_amount"]),
                }
            )

    print(f"✅ Loaded {len(budget_records)} budget records from CSV")
    return budget_records


def load_transfers_from_csv(csv_path: str, conn) -> list:
    """Load transfers from CSV file with foreign key resolution"""
    transfer_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Transfers Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty transfers row {row_num}")
                continue

            # Resolve foreign keys
            from_entity_id = resolve_entity_id(conn, row["from_entity_code"])
            to_entity_id = resolve_entity_id(conn, row["to_entity_code"])
            fiscal_year_id = resolve_fiscal_year_id(conn, row["fiscal_year_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            transfer_records.append(
                {
                    "id": str(ulid()),
                    "from_entity_id": from_entity_id,
                    "from_entity_code": row["from_entity_code"],
                    "to_entity_id": to_entity_id,
                    "to_entity_code": row["to_entity_code"],
                    "fiscal_year_id": fiscal_year_id,
                    "fiscal_year_code": row["fiscal_year_code"],
                    "transfer_type": row["transfer_type"],
                    "amount": Decimal(row["amount"]),
                    "fund_restriction": row.get("fund_restriction"),
                }
            )

    print(f"✅ Loaded {len(transfer_records)} transfer records from CSV")
    return transfer_records


def resolve_budget_id(conn, budget_code: str) -> Optional[str]:
    """Resolve budget code to budget ID, return None if not found"""
    try:
        result = conn.execute(
            text("SELECT id FROM finance.budgets WHERE budget_code = :budget_code"),
            {"budget_code": budget_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved budget '{budget_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Budget '{budget_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving budget '{budget_code}': {e}")
        return None


def load_expenditure_workflow_from_csv(csv_path: str, conn) -> list:
    """Load expenditure workflow from CSV file with foreign key resolution"""
    workflow_records = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):
            print(f"🔍 Expenditure Workflow Row {row_num}: {row}")

            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty expenditure workflow row {row_num}")
                continue

            # Resolve foreign keys
            entity_id = resolve_entity_id(conn, row["entity_code"])
            budget_id = resolve_budget_id(conn, row["budget_code"])
            stage_id = resolve_workflow_stage_id(conn, row["stage_code"])

            # Include record even if some foreign keys are not resolved (they're nullable now)
            workflow_records.append(
                {
                    "id": str(ulid()),
                    "entity_id": entity_id,
                    "entity_code": row["entity_code"],
                    "budget_id": budget_id,
                    "budget_code": row["budget_code"],
                    "stage_code": row["stage_code"],
                    "stage_id": stage_id,
                    "stage_order": int(row["stage_order"]),
                    "amount": Decimal(row["amount"]),
                    "approver_id": row.get("approver_id"),
                }
            )

    print(f"✅ Loaded {len(workflow_records)} expenditure workflow records from CSV")
    return workflow_records


def create_ledger_entries_from_transactions(
    conn, revenue_records, budget_records, transfer_records, workflow_records
):
    """Create ledger entries from transaction data"""
    ledger_entries = []

    # Ledger entries for revenue
    for revenue in revenue_records:
        ledger_entries.append(
            {
                "id": str(ulid()),
                "entity_id": revenue["entity_id"],
                "account_code": "1001",  # Cash account
                "debit_amount": Decimal(revenue["amount"]),
                "credit_amount": None,
                "reference_type": "revenue_log",
                "reference_id": revenue["id"],
                "transaction_date": revenue["received_date"],
                "description": f"Revenue receipt - {revenue['amount']}",
            }
        )

        ledger_entries.append(
            {
                "id": str(ulid()),
                "entity_id": revenue["entity_id"],
                "account_code": "4001",  # Revenue account
                "debit_amount": None,
                "credit_amount": Decimal(revenue["amount"]),
                "reference_type": "revenue_log",
                "reference_id": revenue["id"],
                "transaction_date": revenue["received_date"],
                "description": f"Revenue recognition - {revenue['amount']}",
            }
        )

    # Ledger entries for transfers
    for transfer in transfer_records:
        # From entity - credit cash
        ledger_entries.append(
            {
                "id": str(ulid()),
                "entity_id": transfer["from_entity_id"],
                "account_code": "1001",  # Cash account
                "debit_amount": None,
                "credit_amount": Decimal(transfer["amount"]),
                "reference_type": "transfer",
                "reference_id": transfer["id"],
                "transaction_date": transfer["transfer_date"],
                "description": f"Transfer out - {transfer['amount']}",
            }
        )

        # To entity - debit cash
        ledger_entries.append(
            {
                "id": str(ulid()),
                "entity_id": transfer["to_entity_id"],
                "account_code": "1001",  # Cash account
                "debit_amount": Decimal(transfer["amount"]),
                "credit_amount": None,
                "reference_type": "transfer",
                "reference_id": transfer["id"],
                "transaction_date": transfer["transfer_date"],
                "description": f"Transfer in - {transfer['amount']}",
            }
        )

    print(f"✅ Created {len(ledger_entries)} ledger entries")
    return ledger_entries


def upgrade() -> None:
    """Seed finance transaction tables with sample data"""

    conn = op.get_bind()

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "finance", "_seed", "data")

    print("🌱 Seeding finance transaction tables...")

    # Seed RevenueLog
    print("📊 Seeding revenue log...")
    revenue_log_csv = os.path.join(csv_dir, "revenue_log.csv")
    if os.path.exists(revenue_log_csv):
        try:
            revenue_records = load_revenue_log_from_csv(revenue_log_csv, conn)

            successful_inserts = 0
            failed_inserts = 0

            for i, record in enumerate(revenue_records, 1):
                try:
                    print(f"💾 Inserting revenue record {i}")
                    conn.execute(RevenueLog.__table__.insert(), record)
                    successful_inserts += 1
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert revenue record {i}: {e}")

            # Let Alembic handle the transaction automatically
            print(
                f"✅ Revenue records insertion completed: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading revenue log CSV: {e}")
    else:
        print(f"⚠️  Revenue log CSV file not found: {revenue_log_csv}")

    # Seed Budgets
    print("💰 Seeding budgets...")
    budgets_csv = os.path.join(csv_dir, "budgets.csv")
    if os.path.exists(budgets_csv):
        try:
            budget_records = load_budgets_from_csv(budgets_csv, conn)

            successful_inserts = 0
            failed_inserts = 0

            for i, record in enumerate(budget_records, 1):
                try:
                    print(f"💾 Inserting budget record {i}")
                    conn.execute(Budgets.__table__.insert(), record)
                    successful_inserts += 1
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert budget record {i}: {e}")

            # Let Alembic handle the transaction automatically
            print(
                f"✅ Budget records insertion completed: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading budgets CSV: {e}")
    else:
        print(f"⚠️  Budgets CSV file not found: {budgets_csv}")

    # Seed Transfers
    print("🔄 Seeding transfers...")
    transfers_csv = os.path.join(csv_dir, "transfers.csv")
    if os.path.exists(transfers_csv):
        try:
            transfer_records = load_transfers_from_csv(transfers_csv, conn)

            successful_inserts = 0
            failed_inserts = 0

            for i, record in enumerate(transfer_records, 1):
                try:
                    print(f"💾 Inserting transfer record {i}")
                    conn.execute(Transfers.__table__.insert(), record)
                    successful_inserts += 1
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert transfer record {i}: {e}")

            # Let Alembic handle the transaction automatically
            print(
                f"✅ Transfer records insertion completed: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading transfers CSV: {e}")
    else:
        print(f"⚠️  Transfers CSV file not found: {transfers_csv}")

    # Seed ExpenditureWorkflow
    print("📋 Seeding expenditure workflow...")
    workflow_csv = os.path.join(csv_dir, "expenditure_workflow.csv")
    if os.path.exists(workflow_csv):
        try:
            workflow_records = load_expenditure_workflow_from_csv(workflow_csv, conn)

            successful_inserts = 0
            failed_inserts = 0

            for i, record in enumerate(workflow_records, 1):
                try:
                    print(f"💾 Inserting workflow record {i}")
                    conn.execute(ExpenditureWorkflow.__table__.insert(), record)
                    successful_inserts += 1
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert workflow record {i}: {e}")

            # Let Alembic handle the transaction automatically
            print(
                f"✅ Workflow records insertion completed: {successful_inserts} successful, {failed_inserts} failed"
            )

        except Exception as e:
            print(f"❌ Error loading expenditure workflow CSV: {e}")
    else:
        print(f"⚠️  Expenditure workflow CSV file not found: {workflow_csv}")

    # Create Ledger Entries
    print("📒 Creating ledger entries...")
    try:
        # Reload records to get current state
        revenue_records = (
            load_revenue_log_from_csv(revenue_log_csv, conn)
            if os.path.exists(revenue_log_csv)
            else []
        )
        budget_records = (
            load_budgets_from_csv(budgets_csv, conn)
            if os.path.exists(budgets_csv)
            else []
        )
        transfer_records = (
            load_transfers_from_csv(transfers_csv, conn)
            if os.path.exists(transfers_csv)
            else []
        )
        workflow_records = (
            load_expenditure_workflow_from_csv(workflow_csv, conn)
            if os.path.exists(workflow_csv)
            else []
        )

        ledger_entries = create_ledger_entries_from_transactions(
            conn, revenue_records, budget_records, transfer_records, workflow_records
        )

        successful_inserts = 0
        failed_inserts = 0

        for i, entry in enumerate(ledger_entries, 1):
            try:
                print(f"💾 Inserting ledger entry {i}")
                conn.execute(LedgerEntries.__table__.insert(), entry)
                successful_inserts += 1
            except Exception as e:
                failed_inserts += 1
                print(f"❌ Failed to insert ledger entry {i}: {e}")

        # Let Alembic handle the transaction automatically
        print(
            f"✅ Ledger entries insertion completed: {successful_inserts} successful, {failed_inserts} failed"
        )

    except Exception as e:
        print(f"❌ Error creating ledger entries: {e}")

    print("✅ Finance data seeding completed!")


def downgrade() -> None:
    """Remove seeded finance data"""
    print("🗑️  Removing seeded finance data...")

    # Truncate transaction tables (remove data, keep structure)
    conn = op.get_bind()

    try:
        conn.execute(text("TRUNCATE TABLE finance.ledger_entries CASCADE"))
        print("✅ Truncated ledger_entries table")
    except Exception as e:
        print(f"⚠️  Error truncating ledger_entries (may not exist): {e}")
        # Reset transaction state
        conn.rollback()

    try:
        conn.execute(text("TRUNCATE TABLE finance.expenditure_workflow CASCADE"))
        print("✅ Truncated expenditure_workflow table")
    except Exception as e:
        print(f"⚠️  Error truncating expenditure_workflow (may not exist): {e}")
        conn.rollback()

    try:
        conn.execute(text("TRUNCATE TABLE finance.transfers CASCADE"))
        print("✅ Truncated transfers table")
    except Exception as e:
        print(f"⚠️  Error truncating transfers (may not exist): {e}")
        conn.rollback()

    try:
        conn.execute(text("TRUNCATE TABLE finance.budgets CASCADE"))
        print("✅ Truncated budgets table")
    except Exception as e:
        print(f"⚠️  Error truncating budgets (may not exist): {e}")
        conn.rollback()

    try:
        conn.execute(text("TRUNCATE TABLE finance.revenue_log CASCADE"))
        print("✅ Truncated revenue_log table")
    except Exception as e:
        print(f"⚠️  Error truncating revenue_log (may not exist): {e}")
        conn.rollback()

    print("✅ Finance data downgrade completed!")
