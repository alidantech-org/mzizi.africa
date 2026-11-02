#!/usr/bin/env python3
"""
PDF Table Extraction CLI Tool
Professional extraction with quality scoring and parallel processing
"""

import sys

import os
import argparse
from pathlib import Path
import json
import time

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


def show_progress_loader(message: str, duration: float = None, steps: int = None):
    """Show an animated progress loader"""
    import itertools
    import threading
    import time

    spinner = itertools.cycle(["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"])

    if steps:
        # Show progress bar
        for i in range(steps + 1):
            progress = i / steps
            filled = int(progress * 20)
            bar = "█" * filled + "░" * (20 - filled)
            percent = int(progress * 100)
            print(
                f"\r{Colors.CYAN}{message} [{bar}] {percent}%{Colors.RESET}",
                end="",
                flush=True,
            )
            time.sleep(duration / steps if duration else 0.1)
        print()  # New line when complete
        return None
    elif duration:
        # Show spinner for fixed duration
        start_time = time.time()
        while (time.time() - start_time) < duration:
            print(
                f"\r{Colors.CYAN}{message} {next(spinner)}{Colors.RESET}",
                end="",
                flush=True,
            )
            time.sleep(0.1)
        print(f'\r{" " * 80}\r', end="", flush=True)
        return None
    else:
        # For indeterminate progress, return a function to stop
        stop_event = threading.Event()

        def spin():
            while not stop_event.is_set():
                print(
                    f"\r{Colors.CYAN}{message} {next(spinner)}{Colors.RESET}",
                    end="",
                    flush=True,
                )
                time.sleep(0.1)

        thread = threading.Thread(target=spin)
        thread.daemon = True
        thread.start()

        def stop():
            stop_event.set()
            print(f'\r{" " * 80}\r', end="", flush=True)

        return stop


def show_initializing_loader():
    """Show a quick loading animation for initialization"""
    show_progress_loader("🚀 Initializing PDF extractor", duration=1.5)


# Import file manager
try:
    from app.services.file_manager import FileManager

    file_manager = FileManager("extractions")  # Uses hardcoded _data paths
    colored_print("[INFO] ✅ File manager loaded successfully", Colors.GREEN)
except ImportError as e:
    colored_print(f"[ERROR] Failed to import file manager: {e}", Colors.RED)
    sys.exit(1)

from app.services.pdf_extractor import EnhancedStreamingPDFExtractor


def clear_pdf_extraction(pdf_files: list, confirm: bool = True):
    """Clear extraction data for specific PDFs only"""
    import shutil

    cleared_count = 0
    failed_count = 0

    for pdf_file in pdf_files:
        try:
            # Get the PDF filename without extension
            pdf_path = Path(pdf_file)
            pdf_name = pdf_path.stem
            # Normalize the name (same as extractor does)
            normalized_name = "".join(
                c if c.isalnum() else "_" for c in pdf_name
            ).lower()

            # Get the extraction directory for this PDF
            output_dir = file_manager.get_output_dir()
            pdf_extraction_dir = output_dir / normalized_name

            if pdf_extraction_dir.exists():
                if confirm:
                    colored_print(
                        f"[INFO] Clearing extraction data for: {pdf_name}",
                        Colors.YELLOW,
                    )
                    colored_print(
                        f"[INFO] Target directory: {pdf_extraction_dir}", Colors.YELLOW
                    )
                    confirm_input = (
                        colored_input("Confirm deletion? [y/N]: ", Colors.CYAN)
                        .strip()
                        .lower()
                    )
                    if confirm_input not in ["y", "yes"]:
                        colored_print(
                            f"[INFO] Skipped clearing {pdf_name}", Colors.YELLOW
                        )
                        continue

                # Remove the directory
                shutil.rmtree(pdf_extraction_dir)
                cleared_count += 1
                colored_print(
                    f"[INFO] ✅ Cleared extraction data for: {pdf_name}", Colors.GREEN
                )
            else:
                colored_print(
                    f"[INFO] No existing data found for: {pdf_name}", Colors.CYAN
                )

        except Exception as e:
            failed_count += 1
            colored_print(
                f"[ERROR] Failed to clear data for {pdf_file}: {e}", Colors.RED
            )

    if cleared_count > 0:
        colored_print(
            f"[INFO] ✅ Successfully cleared {cleared_count} PDF extraction(s)",
            Colors.GREEN,
        )
    if failed_count > 0:
        colored_print(
            f"[WARNING] ⚠️  Failed to clear {failed_count} PDF extraction(s)",
            Colors.YELLOW,
        )

    return cleared_count > 0


