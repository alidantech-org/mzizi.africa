"""Create finance tables and seed data

Revision ID: create_seed_finance_tables
Revises: create_seed_entities_tables
Create Date: 2026-03-22 00:00:00.000000

"""

from alembic import op
import csv
import os
from datetime import datetime
from ulid import ulid
from app.routes.finance.models import (
    FiscalYears,
    RevenueCategories,
    WorkflowStages,
    RevenueLog,
    Budgets,
    Transfers,
    ExpenditureWorkflow,
    LedgerEntries,
)

# revision identifiers, used by Alembic.
revision = "create_seed_finance_tables"
down_revision = "create_seed_entities_tables"
branch_labels = None
depends_on = None


def load_fiscal_years_from_csv(csv_path: str) -> list:
    """Load fiscal years from CSV file"""
    fiscal_years = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Fiscal Years Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty fiscal years row {row_num}")
                continue

            fiscal_years.append(
                {
                    "id": str(ulid()),
                    "fiscal_year_code": row["fiscal_year_code"],
                    "name": row["name"],
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
                    "country_code": (
                        row["country_code"]
                        if row.get("country_code") and row["country_code"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                }
            )

    print(f"✅ Loaded {len(fiscal_years)} fiscal years from CSV")
    return fiscal_years


def load_revenue_categories_from_csv(csv_path: str) -> list:
    """Load revenue categories from CSV file"""
    revenue_categories = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Revenue Categories Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty revenue categories row {row_num}")
                continue

            revenue_categories.append(
                {
                    "id": str(ulid()),
                    "category_code": row["category_code"],  # Consistent naming
                    "category_name": row["category_name"],  # Consistent naming
                }
            )

    print(f"✅ Loaded {len(revenue_categories)} revenue categories from CSV")
    return revenue_categories


def load_workflow_stages_from_csv(csv_path: str) -> list:
    """Load workflow stages from CSV file"""
    workflow_stages = []

    with open(csv_path, "r", encoding="utf-8") as file:
        reader = csv.DictReader(file)
        for row_num, row in enumerate(reader, 2):  # Start at 2 because header is row 1
            print(f"🔍 Workflow Stages Row {row_num}: {row}")
            # Skip empty rows
            if not any(row.values()):
                print(f"⚠️  Skipping empty workflow stages row {row_num}")
                continue

            workflow_stages.append(
                {
                    "id": str(ulid()),
                    "stage_code": row["stage_code"],
                    "stage_name": row["stage_name"],
                    "stage_order": (
                        int(row["stage_order"])
                        if row.get("stage_order") and row["stage_order"].strip()
                        else 0
                    ),
                    "description": (
                        row["description"]
                        if row.get("description") and row["description"].strip()
                        else None
                    ),
                    "is_active": row["is_active"].lower() == "true",
                }
            )

    print(f"✅ Loaded {len(workflow_stages)} workflow stages from CSV")
    return workflow_stages


def upgrade() -> None:
    """Create finance tables and seed data using SQLAlchemy models"""

    # Create tables using SQLAlchemy models
    print("🏗️  Creating finance tables using SQLAlchemy models...")

    # Create finance schema first
    op.execute("CREATE SCHEMA IF NOT EXISTS finance")
    print("✅ Created finance schema")

    # Create tables using SQLAlchemy models
    FiscalYears.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created fiscal_years table")

    RevenueCategories.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created revenue_categories table")

    WorkflowStages.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created workflow_stages table")

    RevenueLog.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created revenue_log table")

    Budgets.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created budgets table")

    Transfers.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created transfers table")

    ExpenditureWorkflow.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created expenditure_workflow table")

    LedgerEntries.__table__.create(op.get_bind(), checkfirst=True)
    print("✅ Created ledger_entries table")

    # Get base directory for CSV files
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "finance", "_seed")

    # Seed fiscal years
    print("🌱 Seeding fiscal years...")
    fiscal_years_csv = os.path.join(csv_dir, "fiscal_years.csv")
    if os.path.exists(fiscal_years_csv):
        try:
            fiscal_years = load_fiscal_years_from_csv(fiscal_years_csv)
            print(f"📊 Parsed {len(fiscal_years)} fiscal years from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, fiscal_year in enumerate(fiscal_years, 1):
                try:
                    print(f"💾 Inserting fiscal year {i}: {fiscal_year['name']}")
                    conn.execute(FiscalYears.__table__.insert(), fiscal_year)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted fiscal year {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert fiscal year {i}: {e}")
                    print(f"   Fiscal year data: {fiscal_year}")

            print(
                f"📈 Fiscal years insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Fiscal years data completed")

        except Exception as e:
            print(f"❌ Error loading fiscal years CSV: {e}")
    else:
        print(f"⚠️  Fiscal years CSV file not found: {fiscal_years_csv}")

    # Seed revenue categories
    print("🌱 Seeding revenue categories...")
    revenue_categories_csv = os.path.join(csv_dir, "revenue_categories.csv")
    if os.path.exists(revenue_categories_csv):
        try:
            revenue_categories = load_revenue_categories_from_csv(
                revenue_categories_csv
            )
            print(f"📊 Parsed {len(revenue_categories)} revenue categories from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, revenue_category in enumerate(revenue_categories, 1):
                try:
                    print(
                        f"💾 Inserting revenue category {i}: {revenue_category['category_name']}"
                    )
                    conn.execute(RevenueCategories.__table__.insert(), revenue_category)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted revenue category {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert revenue category {i}: {e}")
                    print(f"   Revenue category data: {revenue_category}")

            print(
                f"📈 Revenue categories insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Revenue categories data completed")

        except Exception as e:
            print(f"❌ Error loading revenue categories CSV: {e}")
    else:
        print(f"⚠️  Revenue categories CSV file not found: {revenue_categories_csv}")

    # Seed workflow stages
    print("🌱 Seeding workflow stages...")
    workflow_stages_csv = os.path.join(csv_dir, "workflow_stages.csv")
    if os.path.exists(workflow_stages_csv):
        try:
            workflow_stages = load_workflow_stages_from_csv(workflow_stages_csv)
            print(f"📊 Parsed {len(workflow_stages)} workflow stages from CSV")

            conn = op.get_bind()
            successful_inserts = 0
            failed_inserts = 0

            for i, workflow_stage in enumerate(workflow_stages, 1):
                try:
                    print(
                        f"💾 Inserting workflow stage {i}: {workflow_stage['stage_name']}"
                    )
                    conn.execute(WorkflowStages.__table__.insert(), workflow_stage)
                    successful_inserts += 1
                    print(f"✅ Successfully inserted workflow stage {i}")
                except Exception as e:
                    failed_inserts += 1
                    print(f"❌ Failed to insert workflow stage {i}: {e}")
                    print(f"   Workflow stage data: {workflow_stage}")

            print(
                f"📈 Workflow stages insert summary: {successful_inserts} successful, {failed_inserts} failed"
            )

            # Let Alembic handle the transaction automatically
            print("✅ Workflow stages data completed")

        except Exception as e:
            print(f"❌ Error loading workflow stages CSV: {e}")
    else:
        print(f"⚠️  Workflow stages CSV file not found: {workflow_stages_csv}")

    print("✅ Finance tables seeding completed!")


def downgrade() -> None:
    """Remove finance tables and data"""
    print("🗑️  Removing finance tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables in reverse order of creation with error handling
    try:
        op.drop_table("ledger_entries", schema="finance")
        print("✅ Dropped ledger_entries table")
    except Exception as e:
        print(f"⚠️  Error dropping ledger_entries (may not exist): {e}")
        # Reset transaction state
        conn.rollback()

    try:
        op.drop_table("expenditure_workflow", schema="finance")
        print("✅ Dropped expenditure_workflow table")
    except Exception as e:
        print(f"⚠️  Error dropping expenditure_workflow (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("transfers", schema="finance")
        print("✅ Dropped transfers table")
    except Exception as e:
        print(f"⚠️  Error dropping transfers (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("budgets", schema="finance")
        print("✅ Dropped budgets table")
    except Exception as e:
        print(f"⚠️  Error dropping budgets (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("revenue_log", schema="finance")
        print("✅ Dropped revenue_log table")
    except Exception as e:
        print(f"⚠️  Error dropping revenue_log (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("workflow_stages", schema="finance")
        print("✅ Dropped workflow_stages table")
    except Exception as e:
        print(f"⚠️  Error dropping workflow_stages (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("revenue_categories", schema="finance")
        print("✅ Dropped revenue_categories table")
    except Exception as e:
        print(f"⚠️  Error dropping revenue_categories (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("fiscal_years", schema="finance")
        print("✅ Dropped fiscal_years table")
    except Exception as e:
        print(f"⚠️  Error dropping fiscal_years (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS finance CASCADE")
        print("✅ Dropped finance schema")
    except Exception as e:
        print(f"⚠️  Error dropping finance schema (may not exist): {e}")
        conn.rollback()

    print("✅ Finance tables downgrade completed!")
