#!/usr/bin/env python3
"""
Database CLI Tool - Comprehensive database management for Katiba BookPlatform
Professional database operations with colored logging and modular architecture
"""

import sys
import argparse
from pathlib import Path

# Handle Windows console encoding for emoji support
if sys.platform == "win32":
    try:
        import ctypes

        kernel32 = ctypes.windll.kernel32
        # Enable UTF-8 output on Windows console
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except:  # noqa: E722
        pass

# Add the parent directory to the path
sys.path.append(str(Path(__file__).parent.parent))


# Color support for logs
class Colors:
    RESET = "\033[0m"
    RED = "\033[91m"
    GREEN = "\033[92m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    MAGENTA = "\033[95m"
    CYAN = "\033[96m"
    WHITE = "\033[97m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"


def colored_print(text: str, color: str = Colors.WHITE):
    """Print colored text"""
    print(f"{color}{text}{Colors.RESET}")


def colored_input(prompt: str, color: str = Colors.CYAN) -> str:
    """Get colored input"""
    return input(f"{color}{prompt}{Colors.RESET}")


# Import database services
try:
    from app.services.database import DatabaseManager, DatabaseSeeder, DatabaseSetup

    colored_print("[INFO] ✅ Database services loaded successfully", Colors.GREEN)
except ImportError as e:
    colored_print(f"[ERROR] Failed to import database services: {e}", Colors.RED)
    sys.exit(1)


def setup_logging(args):
    """Setup logging with colors"""
    import logging

    # Custom colored formatter
    class ColoredFormatter(logging.Formatter):
        """Custom formatter with colors"""

        COLORS = {
            "DEBUG": Colors.CYAN,
            "INFO": Colors.GREEN,
            "WARNING": Colors.YELLOW,
            "ERROR": Colors.RED,
            "CRITICAL": Colors.RED + Colors.BOLD,
        }

        def format(self, record):
            log_color = self.COLORS.get(record.levelname, Colors.WHITE)
            record.levelname = f"{log_color}{record.levelname}{Colors.RESET}"
            record.msg = f"{log_color}{record.msg}{Colors.RESET}"
            return super().format(record)

    # Setup logging with colors
    if args.verbose:
        logging.basicConfig(
            level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
        )
    else:
        logging.basicConfig(level=logging.INFO, format="%(message)s")

    # Apply colored formatter to all handlers
    for handler in logging.root.handlers:
        handler.setFormatter(
            ColoredFormatter(
                handler.formatter._fmt
                if hasattr(handler.formatter, "_fmt")
                else "%(message)s"
            )
        )

    logger = logging.getLogger(__name__)

    # Override logger methods for better color control
    original_info = logger.info
    original_warning = logger.warning
    original_error = logger.error
    original_debug = logger.debug

    def colored_info(msg):
        colored_print(f"[INFO] {msg}", Colors.GREEN)
        original_info(msg)

    def colored_warning(msg):
        colored_print(f"[WARNING] {msg}", Colors.YELLOW)
        original_warning(msg)

    def colored_error(msg):
        colored_print(f"[ERROR] {msg}", Colors.RED)
        original_error(msg)

    def colored_debug(msg):
        colored_print(f"[DEBUG] {msg}", Colors.CYAN)
        original_debug(msg)

    logger.info = colored_info
    logger.warning = colored_warning
    logger.error = colored_error
    logger.debug = colored_debug

    return logger


def create_database(args):
    """Create database"""
    colored_print("🏗️ Creating database...", Colors.BLUE)

    db_manager = DatabaseManager()

    if db_manager.create_database_if_not_exists(args.name):
        colored_print(f"✅ Database '{args.name}' created successfully", Colors.GREEN)
    else:
        colored_print(f"ℹ️  Database '{args.name}' already exists", Colors.YELLOW)


def create_tables(args):
    """Create database tables"""
    colored_print("📋 Creating database tables...", Colors.BLUE)

    db_manager = DatabaseManager()

    if db_manager.create_tables():
        colored_print("✅ Database tables created successfully", Colors.GREEN)
    else:
        colored_print("❌ Failed to create tables", Colors.RED)


def drop_tables(args):
    """Drop database tables"""
    colored_print("⚠️  This will drop all tables. Are you sure?", Colors.YELLOW)
    confirm = colored_input("Type 'yes' to continue: ", Colors.RED)

    if confirm.lower() == "yes":
        db_manager = DatabaseManager()
        if db_manager.drop_tables():
            colored_print("✅ Database tables dropped successfully", Colors.GREEN)
        else:
            colored_print("❌ Failed to drop tables", Colors.RED)
    else:
        colored_print("Operation cancelled", Colors.YELLOW)


def reset_database(args):
    """Reset database"""
    colored_print("🔄 Resetting database...", Colors.BLUE)

    db_setup = DatabaseSetup()

    if db_setup.reset_and_setup(seed_data=args.seed):
        colored_print("✅ Database reset successfully", Colors.GREEN)
    else:
        colored_print("❌ Failed to reset database", Colors.RED)


def seed_database(args):
    """Seed database with data"""
    colored_print("🌱 Seeding database...", Colors.BLUE)

    db_seeder = DatabaseSeeder()

    if args.all:
        results = db_seeder.seed_all()
        total_seeded = sum(results.values())
        colored_print(f"✅ Database seeded with {total_seeded} records", Colors.GREEN)

        # Show breakdown
        for data_type, count in results.items():
            colored_print(f"   {data_type}: {count}", Colors.CYAN)
    else:
        # Seed specific data types
        results = {}
        if args.users:
            results["users"] = db_seeder.seed_admin_users()
        if args.parties:
            results["parties"] = db_seeder.seed_parties()
        if args.candidates:
            results["candidates"] = db_seeder.seed_candidates()
        if (
            args.metadata
            or args.timezones
            or args.currencies
            or args.religions
            or args.climate_zones
            or args.fund_types
            or args.expenditure_types
            or args.companies
            or args.government_departments
            or args.funders
        ):
            from app.routes.metadata.seeder import MetadataSeeder

            metadata_seeder = MetadataSeeder()

            # Seed specific models if requested
            if args.timezones:
                results["timezones"] = metadata_seeder.seed_timezones()
            if args.currencies:
                results["currencies"] = metadata_seeder.seed_currencies()
            if args.religions:
                results["religions"] = metadata_seeder.seed_religions()
            if args.climate_zones:
                results["climate_zones"] = metadata_seeder.seed_climate_zones()
            if args.fund_types:
                results["fund_types"] = metadata_seeder.seed_fund_types()
            if args.expenditure_types:
                results["expenditure_types"] = metadata_seeder.seed_expenditure_types()
            if args.companies:
                results["companies"] = metadata_seeder.seed_companies()
            if args.government_departments:
                results["government_departments"] = (
                    metadata_seeder.seed_government_departments()
                )
            if args.funders:
                results["funders"] = metadata_seeder.seed_funders()

            # If --metadata flag is used without specific models, seed all
            if args.metadata and not any(
                [
                    args.timezones,
                    args.currencies,
                    args.religions,
                    args.climate_zones,
                    args.fund_types,
                    args.expenditure_types,
                    args.companies,
                    args.government_departments,
                    args.funders,
                ]
            ):
                results["metadata"] = metadata_seeder.seed_all()

            metadata_seeder.close()
        if (
            args.geography
            or args.countries
            or args.counties
            or args.constituencies
            or args.wards
        ):
            from app.routes.geography.seeder import GeographySeeder

            geography_seeder = GeographySeeder()

            # Seed specific models if requested
            if args.countries:
                results["countries"] = geography_seeder.seed_countries()
            if args.counties:
                results["counties"] = geography_seeder.seed_counties()
            if args.constituencies:
                results["constituencies"] = geography_seeder.seed_constituencies()
            if args.wards:
                results["wards"] = geography_seeder.seed_wards()

            # If --geography flag is used without specific models, seed all
            if args.geography and not any(
                [args.countries, args.counties, args.constituencies, args.wards]
            ):
                results["geography"] = geography_seeder.seed_all()

            geography_seeder.close()
        if (
            args.political
            or args.politicians
            or args.parties
            or args.elections
            or args.elective_positions
            or args.candidates
        ):
            from app.routes.political.seeder import PoliticalSeeder

            political_seeder = PoliticalSeeder()

            # Seed specific models if requested
            if args.politicians:
                results["politicians"] = political_seeder.seed_politicians()
            if args.parties:
                results["parties"] = political_seeder.seed_parties()
            if args.elections:
                results["elections"] = political_seeder.seed_elections()
            if args.elective_positions:
                results["elective_positions"] = (
                    political_seeder.seed_elective_positions()
                )
            if args.candidates:
                results["candidates"] = political_seeder.seed_candidates()

            # If --political flag is used without specific models, seed all
            if args.political and not any(
                [
                    args.politicians,
                    args.parties,
                    args.elections,
                    args.elective_positions,
                    args.candidates,
                ]
            ):
                results["political"] = political_seeder.seed_all()

            political_seeder.close()
        if (
            args.demography
            or args.populations
            or args.education
            or args.income
            or args.religion_demography
            or args.development
        ):
            from app.routes.demography.seeder import DemographySeeder

            demography_seeder = DemographySeeder()

            # Seed specific models if requested
            if args.populations:
                results["populations"] = demography_seeder.seed_population()
            if args.education:
                results["education"] = demography_seeder.seed_education()
            if args.income:
                results["income"] = demography_seeder.seed_income()
            if args.religion_demography:
                results["religion_demography"] = (
                    demography_seeder.seed_religion_demography()
                )
            if args.development:
                results["development"] = demography_seeder.seed_development()

            # If --demography flag is used without specific models, seed all
            if args.demography and not any(
                [
                    args.populations,
                    args.education,
                    args.income,
                    args.religion_demography,
                    args.development,
                ]
            ):
                results["demography"] = demography_seeder.seed_all()

            demography_seeder.close()
        if (
            args.finance
            or args.party_funds
            or args.candidate_funds
            or args.party_expenditure
            or args.candidate_expenditure
            or args.government_budgets
            or args.government_tenders
        ):
            from app.routes.finance.seeder import FinanceSeeder

            finance_seeder = FinanceSeeder()

            # Seed specific models if requested
            if args.party_funds:
                results["party_funds"] = finance_seeder.seed_party_funds()
            if args.candidate_funds:
                results["candidate_funds"] = finance_seeder.seed_candidate_funds()
            if args.party_expenditure:
                results["party_expenditure"] = finance_seeder.seed_party_expenditure()
            if args.candidate_expenditure:
                results["candidate_expenditure"] = (
                    finance_seeder.seed_candidate_expenditure()
                )
            if args.government_budgets:
                results["government_budgets"] = finance_seeder.seed_government_budgets()
            if args.government_tenders:
                results["government_tenders"] = finance_seeder.seed_government_tenders()

            # If --finance flag is used without specific models, seed all
            if args.finance and not any(
                [
                    args.party_funds,
                    args.candidate_funds,
                    args.party_expenditure,
                    args.candidate_expenditure,
                    args.government_budgets,
                    args.government_tenders,
                ]
            ):
                results["finance"] = finance_seeder.seed_all()

            finance_seeder.close()
        if args.auth:
            from app.routes.auth.seeder import AuthSeeder

            auth_seeder = AuthSeeder()
            results["auth"] = auth_seeder.seed_all()
            auth_seeder.close()

        total_seeded = sum(
            v if isinstance(v, int) else sum(v.values()) if isinstance(v, dict) else 0
            for v in results.values()
        )
        colored_print(f"✅ Seeded {total_seeded} records", Colors.GREEN)


def clear_data(args):
    """Clear seeded data"""
    colored_print("🗑️  Clearing seeded data...", Colors.BLUE)

    db_seeder = DatabaseSeeder()

    if db_seeder.clear_all_data():
        colored_print("✅ Seeded data cleared successfully", Colors.GREEN)
    else:
        colored_print("❌ Failed to clear data", Colors.RED)


def show_status(args):
    """Show database status"""
    colored_print("📊 Database Status", Colors.BLUE + Colors.BOLD)
    colored_print("=" * 50, Colors.BLUE)

    db_setup = DatabaseSetup()
    status = db_setup.get_status()

    # Connection status
    connection_color = Colors.GREEN if status.get("connection") else Colors.RED
    connection_text = "✅ Connected" if status.get("connection") else "❌ Disconnected"
    colored_print(f"Connection: {connection_text}", connection_color)

    # Database info
    colored_print(f"Database: {status.get('database_url', 'Unknown')}", Colors.WHITE)

    # Table info
    table_info = status.get("tables", {})
    table_count = table_info.get("table_count", 0)
    colored_print(f"Tables: {table_count}", Colors.WHITE)

    if table_count > 0 and args.verbose:
        colored_print("\nTable Details:", Colors.CYAN)
        for table_name, details in table_info.get("tables", {}).items():
            colored_print(
                f"  {table_name}: {details.get('column_count', 0)} columns",
                Colors.WHITE,
            )

    # Seeding stats
    seeding_stats = status.get("seeding_stats", {})
    if seeding_stats:
        colored_print("\nData Statistics:", Colors.CYAN)
        for data_type, count in seeding_stats.items():
            color = Colors.GREEN if count > 0 else Colors.YELLOW
            colored_print(f"  {data_type}: {count}", color)


def health_check(args):
    """Perform database health check"""
    colored_print("🏥 Database Health Check", Colors.BLUE + Colors.BOLD)
    colored_print("=" * 50, Colors.BLUE)

    db_setup = DatabaseSetup()
    health = db_setup.health_check()

    # Overall status
    status_colors = {
        "healthy": Colors.GREEN,
        "degraded": Colors.YELLOW,
        "unhealthy": Colors.RED,
    }
    status_color = status_colors.get(health.get("status", "unknown"), Colors.WHITE)
    status_icons = {"healthy": "✅", "degraded": "⚠️", "unhealthy": "❌"}
    status_icon = status_icons.get(health.get("status", "unknown"), "❓")

    colored_print(
        f"Overall Status: {status_icon} {health.get('status', 'unknown').upper()}",
        status_color + Colors.BOLD,
    )

    # Individual checks
    checks = [
        ("Connection", health.get("connection", False)),
        ("Tables Accessible", health.get("tables_accessible", False)),
        ("Admin Users", health.get("admin_users", False)),
    ]

    colored_print("\nDetailed Checks:", Colors.CYAN)
    for check_name, check_result in checks:
        check_color = Colors.GREEN if check_result else Colors.RED
        check_icon = "✅" if check_result else "❌"
        colored_print(f"  {check_name}: {check_icon}", check_color)

    # Issues
    issues = health.get("issues", [])
    if issues:
        colored_print("\nIssues Found:", Colors.RED + Colors.BOLD)
        for issue in issues:
            colored_print(f"  • {issue}", Colors.RED)


def backup_database(args):
    """Backup database"""
    colored_print("💾 Creating database backup...", Colors.BLUE)

    db_manager = DatabaseManager()

    if db_manager.backup_database(args.path):
        colored_print(f"✅ Database backed up to {args.path}", Colors.GREEN)
    else:
        colored_print("❌ Backup failed", Colors.RED)


def restore_database(args):
    """Restore database from backup"""
    colored_print("🔄 Restoring database from backup...", Colors.BLUE)

    db_manager = DatabaseManager()

    if db_manager.restore_database(args.path):
        colored_print(f"✅ Database restored from {args.path}", Colors.GREEN)
    else:
        colored_print("❌ Restore failed", Colors.RED)


def execute_sql(args):
    """Execute SQL command"""
    colored_print(f"🔧 Executing SQL: {args.sql}", Colors.BLUE)

    db_manager = DatabaseManager()
    results = db_manager.execute_sql(args.sql)

    if results:
        colored_print(f"✅ Query returned {len(results)} results:", Colors.GREEN)
        for i, row in enumerate(results[:10]):  # Show first 10 results
            colored_print(f"  Row {i+1}: {row}", Colors.WHITE)
        if len(results) > 10:
            colored_print(f"  ... and {len(results) - 10} more rows", Colors.CYAN)
    else:
        colored_print("✅ Query executed successfully (no results)", Colors.GREEN)


def interactive_mode():
    """Interactive database management mode"""
    colored_print("🎮 Interactive Database Management Mode", Colors.BLUE + Colors.BOLD)
    colored_print("=" * 50, Colors.BLUE)

    while True:
        colored_print("\nAvailable actions:", Colors.CYAN)
        colored_print("1. Create database", Colors.WHITE)
        colored_print("2. Create tables", Colors.WHITE)
        colored_print("3. Seed data", Colors.WHITE)
        colored_print("4. Show status", Colors.WHITE)
        colored_print("5. Health check", Colors.WHITE)
        colored_print("6. Reset database", Colors.WHITE)
        colored_print("7. Exit", Colors.WHITE)

        choice = colored_input("\nSelect action (1-7): ", Colors.CYAN)

        if choice == "1":
            db_name = (
                colored_input("Database name (default: polifin): ", Colors.CYAN)
                or "polifin"
            )
            args = argparse.Namespace(name=db_name)
            create_database(args)
        elif choice == "2":
            args = argparse.Namespace()
            create_tables(args)
        elif choice == "3":
            seed_all = (
                colored_input("Seed all data? (y/n): ", Colors.CYAN).lower() == "y"
            )
            args = argparse.Namespace(
                all=seed_all,
                users=False,
                counties=False,
                parties=False,
                candidates=False,
            )
            seed_database(args)
        elif choice == "4":
            args = argparse.Namespace(verbose=True)
            show_status(args)
        elif choice == "5":
            args = argparse.Namespace()
            health_check(args)
        elif choice == "6":
            confirm = colored_input(
                "This will reset the entire database. Are you sure? (type 'yes'): ",
                Colors.RED,
            )
            if confirm.lower() == "yes":
                args = argparse.Namespace(seed=True)
                reset_database(args)
            else:
                colored_print("Operation cancelled", Colors.YELLOW)
        elif choice == "7":
            colored_print("👋 Goodbye!", Colors.GREEN)
            break
        else:
            colored_print("Invalid choice. Please try again.", Colors.RED)


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="🗄️ Database Management CLI - Professional database operations for Katiba BookPlatform",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python database_cli.py create-db polifin              # Create database
  python database_cli.py create-tables                  # Create tables
  python database_cli.py seed --all                     # Seed all data
  python database_cli.py status                         # Show database status
  python database_cli.py health-check                   # Health check
  python database_cli.py reset --seed                   # Reset and seed database
  python database_cli.py backup backup.sql              # Create backup
  python database_cli.py interactive                     # Interactive mode
        """,
    )

    # Database operations
    parser.add_argument("--create-db", type=str, metavar="NAME", help="Create database")
    parser.add_argument(
        "--create-tables", action="store_true", help="Create database tables"
    )
    parser.add_argument(
        "--drop-tables", action="store_true", help="Drop database tables"
    )
    parser.add_argument(
        "--reset", action="store_true", help="Reset database (drop and recreate)"
    )
    parser.add_argument("--seed", action="store_true", help="Seed database with data")

    # Seeding options - Modules
    parser.add_argument("--all", action="store_true", help="Seed all data types")
    parser.add_argument(
        "--metadata", action="store_true", help="Seed all metadata data"
    )
    parser.add_argument(
        "--geography", action="store_true", help="Seed all geography data"
    )
    parser.add_argument(
        "--political", action="store_true", help="Seed all political data"
    )
    parser.add_argument(
        "--demography", action="store_true", help="Seed all demography data"
    )
    parser.add_argument("--finance", action="store_true", help="Seed all finance data")
    parser.add_argument("--auth", action="store_true", help="Seed all auth data")

    # Individual model flags - Metadata
    parser.add_argument("--timezones", action="store_true", help="Seed timezones only")
    parser.add_argument(
        "--currencies", action="store_true", help="Seed currencies only"
    )
    parser.add_argument("--religions", action="store_true", help="Seed religions only")
    parser.add_argument(
        "--climate-zones", action="store_true", help="Seed climate zones only"
    )
    parser.add_argument(
        "--fund-types", action="store_true", help="Seed fund types only"
    )
    parser.add_argument(
        "--expenditure-types", action="store_true", help="Seed expenditure types only"
    )
    parser.add_argument("--companies", action="store_true", help="Seed companies only")
    parser.add_argument(
        "--government-departments",
        action="store_true",
        help="Seed government departments only",
    )
    parser.add_argument("--funders", action="store_true", help="Seed funders only")

    # Individual model flags - Political
    parser.add_argument(
        "--politicians", action="store_true", help="Seed politicians only"
    )
    parser.add_argument(
        "--parties", action="store_true", help="Seed political parties only"
    )
    parser.add_argument("--elections", action="store_true", help="Seed elections only")
    parser.add_argument(
        "--elective-positions", action="store_true", help="Seed elective positions only"
    )
    parser.add_argument(
        "--candidates", action="store_true", help="Seed candidates only"
    )

    # Individual model flags - Geography
    parser.add_argument("--countries", action="store_true", help="Seed countries only")
    parser.add_argument("--counties", action="store_true", help="Seed counties only")
    parser.add_argument(
        "--constituencies", action="store_true", help="Seed constituencies only"
    )
    parser.add_argument("--wards", action="store_true", help="Seed wards only")

    # Individual model flags - Finance
    parser.add_argument(
        "--party-funds", action="store_true", help="Seed party funds only"
    )
    parser.add_argument(
        "--candidate-funds", action="store_true", help="Seed candidate funds only"
    )
    parser.add_argument(
        "--party-expenditure", action="store_true", help="Seed party expenditure only"
    )
    parser.add_argument(
        "--candidate-expenditure",
        action="store_true",
        help="Seed candidate expenditure only",
    )
    parser.add_argument(
        "--government-budgets", action="store_true", help="Seed government budgets only"
    )
    parser.add_argument(
        "--government-tenders", action="store_true", help="Seed government tenders only"
    )

    # Individual model flags - Demography
    parser.add_argument(
        "--populations", action="store_true", help="Seed population data only"
    )
    parser.add_argument(
        "--education", action="store_true", help="Seed education data only"
    )
    parser.add_argument("--income", action="store_true", help="Seed income data only")
    parser.add_argument(
        "--religion-demography",
        action="store_true",
        help="Seed religion demography data only",
    )
    parser.add_argument(
        "--development", action="store_true", help="Seed development data only"
    )

    # Legacy flags (kept for backward compatibility)
    parser.add_argument("--users", action="store_true", help="Seed admin users")

    # Data operations
    parser.add_argument("--clear", action="store_true", help="Clear all seeded data")
    parser.add_argument("--status", action="store_true", help="Show database status")
    parser.add_argument(
        "--health-check", action="store_true", help="Perform health check"
    )

    # Backup and restore
    parser.add_argument(
        "--backup", type=str, metavar="PATH", help="Backup database to file"
    )
    parser.add_argument(
        "--restore", type=str, metavar="PATH", help="Restore database from file"
    )

    # SQL operations
    parser.add_argument("--sql", type=str, metavar="QUERY", help="Execute SQL query")

    # General options
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument("--interactive", action="store_true", help="Interactive mode")

    args = parser.parse_args()

    # Show header
    colored_print("🗄️ Katiba BookDatabase Management CLI", Colors.BLUE + Colors.BOLD)
    colored_print("=" * 50, Colors.BLUE)

    try:
        # Interactive mode
        if args.interactive:
            interactive_mode()
            return

        # Route to appropriate function
        if args.create_db:
            args.name = args.create_db
            create_database(args)
        elif args.create_tables:
            create_tables(args)
        elif args.drop_tables:
            drop_tables(args)
        elif args.reset:
            reset_database(args)
        elif (
            args.seed
            or args.all
            or args.users
            or args.counties
            or args.parties
            or args.candidates
            or args.metadata
            or args.geography
            or args.political
            or args.demography
            or args.finance
            or args.auth
        ):
            seed_database(args)
        elif args.clear:
            clear_data(args)
        elif args.status:
            show_status(args)
        elif args.health_check:
            health_check(args)
        elif args.backup:
            args.path = args.backup
            backup_database(args)
        elif args.restore:
            args.path = args.restore
            restore_database(args)
        elif args.sql:
            args.sql = args.sql
            execute_sql(args)
        else:
            # Show help if no action specified
            parser.print_help()
            colored_print("\n💡 Use --interactive for guided mode", Colors.CYAN)

    except KeyboardInterrupt:
        colored_print("\n\n👋 Operation cancelled by user", Colors.YELLOW)
    except Exception as e:
        colored_print(f"\n❌ Error: {e}", Colors.RED)
        if args.verbose:
            import traceback

            traceback.print_exc()


if __name__ == "__main__":
    main()