def list_available_pdfs():
    try:
        pdf_files = file_manager.list_pdf_files()
    except FileNotFoundError as e:
        colored_print(f"[ERROR] {e}", Colors.RED)
        return []

    if not pdf_files:
        input_dir = file_manager.get_input_dir("pdf")
        colored_print(f"[ERROR] No PDFs found in {input_dir}", Colors.RED)
        return []

    colored_print(
        f"\n[INFO] Available PDFs in {file_manager.get_input_dir('pdf')}:", Colors.BLUE
    )
    colored_print("=" * 80, Colors.BLUE)

    for i, pdf_file in enumerate(pdf_files):
        pdf_info = file_manager.get_pdf_info(pdf_file)
        size_mb = pdf_info.get("size_mb", 0)

        # Color code by size
        if size_mb > 20:
            size_color = Colors.RED
        elif size_mb > 10:
            size_color = Colors.YELLOW
        else:
            size_color = Colors.GREEN

        colored_print(f"  [{i}] {pdf_file.name} ({size_mb:.1f} MB)", Colors.WHITE)

    colored_print("=" * 80, Colors.BLUE)
    return pdf_files


def arrow_file_selection():
    """Arrow key selection with keyboard module"""
    try:
        import keyboard
        import msvcrt  # Windows specific
    except ImportError:
        colored_print(
            "[WARNING] Arrow key selection not available, using number input",
            Colors.YELLOW,
        )
        return interactive_pdf_selection()

    pdf_files = list_available_pdfs()

    if not pdf_files:
        return []

    selected_indices = []
    current_index = 0

    while True:
        # Clear screen and show selection interface
        os.system("cls" if os.name == "nt" else "clear")

        colored_print(
            f"🚀 {Colors.BOLD}PDF Table Extraction Tool - Arrow Selection Mode{Colors.RESET}",
            Colors.CYAN,
        )
        colored_print(
            f"\n{Colors.BOLD}Use arrow keys to navigate, Space to select, Enter to confirm, Q to quit{Colors.RESET}\n",
            Colors.YELLOW,
        )

        # Show PDF list with current selection
        for i, pdf_file in enumerate(pdf_files):
            pdf_info = file_manager.get_pdf_info(pdf_file)
            size_mb = pdf_info.get("size_mb", 0)

            # Determine colors and symbols
            if i == current_index:
                cursor = "► "
                name_color = Colors.CYAN + Colors.BOLD
            else:
                cursor = "  "
                name_color = Colors.WHITE

            if i in selected_indices:
                status = "✓"
                status_color = Colors.GREEN
            else:
                status = " "
                status_color = Colors.WHITE

            # Size color
            if size_mb > 20:
                size_color = Colors.RED
            elif size_mb > 10:
                size_color = Colors.YELLOW
            else:
                size_color = Colors.GREEN

            line = f"{cursor}[{i}] {status_color}[{status}]{Colors.RESET} {name_color}{pdf_file.name}{Colors.RESET} ({size_color}{size_mb:.1f} MB{Colors.RESET})"
            print(line)

        # Show current selection summary
        if selected_indices:
            colored_print(f"\nSelected: {len(selected_indices)} files", Colors.GREEN)
        else:
            colored_print(f"\nSelected: 0 files", Colors.YELLOW)

        # Handle key input
        try:
            if msvcrt.kbhit():
                key = msvcrt.getch()

                if key == b"\r":  # Enter key
                    if selected_indices:
                        colored_print(
                            f"[INFO] Processing {len(selected_indices)} selected PDFs",
                            Colors.GREEN,
                        )
                        return [str(pdf_files[i]) for i in selected_indices]
                    else:
                        # Process current file if nothing selected
                        colored_print(
                            f"[INFO] Processing current selection: {pdf_files[current_index].name}",
                            Colors.GREEN,
                        )
                        return [str(pdf_files[current_index])]

                elif key == b" ":  # Space key
                    if current_index in selected_indices:
                        selected_indices.remove(current_index)
                    else:
                        selected_indices.append(current_index)

                elif key == b"q" or key == b"Q":  # Quit
                    colored_print("[INFO] Quitting...", Colors.YELLOW)
                    return []

                elif key == b"\x00" or key == b"\xe0":  # Function key prefix
                    key = msvcrt.getch()

                    if key == b"H":  # Up arrow
                        current_index = max(0, current_index - 1)
                    elif key == b"P":  # Down arrow
                        current_index = min(len(pdf_files) - 1, current_index + 1)
                    elif key == b"K":  # Left arrow
                        current_index = max(0, current_index - 5)
                    elif key == b"M":  # Right arrow
                        current_index = min(len(pdf_files) - 1, current_index + 5)

        except KeyboardInterrupt:
            colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
            return []
        except Exception as e:
            colored_print(f"[ERROR] Key input error: {e}", Colors.RED)
            break

    # Fallback to number input if arrow selection fails
    return interactive_pdf_selection()


