#!/usr/bin/env python3
"""
Web Search Scraper CLI Tool
Search engine scraping with Playwright, markdown output, and screenshots
"""

import sys
import os
import argparse
from pathlib import Path
import logging

# Handle Windows console encoding for emoji support
if sys.platform == "win32":
    try:
        import ctypes

        kernel32 = ctypes.windll.kernel32
        kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)
    except:
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


# Import web search scraper components
try:
    from app.services.web_search_scraper import WebSearchScraper, SearchConfig

    colored_print(
        "[INFO] ✅ Web search scraper components loaded successfully", Colors.GREEN
    )
except ImportError as e:
    colored_print(
        f"[ERROR] Failed to import web search scraper components: {e}", Colors.RED
    )
    sys.exit(1)


def list_available_csv_files(input_dir: Path):
    """List available CSV files"""
    if not input_dir.exists():
        colored_print(f"[ERROR] Input directory not found: {input_dir}", Colors.RED)
        return []

    csv_files = sorted([f for f in input_dir.glob("*.csv")])

    colored_print(f"\n[INFO] Available CSV files in {input_dir}:", Colors.BLUE)
    colored_print("=" * 80, Colors.BLUE)

    for i, csv_file in enumerate(csv_files):
        size_kb = csv_file.stat().st_size / 1024
        colored_print(f"  [{i}] {csv_file.name} ({size_kb:.1f} KB)", Colors.WHITE)

    colored_print("=" * 80, Colors.BLUE)
    return csv_files


