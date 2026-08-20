"""Create and seed events tables

Revision ID: create_seed_events_tables
Revises: create_seed_elections_tables
Create Date: 2026-03-23 02:08:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
from datetime import datetime
from ulid import ulid
from sqlalchemy import text

# Import SQLAlchemy models for table creation
from app.routes.events.models import Events, EventTypes

# revision identifiers, used by Alembic.
revision = "create_seed_events_tables"
down_revision = "create_seed_elections_tables"
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
        ).fetchone()
        if result:
            print(f"✅ Resolved geo unit '{geo_unit_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Geo unit '{geo_unit_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving geo unit '{geo_unit_code}': {e}")
        return None


def resolve_event_type_id(event_type_code: str, conn) -> Optional[str]:
    """Resolve event type ID from event type code"""
    if not event_type_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM events.event_types WHERE event_type_code = :code"),
            {"code": event_type_code},
        ).fetchone()
        if result:
            print(f"✅ Resolved event type '{event_type_code}' → {result[0]}")
            return result[0]
        else:
            print(f"⚠️  Event type '{event_type_code}' not found, using None")
            return None
    except Exception as e:
        print(f"❌ Error resolving event type '{event_type_code}': {e}")
        return None


def parse_datetime(datetime_str: str) -> Optional[datetime]:
    """Parse datetime string safely"""
    if not datetime_str or datetime_str.strip() == "":
        return None
    try:
        return datetime.fromisoformat(datetime_str.replace("T", " ").replace("Z", ""))
    except ValueError:
        try:
            return datetime.strptime(datetime_str, "%Y-%m-%d %H:%M:%S")
        except ValueError:
            print(f"⚠️  Invalid datetime format: {datetime_str}")
            return None


def parse_boolean(bool_str: str) -> Optional[bool]:
    """Parse boolean string safely"""
    if not bool_str or bool_str.strip() == "":
        return None
    return bool_str.strip().lower() in ("true", "1", "yes")


def load_event_types_from_csv(csv_path: str, conn) -> list:
    """Load event types from CSV file"""
    event_types = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            event_type_data = {
                "id": str(ulid()),
                "event_type_code": row["event_type_code"],
                "name": row["name"],
                "description": row["description"],
                "is_active": parse_boolean(row["is_active"]),
                "is_recurring_default": parse_boolean(row["is_recurring_default"]),
                "default_impact_level": int(row["default_impact_level"]),
                "default_affects_public": parse_boolean(row["default_affects_public"]),
                "display_order": int(row["display_order"]),
                "color_code": row["color_code"] if row["color_code"] else None,
                "icon_name": row["icon_name"] if row["icon_name"] else None,
                "category": row["category"] if row["category"] else None,
                "tags": row["tags"] if row["tags"] else None,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            event_types.append(event_type_data)

    return event_types


def load_events_from_csv(csv_path: str, conn) -> list:
    """Load events from CSV file"""
    events = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
            event_type_id = resolve_event_type_id(row["event_type_code"], conn)

            event_data = {
                "id": str(ulid()),
                "event_code": row["event_code"],
                "title": row["title"],
                "description": row["description"],
                "event_type_id": event_type_id,
                "event_type_code": row["event_type_code"],
                "planned_date": parse_datetime(row["planned_date"]),
                "start_date": parse_datetime(row["start_date"]),
                "end_date": parse_datetime(row["end_date"]),
                "date_calculation_code": row["date_calculation_code"] if row["date_calculation_code"] else None,
                "is_recurring": parse_boolean(row["is_recurring"]),
                "affects_public": parse_boolean(row["affects_public"]),
                "impact_level": int(row["impact_level"]),
                "source_url": row["source_url"] if row["source_url"] else None,
                "is_verified": parse_boolean(row["is_verified"]),
                "status": row["status"],  # Use string value instead of enum
                "geo_unit_id": geo_unit_id,
                "geo_unit_code": row["geo_unit_code"] if row["geo_unit_code"] else None,
                "geo_scope": row["geo_scope"] if row["geo_scope"] else None,
                "tags": row["tags"] if row["tags"] else None,
                "notes": row["notes"] if row["notes"] else None,
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            events.append(event_data)

    return events


def upgrade() -> None:
    """Create events tables and seed data"""
    conn = op.get_bind()
    
    print("🏗️  Creating events schema...")
    
    # Create events schema
    try:
        conn.execute(text("CREATE SCHEMA IF NOT EXISTS events"))
        print("✅ Events schema created successfully")
    except Exception as e:
        print(f"⚠️  Could not create events schema: {e}")

    print("🏗️  Creating events tables...")
    
    # Create tables using SQLAlchemy models
    try:
        EventTypes.__table__.create(conn, checkfirst=True)
        print("✅ EventTypes table created successfully")
    except Exception as e:
        print(f"⚠️  Could not create EventTypes table: {e}")

    try:
        Events.__table__.create(conn, checkfirst=True)
        print("✅ Events table created successfully")
    except Exception as e:
        print(f"⚠️  Could not create Events table: {e}")

    print("📁 Loading seed data...")
    
    # Get the directory path for seed files following elections pattern
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "events", "_seed")

    # Seed event types
    print("🌱 Seeding event types...")
    event_types_csv = os.path.join(csv_dir, "event_types.csv")
    if os.path.exists(event_types_csv):
        try:
            event_types = load_event_types_from_csv(event_types_csv, conn)
            print(f"📊 Parsed {len(event_types)} event types from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, event_type in enumerate(event_types, 1):
                try:
                    print(f"💾 Inserting event type {i}: {event_type['event_type_code']} - {event_type['name']}")
                    conn.execute(text("""
                        INSERT INTO events.event_types (
                            id, event_type_code, name, description, is_active, 
                            is_recurring_default, default_impact_level, default_affects_public,
                            display_order, color_code, icon_name, category, tags,
                            created_at, updated_at
                        ) VALUES (
                            :id, :event_type_code, :name, :description, :is_active,
                            :is_recurring_default, :default_impact_level, :default_affects_public,
                            :display_order, :color_code, :icon_name, :category, :tags,
                            :created_at, :updated_at
                        )
                    """), event_type)
                    successful_inserts += 1
                except Exception as e:
                    print(f"❌ Failed to insert event type {event_type['event_type_code']}: {e}")
                    failed_inserts += 1

            print(f"✅ Event types seeding completed: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading event types: {e}")
    else:
        print(f"⚠️  Event types CSV not found: {event_types_csv}")

    # Seed events
    print("🌱 Seeding events...")
    events_csv = os.path.join(csv_dir, "events.csv")
    if os.path.exists(events_csv):
        try:
            events = load_events_from_csv(events_csv, conn)
            print(f"📊 Parsed {len(events)} events from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, event in enumerate(events, 1):
                try:
                    print(f"💾 Inserting event {i}: {event['event_code']} - {event['title']}")
                    conn.execute(text("""
                        INSERT INTO events.events (
                            id, event_code, title, description, event_type_id, event_type_code,
                            planned_date, start_date, end_date, date_calculation_code,
                            is_recurring, affects_public, impact_level, source_url, is_verified,
                            status, geo_unit_id, geo_unit_code, geo_scope, tags, notes,
                            created_at, updated_at
                        ) VALUES (
                            :id, :event_code, :title, :description, :event_type_id, :event_type_code,
                            :planned_date, :start_date, :end_date, :date_calculation_code,
                            :is_recurring, :affects_public, :impact_level, :source_url, :is_verified,
                            :status, :geo_unit_id, :geo_unit_code, :geo_scope, :tags, :notes,
                            :created_at, :updated_at
                        )
                    """), event)
                    successful_inserts += 1
                except Exception as e:
                    print(f"❌ Failed to insert event {event['event_code']}: {e}")
                    failed_inserts += 1

            print(f"✅ Events seeding completed: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading events: {e}")
    else:
        print(f"⚠️  Events CSV not found: {events_csv}")

    print("🎉 Events migration completed successfully!")


def downgrade() -> None:
    """Drop events tables and schema with safe rollback"""
    conn = op.get_bind()
    
    print("🏗️  Dropping events tables...")
    
    # Drop tables in reverse order of creation
    try:
        conn.execute(text("DROP TABLE IF EXISTS events.events CASCADE"))
        print("✅ Events table dropped successfully")
    except Exception as e:
        print(f"⚠️  Could not drop Events table: {e}")
    
    try:
        conn.execute(text("DROP TABLE IF EXISTS events.event_types CASCADE"))
        print("✅ EventTypes table dropped successfully")
    except Exception as e:
        print(f"⚠️  Could not drop EventTypes table: {e}")
    
    # Drop schema
    try:
        conn.execute(text("DROP SCHEMA IF EXISTS events CASCADE"))
        print("✅ Events schema dropped successfully")
    except Exception as e:
        print(f"⚠️  Could not drop events schema: {e}")
    
    print("🎉 Events downgrade completed successfully!")