def interactive_pdf_selection():
    """Interactive PDF selection with numbered options and colors"""
    pdf_files = list_available_pdfs()

    if not pdf_files:
        return []

    while True:
        try:
            colored_print(
                f"\n[INPUT] Enter PDF numbers to process (e.g., 0 2 4) or 'all' for all PDFs:",
                Colors.CYAN,
            )
            colored_print(f"[INPUT] Enter 'q' to quit", Colors.CYAN)
            user_input = colored_input("Your choice: ", Colors.CYAN).strip().lower()

            if user_input == "q":
                colored_print("[INFO] Quitting...", Colors.YELLOW)
                return []

            if user_input == "all":
                colored_print(
                    f"[INFO] Processing all {len(pdf_files)} PDFs", Colors.GREEN
                )
                return [str(f) for f in pdf_files]

            # Parse individual numbers
            indices = user_input.split()
            selected_files = []

            for idx_str in indices:
                try:
                    idx = int(idx_str)
                    if 0 <= idx < len(pdf_files):
                        selected_files.append(str(pdf_files[idx]))
                        colored_print(f"[SELECTED] {pdf_files[idx].name}", Colors.GREEN)
                    else:
                        colored_print(
                            f"[ERROR] Invalid index: {idx} (valid: 0-{len(pdf_files)-1})",
                            Colors.RED,
                        )
                        break
                except ValueError:
                    colored_print(f"[ERROR] Invalid number: {idx_str}", Colors.RED)
                    break
            else:
                # Only return if we didn't break from the loop
                if selected_files:
                    return selected_files

        except KeyboardInterrupt:
            colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
            return []
        except Exception as e:
            colored_print(f"[ERROR] Input error: {e}", Colors.RED)
            continue