def interactive_csv_selection(input_dir: Path):
    """Interactive CSV selection"""
    csv_files = list_available_csv_files(input_dir)

    if not csv_files:
        colored_print(f"[ERROR] No CSV files found", Colors.RED)
        return None

    while True:
        try:
            colored_print(
                f"\n[INPUT] Enter CSV file number to process (0-{len(csv_files)-1}) or 'q' to quit:",
                Colors.CYAN,
            )
            user_input = colored_input("Your choice: ", Colors.CYAN).strip().lower()

            if user_input == "q":
                colored_print("[INFO] Quitting...", Colors.YELLOW)
                return None

            try:
                idx = int(user_input)
                if 0 <= idx < len(csv_files):
                    selected_file = csv_files[idx]
                    colored_print(f"[SELECTED] {selected_file.name}", Colors.GREEN)
                    return selected_file
                else:
                    colored_print(
                        f"[ERROR] Invalid index: {idx} (valid: 0-{len(csv_files)-1})",
                        Colors.RED,
                    )
            except ValueError:
                colored_print(f"[ERROR] Please enter a valid number", Colors.RED)

        except KeyboardInterrupt:
            colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
            return None


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="🔍 Web Search Scraper - Search engine scraping with Playwright",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python web_search_scraper_cli.py                                    # Interactive mode
  python web_search_scraper_cli.py --csv kenya_queries.csv            # Specific CSV
  python web_search_scraper_cli.py --csv kenya_queries.csv --google   # Use Google
  python web_search_scraper_cli.py --csv kenya_queries.csv --show-browser  # Show browser
        """,
    )

    # Input/Output
    parser.add_argument("--csv", type=str, help="CSV file with search queries")
    parser.add_argument(
        "--input",
        type=str,
        default="_data/input/search_queries",
        help="Input directory (default: _data/input/search_queries)",
    )
    parser.add_argument(
        "--output",
        type=str,
        default="_data/output/web_search",
        help="Output directory (default: _data/output/web_search)",
    )

    # Search engine
    parser.add_argument(
        "--google",
        action="store_true",
        help="Use Google search (has CAPTCHA issues)",
    )
    parser.add_argument(
        "--bing",
        action="store_true",
        help="Use Bing search (better than Google, less CAPTCHA)",
    )
    parser.add_argument(
        "--duckduckgo",
        action="store_true",
        help="Use DuckDuckGo search (default, no CAPTCHA)",
    )

    # Browser settings
    parser.add_argument(
        "--show-browser",
        action="store_true",
        help="Show browser window (non-headless mode)",
    )
    parser.add_argument(
        "--browser",
        type=str,
        default="chromium",
        choices=["chromium", "firefox", "webkit"],
        help="Browser type (default: chromium)",
    )

    # Scraping settings
    parser.add_argument(
        "--max-results",
        type=int,
        default=20,
        help="Maximum results per query (default: 20)",
    )
    parser.add_argument(
        "--max-pages",
        type=int,
        default=5,
        help="Maximum pages to scrape per query (default: 5)",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=2.0,
        help="Delay between requests in seconds (default: 2.0)",
    )

    # Screenshot settings
    parser.add_argument(
        "--no-screenshots",
        action="store_true",
        help="Disable screenshot capture",
    )
    # Cloudflare handling
    parser.add_argument(
        "--skip-cloudflare",
        action="store_true",
        help="Skip sites with Cloudflare protection",
    )
    parser.add_argument(
        "--cloudflare-wait",
        type=int,
        default=30,
        help="Seconds to wait for Cloudflare challenge (default: 30)",
    )
    parser.add_argument(
        "--use-real-chrome",
        action="store_true",
        help="Use real Chrome browser instead of Chromium (better for bypassing detection)",
    )
    parser.add_argument(
        "--brave",
        type=str,
        metavar="PATH",
        help="Path to Brave browser executable (e.g., 'C:/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe')",
    )
    parser.add_argument(
        "--keep-browser",
        action="store_true",
        help="Keep browser open after scraping completes",
    )
    parser.add_argument(
        "--close-tabs",
        action="store_true",
        help="Close search result tabs after extracting results (default: keep open)",
    )
    parser.add_argument(
        "--failure-delay",
        type=float,
        default=5.0,
        help="Delay in seconds after failed requests (default: 5.0)",
    )
    parser.add_argument(
        "--no-html-snapshots",
        action="store_true",
        help="Disable saving HTML snapshots of search results (default: enabled)",
    )
    parser.add_argument(
        "--screenshot-format",
        type=str,
        default="png",
        choices=["png", "jpeg"],
        help="Screenshot format (default: png)",
    )

    # Other
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")

    args = parser.parse_args()

    # Setup logging
    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    # Print header
    colored_print("\n" + "=" * 80, Colors.CYAN + Colors.BOLD)
    colored_print("🔍 WEB SEARCH SCRAPER", Colors.CYAN + Colors.BOLD)
    colored_print("=" * 80 + "\n", Colors.CYAN + Colors.BOLD)

    # Determine search engine
    if args.google:
        search_engine = "google"
        colored_print("[INFO] Using Google Search", Colors.CYAN)
        colored_print(
            "[WARNING] Google may show CAPTCHA - consider using Bing or DuckDuckGo",
            Colors.YELLOW,
        )
    elif args.bing:
        search_engine = "bing"
        colored_print("[INFO] Using Bing Search", Colors.CYAN)
    else:
        search_engine = "duckduckgo"
        colored_print(
            "[INFO] Using DuckDuckGo Search (Recommended - No CAPTCHA)", Colors.CYAN
        )

    # Create configuration
    config = SearchConfig(
        headless=not args.show_browser,
        browser_type=args.browser,
        max_results_per_query=args.max_results,
        max_pages_to_visit=args.max_pages,
        delay_between_requests=args.delay,
        take_screenshots=not args.no_screenshots,
        screenshot_format=args.screenshot_format,
        skip_cloudflare_sites=args.skip_cloudflare,
        cloudflare_wait_time=args.cloudflare_wait * 1000,  # Convert to ms
        use_real_chrome=args.use_real_chrome,
        brave_executable_path=args.brave,
        keep_browser_open=args.keep_browser,
        retain_tabs=not args.close_tabs,
        delay_after_failure=args.failure_delay,
        save_html_snapshots=not args.no_html_snapshots,
    )

    colored_print(
        f"[INFO] Browser: {config.browser_type} (headless={config.headless})",
        Colors.CYAN,
    )
    colored_print(
        f"[INFO] Max results per query: {config.max_results_per_query}", Colors.CYAN
    )
    colored_print(
        f"[INFO] Max pages to scrape: {config.max_pages_to_visit}", Colors.CYAN
    )
    colored_print(
        f"[INFO] Screenshots: {'Enabled' if config.take_screenshots else 'Disabled'}",
        Colors.CYAN,
    )

    # Get CSV file
    input_dir = Path(args.input)

    if args.csv:
        csv_file = Path(args.csv)
        if not csv_file.exists():
            # Try in input directory
            csv_file = input_dir / args.csv
            if not csv_file.exists():
                colored_print(f"[ERROR] CSV file not found: {args.csv}", Colors.RED)
                sys.exit(1)
    else:
        # Interactive mode
        colored_print(
            f"\n🔍 {Colors.BOLD}Web Search Scraper - Interactive Mode{Colors.RESET}",
            Colors.CYAN,
        )
        colored_print(
            "[INFO] No CSV file specified, entering interactive mode...", Colors.YELLOW
        )
        csv_file = interactive_csv_selection(input_dir)

        if not csv_file:
            colored_print("[INFO] No CSV file selected. Exiting.", Colors.YELLOW)
            sys.exit(0)

    colored_print(
        f"\n[INFO] 🔍 Web Search Scraping Starting...", Colors.CYAN + Colors.BOLD
    )
    colored_print(f"[INFO] CSV file: {csv_file.name}", Colors.WHITE)
    colored_print(f"[INFO] Output directory: {args.output}", Colors.WHITE)

    # Create scraper
    try:
        scraper = WebSearchScraper(config=config, search_engine=search_engine)

        # Run scraper
        # Pass CSV filename for grouping
        csv_name = Path(csv_file).stem
        results = scraper.scrape_from_csv(
            str(csv_file), output_dir=Path(args.output), csv_name=csv_name
        )

        # Print summary
        colored_print("\n" + "=" * 80, Colors.GREEN)
        colored_print("📊 SCRAPING SUMMARY", Colors.GREEN + Colors.BOLD)
        colored_print("=" * 80, Colors.GREEN)

        if results:
            total_search_results = sum(
                len(r["search_results"]) for r in results.values()
            )
            total_scraped_pages = sum(len(r["scraped_pages"]) for r in results.values())

            colored_print(f"Queries processed: {len(results)}", Colors.WHITE)
            colored_print(f"Total search results: {total_search_results}", Colors.WHITE)
            colored_print(f"Total pages scraped: {total_scraped_pages}", Colors.WHITE)
            colored_print(f"Output: {args.output}", Colors.WHITE)
            colored_print("=" * 80, Colors.GREEN)
            colored_print(
                "🎉 All queries processed successfully!", Colors.GREEN + Colors.BOLD
            )
        else:
            colored_print("No results found", Colors.YELLOW)

    except Exception as e:
        colored_print(f"\n[ERROR] Scraping failed: {e}", Colors.RED)
        import traceback

        if args.verbose:
            colored_print(traceback.format_exc(), Colors.RED)
        sys.exit(1)


if __name__ == "__main__":
    main()
