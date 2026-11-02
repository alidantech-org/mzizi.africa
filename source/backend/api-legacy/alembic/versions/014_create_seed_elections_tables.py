"""Create elections tables and seed data

Revision ID: create_seed_elections_tables
Revises: create_seed_political_tables
Create Date: 2026-03-23 00:58:00.000000

"""

from typing import Optional
from alembic import op
import csv
import os
from datetime import datetime, date
from ulid import ulid
from sqlalchemy import text

# Import SQLAlchemy models for table creation
from app.routes.elections.models import Elections, Seats, Candidates, Results, CandidateManifesto, ManifestoContent

# revision identifiers, used by Alembic.
revision = "create_seed_elections_tables"
down_revision = "create_seed_political_tables"
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


def resolve_constitution_id(constitution_code: str, conn) -> Optional[str]:
    """Resolve constitution ID from constitution code"""
    if not constitution_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM legal.constitutions WHERE constitution_code = :code"),
            {"code": constitution_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve constitution code '{constitution_code}': {e}")
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


def resolve_election_id(election_code: str, conn) -> Optional[str]:
    """Resolve election ID from election code"""
    if not election_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM elections.elections WHERE election_code = :code"),
            {"code": election_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve election code '{election_code}': {e}")
        return None


def resolve_seat_id(seat_code: str, conn) -> Optional[str]:
    """Resolve seat ID from seat code"""
    if not seat_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM elections.seats WHERE seat_code = :code"),
            {"code": seat_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve seat code '{seat_code}': {e}")
        return None


def resolve_candidate_id(candidate_code: str, conn) -> Optional[str]:
    """Resolve candidate ID from candidate code"""
    if not candidate_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM elections.candidates WHERE candidate_code = :code"),
            {"code": candidate_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve candidate code '{candidate_code}': {e}")
        return None


def resolve_manifesto_id(manifesto_code: str, conn) -> Optional[str]:
    """Resolve manifesto ID from manifesto code"""
    if not manifesto_code:
        return None

    try:
        result = conn.execute(
            text("SELECT id FROM elections.candidate_manifestos WHERE manifesto_code = :code"),
            {"code": manifesto_code},
        )
        row = result.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"⚠️  Could not resolve manifesto code '{manifesto_code}': {e}")
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


def load_elections_from_csv(csv_path: str, conn) -> list:
    """Load elections from CSV file"""
    elections = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
            institution_id = resolve_institution_id(row["institution_code"], conn)

            election_data = {
                "id": str(ulid()),
                "election_code": row["election_code"],
                "name": row["name"],
                "election_type": row["election_type"],
                "planned_date": parse_date(row["planned_date"]),
                "actual_date": parse_date(row["actual_date"]),
                "election_status": row["election_status"],
                "geo_unit_id": geo_unit_id,
                "geo_unit_code": row["geo_unit_code"],
                "institution_id": institution_id,
                "institution_code": row["institution_code"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            elections.append(election_data)

    return elections


def load_seats_from_csv(csv_path: str, conn) -> list:
    """Load seats from CSV file"""
    seats = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            office_id = resolve_office_id(row["office_code"], conn)
            geo_unit_id = resolve_geo_unit_id(row["geo_unit_code"], conn)
            constitution_id = resolve_constitution_id(row["constitution_code"], conn)

            seat_data = {
                "id": str(ulid()),
                "seat_code": row["seat_code"],
                "title": row["title"],
                "description": row["description"],
                "office_id": office_id,
                "geo_unit_id": geo_unit_id,
                "constitution_id": constitution_id,
                "office_code": row["office_code"],
                "geo_unit_code": row["geo_unit_code"],
                "constitution_code": row["constitution_code"],
                "total_positions": int(row["total_positions"]) if row["total_positions"] else 1,
                "is_active": row["is_active"],
                "valid_from": parse_date(row["valid_from"]),
                "valid_to": parse_date(row["valid_to"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            seats.append(seat_data)

    return seats


def load_candidates_from_csv(csv_path: str, conn) -> list:
    """Load candidates from CSV file"""
    candidates = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            person_id = resolve_person_id(row["person_code"], conn)
            seat_id = resolve_seat_id(row["seat_code"], conn)
            party_id = resolve_party_id(row["party_code"], conn) if row["party_code"] and not parse_boolean(row["is_independent"]) else None
            election_id = resolve_election_id(row["election_code"], conn)

            candidate_data = {
                "id": str(ulid()),
                "candidate_code": row["candidate_code"],
                "description": row["description"],
                "person_id": person_id,
                "seat_id": seat_id,
                "party_id": party_id,
                "election_id": election_id,
                "person_code": row["person_code"],
                "seat_code": row["seat_code"],
                "election_code": row["election_code"],
                "party_code": row["party_code"] if not parse_boolean(row["is_independent"]) else None,
                "is_independent": parse_boolean(row["is_independent"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            candidates.append(candidate_data)

    return candidates


def load_results_from_csv(csv_path: str, conn) -> list:
    """Load results from CSV file"""
    results = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            seat_id = resolve_seat_id(row["seat_code"], conn)
            candidate_id = resolve_candidate_id(row["candidate_code"], conn)

            result_data = {
                "id": str(ulid()),
                "seat_id": seat_id,
                "candidate_id": candidate_id,
                "seat_code": row["seat_code"],
                "candidate_code": row["candidate_code"],
                "election_code": row["election_code"],
                "votes": int(row["votes"]) if row["votes"] else 0,
                "result_position": int(row["result_position"]) if row["result_position"] else None,
                "is_winner": parse_boolean(row["is_winner"]),
                "declared_at": parse_date(row["declared_at"]),
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            results.append(result_data)

    return results


def load_candidate_manifestos_from_csv(csv_path: str, conn) -> list:
    """Load candidate manifestos from CSV file"""
    manifestos = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            candidate_id = resolve_candidate_id(row["candidate_code"], conn)

            manifesto_data = {
                "id": str(ulid()),
                "manifesto_code": row["manifesto_code"],
                "candidate_id": candidate_id,
                "candidate_code": row["candidate_code"],
                "title": row["title"],
                "description": row["description"],
                "content": row["content"],
                "tags": row["tags"] if row["tags"] else "[]",
                "published_date": datetime.fromisoformat(row["published_date"]) if row["published_date"] else None,
                "version": row["version"],
                "language": row["language"],
                "pdf_url": row["pdf_url"],
                "website_url": row["website_url"],
                "is_published": row["is_published"],
                "is_featured": row["is_featured"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            manifestos.append(manifesto_data)

    return manifestos


def load_manifesto_contents_from_csv(csv_path: str, conn) -> list:
    """Load manifesto contents from CSV file"""
    contents = []

    with open(csv_path, mode="r", encoding="utf-8") as file:
        reader = csv.DictReader(file)

        for row in reader:
            # Resolve foreign keys
            manifesto_id = resolve_manifesto_id(row["manifesto_code"], conn)
            candidate_id = resolve_candidate_id(row["candidate_code"], conn)

            content_data = {
                "id": str(ulid()),
                "content_code": row["content_code"],
                "manifesto_id": manifesto_id,
                "candidate_id": candidate_id,
                "manifesto_code": row["manifesto_code"],
                "candidate_code": row["candidate_code"],
                "section_title": row["section_title"],
                "section_summary": row["section_summary"],
                "section_content": row["section_content"],
                "category": row["category"],
                "subcategory": row["subcategory"],
                "priority_level": row["priority_level"],
                "implementation_timeline": row["implementation_timeline"],
                "tags": row["tags"] if row["tags"] else "[]",
                "keywords": row["keywords"] if row["keywords"] else "[]",
                "target_audience": row["target_audience"] if row["target_audience"] else "[]",
                "section_number": row["section_number"],
                "parent_section_code": row["parent_section_code"],
                "sort_order": row["sort_order"],
                "content_type": row["content_type"],
                "content_status": row["content_status"],
                "verification_status": row["verification_status"],
                "published_at": datetime.fromisoformat(row["published_at"]) if row["published_at"] else None,
                "last_reviewed_at": datetime.fromisoformat(row["last_reviewed_at"]) if row["last_reviewed_at"] else None,
                "reviewed_by": row["reviewed_by"],
                "created_at": datetime.now(),
                "updated_at": datetime.now(),
            }

            contents.append(content_data)

    return contents


def upgrade() -> None:
    """Create elections tables and seed data"""
    print("🌱 Creating elections schema...")

    # Create elections schema first
    try:
        op.execute("CREATE SCHEMA IF NOT EXISTS elections")
        print("✅ Elections schema created successfully")
    except Exception as e:
        print(f"⚠️  Schema creation failed (may already exist): {e}")

    print("🌱 Creating elections tables...")

    # Create tables using SQLAlchemy models
    Elections.__table__.create(op.get_bind(), checkfirst=True)
    Seats.__table__.create(op.get_bind(), checkfirst=True)
    Candidates.__table__.create(op.get_bind(), checkfirst=True)
    Results.__table__.create(op.get_bind(), checkfirst=True)
    CandidateManifesto.__table__.create(op.get_bind(), checkfirst=True)
    ManifestoContent.__table__.create(op.get_bind(), checkfirst=True)

    print("✅ Elections tables created successfully")

    # Load seed data
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
    csv_dir = os.path.join(base_dir, "app", "routes", "elections", "_seed")

    # Load elections
    print("🌱 Seeding elections...")
    elections_csv = os.path.join(csv_dir, "elections.csv")
    if os.path.exists(elections_csv):
        try:
            elections = load_elections_from_csv(elections_csv, op.get_bind())
            print(f"📊 Parsed {len(elections)} elections from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, election in enumerate(elections, 1):
                try:
                    print(f"💾 Inserting election {i}: {election['election_code']} - {election['name']}")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.elections (
                            id, election_code, name, election_type, planned_date, actual_date, election_status,
                            geo_unit_id, geo_unit_code, institution_id, institution_code, created_at, updated_at
                        ) VALUES (
                            :id, :election_code, :name, :election_type, :planned_date, :actual_date, :election_status,
                            :geo_unit_id, :geo_unit_code, :institution_id, :institution_code, :created_at, :updated_at
                        )
                    """
                        ),
                        election,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted election {i}")
                except Exception as e:
                    print(f"❌ Failed to insert election {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Elections seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading elections: {e}")
    else:
        print(f"⚠️  Elections CSV file not found: {elections_csv}")

    # Load seats
    print("🌱 Seeding seats...")
    seats_csv = os.path.join(csv_dir, "seats.csv")
    if os.path.exists(seats_csv):
        try:
            seats = load_seats_from_csv(seats_csv, op.get_bind())
            print(f"📊 Parsed {len(seats)} seats from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, seat in enumerate(seats, 1):
                try:
                    print(f"💾 Inserting seat {i}: {seat['seat_code']} - {seat['title']}")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.seats (
                            id, seat_code, title, description, office_id, geo_unit_id, constitution_id,
                            office_code, geo_unit_code, constitution_code, total_positions, is_active,
                            valid_from, valid_to, created_at, updated_at
                        ) VALUES (
                            :id, :seat_code, :title, :description, :office_id, :geo_unit_id, :constitution_id,
                            :office_code, :geo_unit_code, :constitution_code, :total_positions, :is_active,
                            :valid_from, :valid_to, :created_at, :updated_at
                        )
                    """
                        ),
                        seat,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted seat {i}")
                except Exception as e:
                    print(f"❌ Failed to insert seat {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Seats seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading seats: {e}")
    else:
        print(f"⚠️  Seats CSV file not found: {seats_csv}")

    # Load candidates
    print("🌱 Seeding candidates...")
    candidates_csv = os.path.join(csv_dir, "candidates.csv")
    if os.path.exists(candidates_csv):
        try:
            candidates = load_candidates_from_csv(candidates_csv, op.get_bind())
            print(f"📊 Parsed {len(candidates)} candidates from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, candidate in enumerate(candidates, 1):
                try:
                    print(f"💾 Inserting candidate {i}: {candidate['candidate_code']}")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.candidates (
                            id, candidate_code, description, person_id, seat_id, party_id, election_id,
                            person_code, seat_code, election_code, party_code, is_independent, created_at, updated_at
                        ) VALUES (
                            :id, :candidate_code, :description, :person_id, :seat_id, :party_id, :election_id,
                            :person_code, :seat_code, :election_code, :party_code, :is_independent, :created_at, :updated_at
                        )
                    """
                        ),
                        candidate,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted candidate {i}")
                except Exception as e:
                    print(f"❌ Failed to insert candidate {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Candidates seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading candidates: {e}")
    else:
        print(f"⚠️  Candidates CSV file not found: {candidates_csv}")

    # Load results
    print("🌱 Seeding results...")
    results_csv = os.path.join(csv_dir, "results.csv")
    if os.path.exists(results_csv):
        try:
            results = load_results_from_csv(results_csv, op.get_bind())
            print(f"📊 Parsed {len(results)} results from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, result in enumerate(results, 1):
                try:
                    print(f"💾 Inserting result {i}: {result['candidate_code']} - {result['votes']} votes")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.results (
                            id, seat_id, candidate_id, seat_code, candidate_code, election_code,
                            votes, result_position, is_winner, declared_at, created_at, updated_at
                        ) VALUES (
                            :id, :seat_id, :candidate_id, :seat_code, :candidate_code, :election_code,
                            :votes, :result_position, :is_winner, :declared_at, :created_at, :updated_at
                        )
                    """
                        ),
                        result,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted result {i}")
                except Exception as e:
                    print(f"❌ Failed to insert result {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Results seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading results: {e}")
    else:
        print(f"⚠️  Results CSV file not found: {results_csv}")

    # Load candidate manifestos
    print("🌱 Seeding candidate manifestos...")
    manifestos_csv = os.path.join(csv_dir, "candidate_manifestos.csv")
    if os.path.exists(manifestos_csv):
        try:
            manifestos = load_candidate_manifestos_from_csv(manifestos_csv, op.get_bind())
            print(f"📊 Parsed {len(manifestos)} candidate manifestos from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, manifesto in enumerate(manifestos, 1):
                try:
                    print(f"💾 Inserting manifesto {i}: {manifesto['manifesto_code']}")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.candidate_manifestos (
                            id, manifesto_code, candidate_id, candidate_code, title, description, content, tags,
                            published_date, version, language, pdf_url, website_url, is_published, is_featured,
                            created_at, updated_at
                        ) VALUES (
                            :id, :manifesto_code, :candidate_id, :candidate_code, :title, :description, :content, :tags,
                            :published_date, :version, :language, :pdf_url, :website_url, :is_published, :is_featured,
                            :created_at, :updated_at
                        )
                    """
                        ),
                        manifesto,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted manifesto {i}")
                except Exception as e:
                    print(f"❌ Failed to insert manifesto {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Candidate manifestos seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading candidate manifestos: {e}")
    else:
        print(f"⚠️  Candidate manifestos CSV file not found: {manifestos_csv}")

    # Load manifesto contents
    print("🌱 Seeding manifesto contents...")
    contents_csv = os.path.join(csv_dir, "manifesto_contents.csv")
    if os.path.exists(contents_csv):
        try:
            contents = load_manifesto_contents_from_csv(contents_csv, op.get_bind())
            print(f"📊 Parsed {len(contents)} manifesto contents from CSV")

            successful_inserts = 0
            failed_inserts = 0

            for i, content in enumerate(contents, 1):
                try:
                    print(f"💾 Inserting content {i}: {content['content_code']}")
                    op.get_bind().execute(
                        text(
                            """
                        INSERT INTO elections.manifesto_contents (
                            id, content_code, manifesto_id, candidate_id, manifesto_code, candidate_code,
                            section_title, section_summary, section_content, category, subcategory,
                            priority_level, implementation_timeline, tags, keywords, target_audience,
                            section_number, parent_section_code, sort_order, content_type, content_status,
                            verification_status, published_at, last_reviewed_at, reviewed_by,
                            created_at, updated_at
                        ) VALUES (
                            :id, :content_code, :manifesto_id, :candidate_id, :manifesto_code, :candidate_code,
                            :section_title, :section_summary, :section_content, :category, :subcategory,
                            :priority_level, :implementation_timeline, :tags, :keywords, :target_audience,
                            :section_number, :parent_section_code, :sort_order, :content_type, :content_status,
                            :verification_status, :published_at, :last_reviewed_at, :reviewed_by,
                            :created_at, :updated_at
                        )
                    """
                        ),
                        content,
                    )
                    successful_inserts += 1
                    print(f"✅ Successfully inserted content {i}")
                except Exception as e:
                    print(f"❌ Failed to insert content {i}: {e}")
                    failed_inserts += 1

            print(f"🎉 Manifesto contents seeding complete: {successful_inserts} successful, {failed_inserts} failed")
        except Exception as e:
            print(f"❌ Error loading manifesto contents: {e}")
    else:
        print(f"⚠️  Manifesto contents CSV file not found: {contents_csv}")

    print("🎉 Elections data seeding complete!")


def downgrade() -> None:
    """Remove elections tables and data"""
    print("🗑️  Removing elections tables...")

    # Get connection for transaction management
    conn = op.get_bind()

    # Drop tables in reverse order of creation with error handling
    try:
        op.drop_table("manifesto_contents", schema="elections")
        print("✅ Dropped manifesto_contents table")
    except Exception as e:
        print(f"⚠️  Error dropping manifesto_contents (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("candidate_manifestos", schema="elections")
        print("✅ Dropped candidate_manifestos table")
    except Exception as e:
        print(f"⚠️  Error dropping candidate_manifestos (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("results", schema="elections")
        print("✅ Dropped results table")
    except Exception as e:
        print(f"⚠️  Error dropping results (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("candidates", schema="elections")
        print("✅ Dropped candidates table")
    except Exception as e:
        print(f"⚠️  Error dropping candidates (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("seats", schema="elections")
        print("✅ Dropped seats table")
    except Exception as e:
        print(f"⚠️  Error dropping seats (may not exist): {e}")
        conn.rollback()

    try:
        op.drop_table("elections", schema="elections")
        print("✅ Dropped elections table")
    except Exception as e:
        print(f"⚠️  Error dropping elections (may not exist): {e}")
        conn.rollback()

    # Drop schema
    try:
        op.execute("DROP SCHEMA IF EXISTS elections CASCADE")
        print("✅ Dropped elections schema")
    except Exception as e:
        print(f"⚠️  Error dropping elections schema (may not exist): {e}")
        conn.rollback()

    print("✅ Elections tables downgrade completed!")
