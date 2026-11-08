"""Create statistics tables and seed with sample data

Revision ID: create_seed_statistics_tables
Revises: create_seed_procurement_tables
Create Date: 2026-03-22 19:45:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
from datetime import datetime
from decimal import Decimal
from ulid import ulid
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = "create_seed_statistics_tables"
down_revision = "create_seed_procurement_tables"
branch_labels = None
depends_on = None


def resolve_indicator_category_id(category_code: str, conn) -> Optional[str]:
    """Resolve indicator category ID from category code"""
    if not category_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM statistics.indicator_categories WHERE indicator_category_code = :code"),
            {"code": category_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve indicator category code '{category_code}': {e}")
        return None


def resolve_indicator_id(indicator_code: str, conn) -> Optional[str]:
    """Resolve indicator ID from indicator code"""
    if not indicator_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM statistics.indicators WHERE indicator_code = :code"),
            {"code": indicator_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve indicator code '{indicator_code}': {e}")
        return None


def resolve_period_id(period_code: str, conn) -> Optional[str]:
    """Resolve period ID from period code"""
    if not period_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM statistics.periods WHERE period_code = :code"),
            {"code": period_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve period code '{period_code}': {e}")
        return None


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


def resolve_institution_id(institution_code: str, conn) -> Optional[str]:
    """Resolve institution ID from institution code"""
    if not institution_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM governance.institutions WHERE institution_code = :code"),
            {"code": institution_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve institution code '{institution_code}': {e}")
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


def resolve_geo_level_id(geo_level_code: str, conn) -> Optional[str]:
    """Resolve geo level ID from geo level code"""
    if not geo_level_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM geographic.geo_levels WHERE geo_level_code = :code"),
            {"code": geo_level_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve geo level code '{geo_level_code}': {e}")
        return None


def resolve_indicator_column_id(column_code: str, indicator_code: str, conn) -> Optional[str]:
    """Resolve indicator column ID from column code and indicator code"""
    if not column_code or not indicator_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM statistics.indicator_columns WHERE column_code = :code AND indicator_code = :indicator_code"),
            {"code": column_code, "indicator_code": indicator_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve indicator column code '{column_code}' for indicator '{indicator_code}': {e}")
        return None


def resolve_statistics_table_id(table_code: str, conn) -> Optional[str]:
    """Resolve statistics table ID from table code"""
    if not table_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM statistics.statistics_tables WHERE table_code = :code"),
            {"code": table_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve statistics table code '{table_code}': {e}")
        return None


def load_indicator_categories_from_csv(csv_path: str, conn) -> list:
    """Load indicator categories from CSV file"""
    categories = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            category_data = {
                "id": str(ulid()),
                "indicator_category_code": row["indicator_category_code"],
                "name": row["name"],
                "description": row["description"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            categories.append(category_data)

    return categories


def load_indicators_from_csv(csv_path: str, conn) -> list:
    """Load indicators from CSV file"""
    indicators = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            indicator_category_id = resolve_indicator_category_id(row["indicator_category_code"], conn)

            # Resolve parent_indicator_id from parent_indicator_code if provided
            parent_indicator_id = None
            parent_indicator_code = (
                row.get("parent_indicator_code")
                if row.get("parent_indicator_code") and str(row.get("parent_indicator_code")).strip()
                else None
            )
            if parent_indicator_code:
                parent_indicator_id = resolve_indicator_id(parent_indicator_code, conn)

            # Handle boolean values safely - check for None or empty values
            is_comparable_raw = row.get("is_comparable", "false")
            is_aggregatable_raw = row.get("is_aggregatable", "false")

            is_comparable = is_comparable_raw and is_comparable_raw.strip().lower() in ("true", "1", "yes")
            is_aggregatable = is_aggregatable_raw and is_aggregatable_raw.strip().lower() in ("true", "1", "yes")

            indicator_data = {
                "id": str(ulid()),
                "indicator_code": row["indicator_code"],
                "name": row["name"],
                "description": row["description"],
                "indicator_category_id": indicator_category_id,
                "parent_indicator_id": parent_indicator_id,
                "parent_indicator_code": parent_indicator_code,
                "unit": row["unit"],
                "is_comparable": is_comparable,
                "is_aggregatable": is_aggregatable,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            indicators.append(indicator_data)

    return indicators


def back_populate_parent_indicator_codes(conn):
    """Back-populate parent_indicator_code from parent_indicator_id"""
    try:
        # Update parent_indicator_code for all indicators that have parent_indicator_id
        result = conn.execute(
            text(
                """
                UPDATE statistics.indicators 
                SET parent_indicator_code = parent.indicator_code
                FROM statistics.indicators AS parent
                WHERE statistics.indicators.parent_indicator_id = parent.id
                AND statistics.indicators.parent_indicator_code IS NULL
            """
            )
        )
        print(f"📊 Updated {result.rowcount} indicators with parent_indicator_code")
    except Exception as e:
        print(f"⚠️  Error back-populating parent_indicator_code: {e}")


def load_indicator_columns_from_csv(csv_path: str, conn) -> list:
    """Load indicator columns from CSV file"""
    indicator_columns = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            indicator_id = resolve_indicator_id(row["indicator_code"], conn)

            indicator_column_data = {
                "id": str(ulid()),
                "column_code": row["column_code"],
                "label": row["label"],
                "description": row["description"],
                "indicator_id": indicator_id,
                "indicator_code": row["indicator_code"],
                "data_type": row["data_type"],
                "sort_order": int(row["sort_order"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            indicator_columns.append(indicator_column_data)

    return indicator_columns


def load_statistics_tables_from_csv(csv_path: str, conn) -> list:
    """Load statistics tables from CSV file"""
    statistics_tables = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            geo_level_id = resolve_geo_level_id(row["geo_level_code"], conn) if row.get("geo_level_code") else None
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn) if row.get("geo_unit_code") else None
            institution_id = resolve_institution_id(row["institution_code"], conn) if row.get("institution_code") else None
            office_id = resolve_office_id(row["office_code"], conn) if row.get("office_code") else None

            # Handle boolean values safely
            is_verified = row.get("is_verified", "false").lower() in ("true", "1", "yes")

            statistics_table_data = {
                "id": str(ulid()),
                "table_code": row["table_code"],
                "source": row["source"],
                "methodology": row["methodology"],
                "collector": row["collector"],
                "notes": row["notes"],
                "is_verified": is_verified,
                "confidence": row["confidence"],
                "geo_level_id": geo_level_id,
                "geo_level_code": row["geo_level_code"] if row.get("geo_level_code") else None,
                "geo_unit_id": geo_unit_id,
                "geo_unit_code": row["geo_unit_code"] if row.get("geo_unit_code") else None,
                "institution_id": institution_id,
                "office_id": office_id,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            statistics_tables.append(statistics_table_data)

    return statistics_tables


def load_periods_from_csv(csv_path: str, conn) -> list:
    """Load periods from CSV file"""
    periods = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Handle boolean values safely
            is_active = row.get("is_active", "true").lower() in ("true", "1", "yes")

            period_data = {
                "id": str(ulid()),
                "period_code": row["period_code"],
                "label": row["label"],
                "start_date": datetime.strptime(row["start_date"], "%Y-%m-%d") if row.get("start_date") else None,
                "end_date": datetime.strptime(row["end_date"], "%Y-%m-%d") if row.get("end_date") else None,
                "granularity": row["granularity"],
                "description": row["description"],
                "is_active": is_active,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            periods.append(period_data)

    return periods


def load_geo_statistics_from_csv(csv_path: str, conn) -> list:
    """Load geo statistics from CSV file"""
    geo_statistics = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
            table_id = resolve_statistics_table_id(row["table_code"], conn)
            indicator_id = resolve_indicator_id(row["indicator_code"], conn)
            period_id = resolve_period_id(row["period_code"], conn)
            column_id = resolve_indicator_column_id(row["column_code"], row["indicator_code"], conn)

            # Parse numeric value
            numeric_value = Decimal(row["numeric_value"]) if row["numeric_value"] else None

            geo_statistic_data = {
                "id": str(ulid()),
                "geo_unit_id": geo_unit_id,
                "table_id": table_id,
                "column_id": column_id,
                "indicator_id": indicator_id,
                "period_id": period_id,
                "geo_unit_code": row["geo_unit_code"],
                "table_code": row["table_code"],
                "column_code": row["column_code"],
                "indicator_code": row["indicator_code"],
                "period_code": row["period_code"],
                "numeric_value": numeric_value,
                "text_value": row["text_value"] if row["text_value"] else None,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            geo_statistics.append(geo_statistic_data)

    return geo_statistics


def upgrade() -> None:
    """Create statistics tables and seed with data"""
    print("🏗️  Creating statistics tables using SQLAlchemy models...")

    try:
        # Create statistics schema first
        conn = op.get_bind()
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS statistics"))
        print("✅ Created statistics schema")

        # Import models after schema creation
        from app.routes.statistics.models.indicator_categories import IndicatorCategories
        from app.routes.statistics.models.indicators import Indicators
        from app.routes.statistics.models.indicator_columns import IndicatorColumns
        from app.routes.statistics.models.statistics_tables import StatisticsTables
        from app.routes.statistics.models.periods import Periods
        from app.routes.statistics.models.geo_statistics import GeoStatistics

        # Create tables using SQLAlchemy models
        IndicatorCategories.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created indicator_categories table")

        Indicators.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created indicators table")

        IndicatorColumns.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created indicator_columns table")

        StatisticsTables.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created statistics_tables table")

        Periods.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created periods table")

        GeoStatistics.__table__.create(op.get_bind(), checkfirst=True)
        print("✅ Created geo_statistics table")

        print("🎉 Statistics schema and tables created successfully!")

    except Exception as e:
        print(f"❌ Error creating statistics tables: {e}")
        raise

    # Now seed the data
    print("🌱 Starting statistics data seeding...")

    try:
        # Get the directory of this migration file
        migration_dir = os.path.dirname(os.path.abspath(__file__))
        csv_dir = os.path.join(migration_dir, "..", "..", "app", "routes", "statistics", "_seed")

        print(f"📁 Migration directory: {migration_dir}")
        print(f"📁 Seed directory: {csv_dir}")
        print(f"📁 Seed directory exists: {os.path.exists(csv_dir)}")

        # Load and seed indicator categories
        print("📊 Loading indicator categories...")
        categories_csv = os.path.join(csv_dir, "indicator_categories.csv")
        if os.path.exists(categories_csv):
            try:
                categories = load_indicator_categories_from_csv(categories_csv, conn)
                print(f"📊 Parsed {len(categories)} indicator categories from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, category in enumerate(categories, 1):
                    try:
                        # Insert using prepared data structure with conflict handling
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.indicator_categories (
                                id, indicator_category_code, name, description, created_at, updated_at
                            ) VALUES (
                                :id, :indicator_category_code, :name, :description, :created_at, :updated_at
                            )
                            ON CONFLICT (indicator_category_code) DO NOTHING
                            """
                            ),
                            category,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert category {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} indicator categories")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} indicator categories")

            except Exception as e:
                print(f"⚠️  Error processing indicator categories CSV: {e}")
        else:
            print(f"⚠️  Indicator categories CSV file not found: {categories_csv}")

        # Load and seed indicators
        print("📈 Loading indicators...")
        indicators_csv = os.path.join(csv_dir, "indicators.csv")
        if os.path.exists(indicators_csv):
            try:
                indicators = load_indicators_from_csv(indicators_csv, conn)
                print(f"📊 Parsed {len(indicators)} indicators from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, indicator in enumerate(indicators, 1):
                    try:
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.indicators (
                                id, indicator_code, name, description, indicator_category_id,
                                parent_indicator_id, parent_indicator_code, unit, is_comparable, is_aggregatable,
                                created_at, updated_at
                            ) VALUES (
                                :id, :indicator_code, :name, :description, :indicator_category_id,
                                :parent_indicator_id, :parent_indicator_code, :unit, :is_comparable, :is_aggregatable,
                                :created_at, :updated_at
                            )
                            ON CONFLICT (indicator_code) DO NOTHING
                            """
                            ),
                            indicator,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert indicator {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} indicators")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} indicators")

            except Exception as e:
                print(f"⚠️  Error processing indicators CSV: {e}")
        else:
            print(f"⚠️  Indicators CSV file not found: {indicators_csv}")

        # Load and seed indicator columns
        print("📋 Loading indicator columns...")
        indicator_columns_csv = os.path.join(csv_dir, "indicator_columns.csv")
        if os.path.exists(indicator_columns_csv):
            try:
                indicator_columns = load_indicator_columns_from_csv(indicator_columns_csv, conn)
                print(f"📊 Parsed {len(indicator_columns)} indicator columns from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, indicator_column in enumerate(indicator_columns, 1):
                    try:
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.indicator_columns (
                                id, column_code, label, description, indicator_id, indicator_code,
                                data_type, sort_order, created_at, updated_at
                            ) VALUES (
                                :id, :column_code, :label, :description, :indicator_id, :indicator_code,
                                :data_type, :sort_order, :created_at, :updated_at
                            )
                            ON CONFLICT (column_code) DO NOTHING
                            """
                            ),
                            indicator_column,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert indicator column {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} indicator columns")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} indicator columns")

            except Exception as e:
                print(f"⚠️  Error processing indicator columns CSV: {e}")
        else:
            print(f"⚠️  Indicator columns CSV file not found: {indicator_columns_csv}")

        # Load and seed statistics tables
        print("📊 Loading statistics tables...")
        statistics_tables_csv = os.path.join(csv_dir, "statistics_tables.csv")
        if os.path.exists(statistics_tables_csv):
            try:
                statistics_tables = load_statistics_tables_from_csv(statistics_tables_csv, conn)
                print(f"📊 Parsed {len(statistics_tables)} statistics tables from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, statistics_table in enumerate(statistics_tables, 1):
                    try:
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.statistics_tables (
                                id, table_code, source, methodology, collector, notes, is_verified, confidence,
                                geo_level_id, geo_level_code, geo_unit_id, geo_unit_code,
                                institution_id, office_id, created_at, updated_at
                            ) VALUES (
                                :id, :table_code, :source, :methodology, :collector, :notes, :is_verified, :confidence,
                                :geo_level_id, :geo_level_code, :geo_unit_id, :geo_unit_code,
                                :institution_id, :office_id, :created_at, :updated_at
                            )
                            ON CONFLICT (table_code) DO NOTHING
                            """
                            ),
                            statistics_table,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert statistics table {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} statistics tables")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} statistics tables")

            except Exception as e:
                print(f"⚠️  Error processing statistics tables CSV: {e}")
        else:
            print(f"⚠️  Statistics tables CSV file not found: {statistics_tables_csv}")

        # Load and seed periods
        print("📅 Loading periods...")
        periods_csv = os.path.join(csv_dir, "periods.csv")
        if os.path.exists(periods_csv):
            try:
                periods = load_periods_from_csv(periods_csv, conn)
                print(f"📊 Parsed {len(periods)} periods from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, period in enumerate(periods, 1):
                    try:
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.periods (
                                id, period_code, label, start_date, end_date, granularity,
                                description, is_active, created_at, updated_at
                            ) VALUES (
                                :id, :period_code, :label, :start_date, :end_date, :granularity,
                                :description, :is_active, :created_at, :updated_at
                            )
                            ON CONFLICT (period_code) DO NOTHING
                            """
                            ),
                            period,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert period {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} periods")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} periods")

            except Exception as e:
                print(f"⚠️  Error processing periods CSV: {e}")
        else:
            print(f"⚠️  Periods CSV file not found: {periods_csv}")

        # Load and seed geo statistics
        print("🌍 Loading geo statistics...")
        geo_statistics_csv = os.path.join(csv_dir, "geo_statistics.csv")
        if os.path.exists(geo_statistics_csv):
            try:
                geo_statistics = load_geo_statistics_from_csv(geo_statistics_csv, conn)
                print(f"📊 Parsed {len(geo_statistics)} geo statistics from CSV")

                successful_inserts = 0
                failed_inserts = 0

                for i, geo_statistic in enumerate(geo_statistics, 1):
                    try:
                        conn.execute(
                            text(
                                """
                            INSERT INTO statistics.geo_statistics (
                                id, geo_unit_id, table_id, column_id, indicator_id, period_id,
                                geo_unit_code, table_code, column_code, indicator_code, period_code,
                                numeric_value, text_value, created_at, updated_at
                            ) VALUES (
                                :id, :geo_unit_id, :table_id, :column_id, :indicator_id, :period_id,
                                :geo_unit_code, :table_code, :column_code, :indicator_code, :period_code,
                                :numeric_value, :text_value, :created_at, :updated_at
                            )
                            """
                            ),
                            geo_statistic,
                        )
                        successful_inserts += 1
                    except Exception as e:
                        print(f"⚠️  Failed to insert geo statistic {i}: {e}")
                        failed_inserts += 1

                print(f"✅ Inserted {successful_inserts} geo statistics records")
                if failed_inserts > 0:
                    print(f"❌ Failed to insert {failed_inserts} geo statistics records")

            except Exception as e:
                print(f"⚠️  Error processing geo statistics CSV: {e}")
        else:
            print(f"⚠️  Geo statistics CSV file not found: {geo_statistics_csv}")

        print("🎉 Statistics tables created and seeded successfully!")

        # Back-populate parent_indicator_code for indicators after all seeding is complete
        print("🔄 Back-populating parent_indicator_code...")
        back_populate_parent_indicator_codes(conn)
        print("✅ Back-populated parent_indicator_code")

    except Exception as e:
        print(f"❌ Error during statistics data seeding: {e}")
        raise