def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="PDF table extraction with quality scoring and parallel processing",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Run in interactive mode (no arguments)
  python extractor_cli.py
  
  # List available PDFs
  python extractor_cli.py --list
  
  # Extract specific PDFs by index
  python extractor_cli.py --index 0 2 4 --workers 8
  
  # Extract with quality scoring and clear existing data
  python extractor_cli.py document.pdf --quality-threshold 50 --clear
  
  # Process all PDFs with parallel processing
  python extractor_cli.py "_data/input/pdf/*.pdf" --workers 8 --verbose --clear
        """,
    )

    parser.add_argument(
        "pdf_files",
        nargs="*",
        help="PDF file(s) to process (optional if using --index)",
    )
    parser.add_argument(
        "--index",
        "-i",
        type=int,
        nargs="+",
        help="Process specific PDFs by index (0, 2, 4, etc.)",
    )
    parser.add_argument(
        "--list", "-l", action="store_true", help="List available PDFs with indices"
    )
    parser.add_argument(
        "--output",
        "-o",
        default=str(file_manager.get_output_dir()),
        help=f"Output directory (default: {file_manager.get_output_dir()})",
    )
    parser.add_argument(
        "--workers",
        "-w",
        type=int,
        default=4,
        help="Number of parallel workers (default: 4)",
    )
    parser.add_argument(
        "--quality-threshold",
        "-q",
        type=int,
        default=10,
        help="Minimum quality score threshold (default: 10)",
    )
    parser.add_argument("--json", "-j", help="Save results to JSON file")
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose output")
    parser.add_argument(
        "--clear",
        "-c",
        action="store_true",
        help="Clear existing extraction data before processing",
    )
    parser.add_argument(
        "--pdf-dir",
        default=str(file_manager.get_input_dir("pdf")),
        help=f'PDF directory for --list option (default: {file_manager.get_input_dir("pdf")})',
    )

    args = parser.parse_args()

    # Handle list option
    if args.list:
        list_available_pdfs()
        return

    # Check if no arguments provided - enter interactive mode
    if len(sys.argv) == 1:
        colored_print(
            f"🚀 {Colors.BOLD}PDF Table Extraction Tool - Interactive Mode{Colors.RESET}",
            Colors.CYAN,
        )
        colored_print(
            "[INFO] No arguments provided, entering interactive mode...", Colors.YELLOW
        )

        # Choose selection method
        try:
            selection_method = (
                colored_input("Use arrow keys? [Y/n]: ", Colors.CYAN).strip().lower()
            )
            use_arrows = selection_method != "n"
        except:
            use_arrows = True

        # Interactive PDF selection
        if use_arrows:
            pdf_files = arrow_file_selection()
        else:
            pdf_files = interactive_pdf_selection()

        if not pdf_files:
            colored_print("[INFO] No PDFs selected. Exiting.", Colors.YELLOW)
            return

        # Ask for additional options
        colored_print(
            f"\n[INPUT] Additional options (press Enter for defaults):", Colors.CYAN
        )

        try:
            workers_input = colored_input(
                f"Number of workers [{args.workers}]: ", Colors.CYAN
            ).strip()
            if workers_input:
                args.workers = int(workers_input)

            quality_input = colored_input(
                f"Quality threshold [{args.quality_threshold}]: ", Colors.CYAN
            ).strip()
            if quality_input:
                args.quality_threshold = float(quality_input)

            verbose_input = (
                colored_input("Verbose output? [y/N]: ", Colors.CYAN).strip().lower()
            )
            args.verbose = verbose_input in ["y", "yes"]

            # Ask about clearing existing data
            clear_input = (
                colored_input(
                    "Clear existing extraction data first? [y/N]: ", Colors.CYAN
                )
                .strip()
                .lower()
            )
            clear_data = clear_input in ["y", "yes"]

            if clear_data:
                if not clear_pdf_extraction(pdf_files, confirm=True):
                    colored_print("[INFO] No extraction data cleared", Colors.YELLOW)

        except ValueError:
            colored_print("[WARNING] Invalid input, using defaults", Colors.YELLOW)
        except KeyboardInterrupt:
            colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
            return

        colored_print(f"\n[INFO] Starting extraction with:", Colors.GREEN)
        colored_print(f"  PDFs: {len(pdf_files)} files", Colors.WHITE)
        colored_print(f"  Workers: {args.workers}", Colors.WHITE)
        colored_print(f"  Quality threshold: {args.quality_threshold}", Colors.WHITE)
        colored_print(f"  Verbose: {args.verbose}", Colors.WHITE)
        print()

    else:
        # Set up logging for non-interactive mode
        import logging

        if args.verbose:
            logging.basicConfig(
                level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
            )
        else:
            logging.basicConfig(level=logging.INFO, format="%(message)s")

        logger = logging.getLogger(__name__)

        # Get PDF files from command line arguments
        pdf_files = []

        if args.index:
            # Process by index
            available_pdfs = list_available_pdfs()
            for idx in args.index:
                if 0 <= idx < len(available_pdfs):
                    pdf_files.append(str(available_pdfs[idx]))
                else:
                    logger.error(
                        f"[ERROR] Invalid index: {idx} (max: {len(available_pdfs)-1})"
                    )
        elif args.pdf_files:
            # Process by file patterns
            for pattern in args.pdf_files:
                if "*" in pattern or "?" in pattern:
                    # Handle glob patterns
                    from glob import glob

                    pdf_files.extend(glob(pattern))
                else:
                    # Handle single files
                    if Path(pattern).exists() and pattern.lower().endswith(".pdf"):
                        pdf_files.append(pattern)
                    else:
                        logger.error(f"[ERROR] File not found or not a PDF: {pattern}")
        else:
            logger.error(
                "[ERROR] No PDF files specified. Use --index, file patterns, or --list"
            )
            sys.exit(1)

        if not pdf_files:
            logger.error("[ERROR] No valid PDF files found")
            sys.exit(1)

    # Handle clear data option (both interactive and non-interactive)
    if args.clear:
        if clear_pdf_extraction(pdf_files, confirm=False):
            logger.info(f"[INFO] ✅ Cleared existing extraction data")
        else:
            logger.warning(f"[WARNING] ⚠️  Failed to clear some data")

    # Set up logging (for both interactive and non-interactive)
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

    colored_print("[INFO] 🚀 PDF Extraction Starting...", Colors.CYAN + Colors.BOLD)
    colored_print(f"[INFO] Processing {len(pdf_files)} PDF file(s)", Colors.WHITE)
    colored_print(f"[INFO] Using {args.workers} parallel workers", Colors.WHITE)
    colored_print(f"[INFO] Quality threshold: {args.quality_threshold}", Colors.WHITE)
    colored_print(
        f"[INFO] Output directory: {file_manager.get_output_dir()}", Colors.WHITE
    )

    # Show initialization loader
    show_initializing_loader()

    # Initialize enhanced extractor with file manager output directory
    extractor = EnhancedStreamingPDFExtractor(
        str(file_manager.get_output_dir()), args.workers
    )

    # Process each PDF
    all_results = []
    start_time = time.time()

    for i, pdf_file in enumerate(pdf_files):
        pdf_name = Path(pdf_file).name
        logger.info(f"\n[INFO] [{i+1}/{len(pdf_files)}] Processing: {pdf_name}")

        try:
            # Start progress loader for PDF loading
            stop_loader = show_progress_loader("📂 Loading PDF file")

            # Extract PDF with streaming
            result = extractor.extract_pdf_streaming(pdf_file)

            # Stop the progress loader
            if stop_loader:
                stop_loader()

            result["file_name"] = pdf_name
            all_results.append(result)

            if result["success"]:
                logger.info(f"[SUCCESS] Extraction completed!")
                logger.info(
                    f"   Pages: {result['pages_processed']}/{result['total_pages']}"
                )
                logger.info(f"   Tables: {result['total_tables']}")
                logger.info(f"   Rows: {result['total_rows']:,}")
                logger.info(
                    f"   Quality: {result['quality_metrics']['average_score']:.1f}"
                )
                logger.info(
                    f"   Best Method: {result['quality_metrics']['best_method']}"
                )
                logger.info(f"   Time: {result['extraction_time']:.1f}s")
            else:
                logger.error(f"[ERROR] Failed: {result.get('error', 'Unknown error')}")

        except Exception as e:
            logger.error(f"[ERROR] Failed: {str(e)}")
            result = {
                "file_name": pdf_name,
                "success": False,
                "error": str(e),
                "extraction_time": 0,
            }
            all_results.append(result)

    # Generate comprehensive summary
    total_time = time.time() - start_time
    successful = sum(1 for r in all_results if r["success"])
    total_tables = sum(r.get("total_tables", 0) for r in all_results)
    total_rows = sum(r.get("total_rows", 0) for r in all_results)
    total_pages = sum(r.get("total_pages", 0) for r in all_results)
    pages_processed = sum(r.get("pages_processed", 0) for r in all_results)

    # Quality metrics
    all_quality_scores = []
    all_methods = set()
    for r in all_results:
        if r.get("success") and "quality_metrics" in r:
            all_quality_scores.append(r["quality_metrics"]["average_score"])
            all_methods.update(r["quality_metrics"]["method_performance"].keys())

    avg_quality = (
        sum(all_quality_scores) / len(all_quality_scores) if all_quality_scores else 0
    )

    logger.info(f"\n[SUMMARY] Extraction Summary:")
    logger.info("=" * 60)
    logger.info(f"[INFO] Files: {len(all_results)} processed, {successful} successful")
    logger.info(f"[INFO] Pages: {pages_processed:,}/{total_pages:,} processed")
    logger.info(f"[INFO] Tables: {total_tables:,} extracted")
    logger.info(f"[INFO] Rows: {total_rows:,} extracted")
    logger.info(f"[INFO] Quality: {avg_quality:.1f} average score")
    logger.info(f"[INFO] Methods: {', '.join(all_methods) if all_methods else 'None'}")
    logger.info(f"[INFO] Time: {total_time:.1f}s total")
    logger.info(f"[INFO] Output: {args.output}")
    logger.info("=" * 60)

    # Performance metrics
    if total_time > 0:
        pages_per_sec = pages_processed / total_time
        rows_per_sec = total_rows / total_time
        logger.info(
            f"[INFO] Performance: {pages_per_sec:.1f} pages/sec, {rows_per_sec:.0f} rows/sec"
        )

    # Save JSON results if requested
    if args.json:
        json_path = Path(args.json)
        with open(json_path, "w") as f:
            json.dump(
                {
                    "summary": {
                        "files_processed": len(all_results),
                        "successful": successful,
                        "total_tables": total_tables,
                        "total_rows": total_rows,
                        "total_pages": total_pages,
                        "pages_processed": pages_processed,
                        "avg_quality": avg_quality,
                        "methods": list(all_methods),
                        "total_time": total_time,
                    },
                    "results": all_results,
                },
                f,
                indent=2,
                default=str,
            )
        logger.info(f"[INFO] Results saved to: {json_path}")

        logger.info(f"[INFO] JSON report saved to: {args.json}")

    # Warning for failed files
    failed_files = len(all_results) - successful
    if failed_files > 0:
        logger.warning(f"[WARNING] {failed_files} files failed to process")
        sys.exit(1)
    else:
        logger.info("[SUCCESS] All files processed successfully!")


if __name__ == "__main__":
    main()