def downgrade() -> None:
    """Remove statistics schema and tables"""
    print("🗑️  Removing statistics schema and tables...")

    try:
        conn = op.get_bind()

        # Delete geo statistics records first
        result = conn.execute(text("DELETE FROM statistics.geo_statistics"))
        print(f"🗑️  Deleted {result.rowcount} geo statistics records")

        # Delete period records
        result = conn.execute(text("DELETE FROM statistics.periods"))
        print(f"🗑️  Deleted {result.rowcount} period records")

        # Delete statistics table records
        result = conn.execute(text("DELETE FROM statistics.statistics_tables"))
        print(f"🗑️  Deleted {result.rowcount} statistics table records")

        # Delete indicator column records
        result = conn.execute(text("DELETE FROM statistics.indicator_columns"))
        print(f"🗑️  Deleted {result.rowcount} indicator column records")

        # Delete indicator records
        result = conn.execute(text("DELETE FROM statistics.indicators"))
        print(f"🗑️  Deleted {result.rowcount} indicator records")

        # Delete indicator category records
        result = conn.execute(text("DELETE FROM statistics.indicator_categories"))
        print(f"🗑️  Deleted {result.rowcount} indicator category records")

        # Drop tables in reverse order of creation
        op.drop_table("geo_statistics", schema="statistics")
        op.drop_table("periods", schema="statistics")
        op.drop_table("statistics_tables", schema="statistics")
        op.drop_table("indicator_columns", schema="statistics")
        op.drop_table("indicators", schema="statistics")
        op.drop_table("indicator_categories", schema="statistics")
        print("✅ Dropped statistics tables")

        # Drop enums
        op.execute("DROP TYPE IF EXISTS statistics.data_type_enum")
        op.execute("DROP TYPE IF EXISTS statistics.granularity_enum")
        op.execute("DROP TYPE IF EXISTS statistics.confidence_level_enum")
        print("✅ Dropped statistics enums")

        # Drop schema
        op.execute("DROP SCHEMA IF EXISTS statistics CASCADE")
        print("✅ Dropped statistics schema")

        print("✅ Statistics schema and tables removed successfully!")

    except Exception as e:
        print(f"❌ Error removing statistics schema and tables: {e}")
        raise
