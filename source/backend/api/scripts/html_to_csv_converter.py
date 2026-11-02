#!/usr/bin/env python3
"""
HTML Table to CSV Converter

A robust Python script that converts HTML tables to CSV format.
Supports multiple tables, data cleaning, and various output options.

Usage:
    python html_to_csv_converter.py input.html output.csv
    python html_to_csv_converter.py input.html --table-index 0 --output output.csv
    python html_to_csv_converter.py input.html --all-tables --output-dir ./csv_output/
"""

import argparse
import csv
import os
import re
import sys
from typing import List, Dict, Any, Optional
import requests

try:
    from bs4 import BeautifulSoup
    import pandas as pd
except ImportError as e:
    print(f"❌ Missing required dependency: {e}")
    print("Please install with: pip install beautifulsoup4 pandas requests")
    sys.exit(1)


class HTMLTableConverter:
    """Convert HTML tables to CSV format with data cleaning capabilities."""

    def __init__(self, encoding: str = "utf-8"):
        self.encoding = encoding

    def load_html_from_file(self, file_path: str) -> BeautifulSoup:
        """Load HTML content from a local file."""
        try:
            with open(file_path, "r", encoding=self.encoding) as file:
                content = file.read()
            return BeautifulSoup(content, "html.parser")
        except FileNotFoundError:
            print(f"❌ File not found: {file_path}")
            sys.exit(1)
        except Exception as e:
            print(f"❌ Error reading file {file_path}: {e}")
            sys.exit(1)

    def load_html_from_url(self, url: str) -> BeautifulSoup:
        """Load HTML content from a URL."""
        try:
            headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
            response = requests.get(url, headers=headers, timeout=30)
            response.raise_for_status()
            return BeautifulSoup(response.content, "html.parser")
        except requests.RequestException as e:
            print(f"❌ Error fetching URL {url}: {e}")
            sys.exit(1)

    def clean_text(self, text: str) -> str:
        """Clean and normalize text content."""
        if not text:
            return ""

        # Remove extra whitespace
        text = re.sub(r"\s+", " ", text.strip())

        # Remove common HTML entities
        text = text.replace("&nbsp;", " ")
        text = text.replace("&amp;", "&")
        text = text.replace("&lt;", "<")
        text = text.replace("&gt;", ">")
        text = text.replace("&quot;", '"')
        text = text.replace("&#39;", "'")

        # Remove non-printable characters except newlines and tabs
        text = re.sub(r"[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]", "", text)

        return text.strip()

    def extract_table_data(self, table) -> List[List[str]]:
        """Extract data from a single HTML table."""
        rows_data = []

        # Find all rows (including both thead and tbody)
        rows = table.find_all("tr")

        for row in rows:
            row_data = []

            # Find all cells (both th and td)
            cells = row.find_all(["th", "td"])

            if not cells:
                continue

            for cell in cells:
                # Get cell text and clean it
                cell_text = self.clean_text(cell.get_text())

                # Handle colspan by adding empty cells for merged cells
                colspan = int(cell.get("colspan", 1))
                for _ in range(colspan):
                    row_data.append(cell_text)

            rows_data.append(row_data)

        return rows_data

    def normalize_table_structure(self, table_data: List[List[str]]) -> List[List[str]]:
        """Normalize table to have consistent number of columns."""
        if not table_data:
            return []

        # Find the maximum number of columns
        max_cols = max(len(row) for row in table_data)

        # Pad each row to have the same number of columns
        normalized_data = []
        for row in table_data:
            padded_row = row + [""] * (max_cols - len(row))
            normalized_data.append(padded_row)

        return normalized_data

    def detect_headers(self, table_data: List[List[str]]) -> Optional[List[str]]:
        """Attempt to detect header row in the table."""
        if not table_data or len(table_data) < 2:
            return None

        first_row = table_data[0]
        second_row = table_data[1]

        # Heuristics to detect if first row is a header:
        # 1. First row contains non-numeric content while second row has numeric data
        # 2. First row has shorter text on average
        # 3. First row contains common header keywords

        numeric_count_second = sum(1 for cell in second_row if self._is_numeric(cell))
        numeric_count_first = sum(1 for cell in first_row if self._is_numeric(cell))

        header_keywords = ["name", "date", "amount", "total", "count", "id", "type", "status", "description"]
        has_header_keywords = any(keyword.lower() in " ".join(first_row).lower() for keyword in header_keywords)

        # Consider first row as header if:
        # - It has significantly fewer numeric values than the second row, OR
        # - It contains header keywords
        if (numeric_count_first < numeric_count_second / 2) or has_header_keywords:
            return first_row

        return None

    def _is_numeric(self, text: str) -> bool:
        """Check if text represents a numeric value."""
        try:
            # Remove common currency symbols and commas
            clean_text = re.sub(r"[$,€£¥%]", "", text.strip())
            float(clean_text)
            return True
        except ValueError:
            return False

    def convert_to_csv(self, table_data: List[List[str]], output_path: str, headers: Optional[List[str]] = None) -> None:
        """Convert table data to CSV file."""
        try:
            # Ensure output directory exists (only if path has a directory)
            output_dir = os.path.dirname(output_path)
            if output_dir:
                os.makedirs(output_dir, exist_ok=True)

            with open(output_path, "w", newline="", encoding=self.encoding) as csvfile:
                writer = csv.writer(csvfile)

                # Write headers if provided
                if headers:
                    writer.writerow(headers)
                    # Skip the header row in data if it was detected as headers
                    table_data = table_data[1:] if table_data else table_data

                # Write table data
                writer.writerows(table_data)

            print(f"✅ CSV saved to: {output_path}")

        except Exception as e:
            print(f"❌ Error writing CSV file {output_path}: {e}")
            sys.exit(1)

    def convert_to_dataframe(self, table_data: List[List[str]], headers: Optional[List[str]] = None) -> pd.DataFrame:
        """Convert table data to pandas DataFrame."""
        if headers:
            # Skip header row in data if headers are provided separately
            data_rows = table_data[1:] if table_data and len(table_data) > 1 else table_data
            return pd.DataFrame(data_rows, columns=headers)
        else:
            return pd.DataFrame(table_data)

    def analyze_column_data_types(self, table_data: List[List[str]]) -> List[str]:
        """Analyze the dominant data type for each column."""
        if not table_data:
            return []

        column_types = []
        num_cols = len(table_data[0])

        for col_idx in range(num_cols):
            type_counts = {"numeric": 0, "text": 0, "empty": 0}

            for row in table_data:
                if col_idx < len(row):
                    cell_value = row[col_idx].strip()
                    if not cell_value:
                        type_counts["empty"] += 1
                    elif self._is_numeric(cell_value):
                        type_counts["numeric"] += 1
                    else:
                        type_counts["text"] += 1

            # Determine dominant type (excluding empty cells)
            if type_counts["numeric"] > type_counts["text"]:
                column_types.append("numeric")
            elif type_counts["text"] > type_counts["numeric"]:
                column_types.append("text")
            else:
                column_types.append("mixed")

        return column_types

    def count_empty_columns(self, row: List[str]) -> int:
        """Count empty or whitespace-only cells in a row."""
        return sum(1 for cell in row if not cell.strip())

    def is_self_repeating_row(self, row: List[str]) -> bool:
        """Check if row has self-repeating patterns (same value repeated)."""
        if len(row) < 3:
            return False

        non_empty_cells = [cell.strip() for cell in row if cell.strip()]
        if len(non_empty_cells) < 3:
            return False

        # Check if most non-empty cells are the same
        unique_values = set(non_empty_cells)
        if len(unique_values) == 1:
            return True

        # Check for simple repeating patterns
        if len(non_empty_cells) >= 4:
            first_half = non_empty_cells[: len(non_empty_cells) // 2]
            second_half = non_empty_cells[len(non_empty_cells) // 2 :]
            if first_half == second_half:
                return True

        return False

    def is_orphan_row(
        self, row: List[str], column_types: List[str], empty_column_threshold: float, row_index: int, total_rows: int
    ) -> tuple[bool, str]:
        """Determine if a row is an orphan based on various criteria."""
        if not row:
            return True, "empty_row"

        empty_count = self.count_empty_columns(row)
        total_cols = len(row)
        empty_ratio = empty_count / total_cols if total_cols > 0 else 1

        # Rule 1: Too many empty columns (more than threshold)
        if empty_ratio > empty_column_threshold:
            return True, f"too_many_empty_cols ({empty_ratio:.2f})"

        # Rule 2: Self-repeating patterns
        if self.is_self_repeating_row(row):
            return True, "self_repeating_pattern"

        # Rule 3: Data type mismatch with column patterns
        if column_types and len(column_types) == len(row):
            mismatches = 0
            for cell, expected_type in zip(row, column_types):
                cell_value = cell.strip()
                if not cell_value:
                    continue

                if expected_type == "numeric" and not self._is_numeric(cell_value):
                    mismatches += 1
                elif expected_type == "text" and self._is_numeric(cell_value):
                    mismatches += 1

            # If more than 70% of non-empty cells don't match expected types
            non_empty_count = total_cols - empty_count
            if non_empty_count > 0 and mismatches / non_empty_count > 0.7:
                return True, f"data_type_mismatch ({mismatches}/{non_empty_count})"

        # Rule 4: Suspicious single-word or single-character rows
        non_empty_cells = [cell.strip() for cell in row if cell.strip()]
        if len(non_empty_cells) == 1:
            single_value = non_empty_cells[0]
            if len(single_value) <= 2 and not single_value.isdigit():
                return True, "suspicious_single_short_value"

        return False, ""

    def clean_orphan_rows(self, table_data: List[List[str]]) -> List[List[str]]:
        """Remove orphan rows from table data."""
        if not table_data or len(table_data) < 3:
            return table_data

        # Analyze column data types (excluding potential header rows)
        data_rows = table_data[1:] if len(table_data) > 1 else table_data
        column_types = self.analyze_column_data_types(data_rows)

        # Calculate empty column threshold (95th percentile)
        empty_ratios = []
        for row in table_data:
            empty_count = self.count_empty_columns(row)
            empty_ratios.append(empty_count / len(row) if row else 1)

        empty_ratios.sort()
        threshold_index = int(len(empty_ratios) * 0.95)
        empty_column_threshold = empty_ratios[min(threshold_index, len(empty_ratios) - 1)]

        print(f"🔍 Cleaning orphan rows (empty column threshold: {empty_column_threshold:.2f})")

        cleaned_data = []
        removed_count = 0
        removal_reasons = {}

        for row_idx, row in enumerate(table_data):
            is_orphan, reason = self.is_orphan_row(row, column_types, empty_column_threshold, row_idx, len(table_data))

            if is_orphan:
                removed_count += 1
                removal_reasons[reason] = removal_reasons.get(reason, 0) + 1
                continue

            cleaned_data.append(row)

        # Log removal statistics
        if removed_count > 0:
            print(f"🗑️  Removed {removed_count} orphan rows:")
            for reason, count in removal_reasons.items():
                print(f"   - {reason}: {count} rows")

        return cleaned_data

    def is_valid_table(self, table, table_data: List[List[str]]) -> bool:
        """Check if table meets filtering criteria."""
        # Rule 1: Maximum 20 columns
        if table_data and len(table_data[0]) > 20:
            return False

        # Rule 2: Exclude tables that contain other tables as children
        nested_tables = table.find_all("table")
        if nested_tables:
            return False

        # Rule 3: Check for proper table structure
        rows = table.find_all("tr")
        if len(rows) < 2:  # Need at least 2 rows to be considered a proper table
            return False

        # Check if table has meaningful data (not empty or just whitespace)
        non_empty_cells = 0
        for row in table_data:
            for cell in row:
                if cell.strip():
                    non_empty_cells += 1

        # Require at least 3 non-empty cells to be considered a valid table
        if non_empty_cells < 3:
            return False

        # Rule 4: Check for reasonable column-to-row ratio
        if table_data:
            cols = len(table_data[0])
            rows_count = len(table_data)
            # Avoid extremely wide but short tables or vice versa
            if cols > 10 and rows_count < 3:
                return False
            if rows_count > 100 and cols < 2:
                return False

        return True

    def extract_all_tables(self, soup: BeautifulSoup) -> List[Dict[str, Any]]:
        """Extract all tables from HTML with metadata and filtering."""
        tables = []
        table_elements = soup.find_all("table")

        for i, table in enumerate(table_elements):
            # Extract table data
            raw_data = self.extract_table_data(table)
            normalized_data = self.normalize_table_structure(raw_data)

            # Apply filtering rules
            if not self.is_valid_table(table, normalized_data):
                print(f"⚠️  Skipping Table {i}: Does not meet filtering criteria")
                continue

            # Clean orphan rows
            cleaned_data = self.clean_orphan_rows(normalized_data)

            # Skip if cleaning removed too much data
            if len(cleaned_data) < 2:
                print(f"⚠️  Skipping Table {i}: Too few rows after cleaning")
                continue

            # Detect headers (after cleaning)
            headers = self.detect_headers(cleaned_data)

            # Get table metadata
            table_id = table.get("id", f"table_{i}")
            table_class = table.get("class", [])
            # Ensure table_class is a list of strings for join
            if table_class and not all(isinstance(cls, str) for cls in table_class):
                table_class = [str(cls) for cls in table_class]
            table_caption = table.find("caption")
            caption_text = self.clean_text(table_caption.get_text()) if table_caption else ""

            tables.append(
                {
                    "index": i,
                    "id": table_id,
                    "class": " ".join(table_class) if table_class else "",
                    "caption": caption_text,
                    "headers": headers,
                    "data": cleaned_data,
                    "rows": len(cleaned_data),
                    "columns": len(cleaned_data[0]) if cleaned_data else 0,
                }
            )

        return tables


def main():
    """Main function to handle command line interface."""
    parser = argparse.ArgumentParser(
        description="Convert HTML tables to CSV format",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Convert all tables to ./x_csv/ folder (default behavior)
  python html_to_csv_converter.py input.html
  
  # Convert all tables from URL to ./x_csv/ folder
  python html_to_csv_converter.py https://example.com/page.html
  
  # Convert specific table by index
  python html_to_csv_converter.py input.html --table-index 2 --output specific_table.csv
  
  # List all tables without converting
  python html_to_csv_converter.py input.html --list-tables
        """,
    )

    parser.add_argument("input", help="HTML file path or URL")
    parser.add_argument("--output", "-o", help="Output CSV file path (optional - if not specified, converts all tables to ./x_csv/)")
    parser.add_argument("--table-index", "-t", type=int, help="Table index to convert (required when using --output)")
    parser.add_argument("--output-dir", "-d", default="./x_csv", help="Output directory for multiple tables (default: ./x_csv)")
    parser.add_argument("--encoding", "-e", default="utf-8", help="File encoding (default: utf-8)")
    parser.add_argument("--list-tables", "-l", action="store_true", help="List all found tables without converting")

    args = parser.parse_args()

    # Validate arguments
    if args.output and args.table_index is None:
        print("❌ --table-index is required when using --output")
        sys.exit(1)

    # Initialize converter
    converter = HTMLTableConverter(encoding=args.encoding)

    # Load HTML content
    print(f"📄 Loading HTML from: {args.input}")
    if args.input.startswith(("http://", "https://")):
        soup = converter.load_html_from_url(args.input)
    else:
        soup = converter.load_html_from_file(args.input)

    # Extract all tables
    tables = converter.extract_all_tables(soup)

    if not tables:
        print("⚠️  No tables found in the HTML content")
        return

    print(f"📊 Found {len(tables)} table(s) in the HTML")

    # List tables if requested
    if args.list_tables:
        print("\n📋 Table Summary:")
        print("-" * 80)
        for i, table in enumerate(tables):
            print(f"Table {i}:")
            print(f"  ID: {table['id']}")
            print(f"  Class: {table['class']}")
            print(f"  Caption: {table['caption']}")
            print(f"  Size: {table['rows']} rows × {table['columns']} columns")
            if table["headers"]:
                print(f"  Headers: {', '.join(table['headers'][:5])}{'...' if len(table['headers']) > 5 else ''}")
            print()
        return

    # Convert tables
    if args.output:
        # Convert single specific table
        if args.table_index >= len(tables):
            print(f"❌ Table index {args.table_index} out of range. Found {len(tables)} tables.")
            return

        table = tables[args.table_index]

        print(f"\n🔄 Converting Table {args.table_index}...")
        print(f"   Size: {table['rows']} rows × {table['columns']} columns")
        if table["headers"]:
            print(f"   Headers: {', '.join(table['headers'][:5])}{'...' if len(table['headers']) > 5 else ''}")

        converter.convert_to_csv(table["data"], args.output, table["headers"])
        print(f"\n🎉 Conversion completed successfully!")

    else:
        # Default behavior: convert all tables to ./x_csv/ folder
        os.makedirs(args.output_dir, exist_ok=True)

        for i, table in enumerate(tables):
            # Generate filename
            table_name = table["id"].replace("/", "_").replace("\\", "_")
            if not table_name or table_name == f"table_{i}":
                table_name = f"table_{i+1}"

            # Add size info to filename for better identification
            size_suffix = f"_{table['rows']}x{table['columns']}"
            filename = f"{table_name}{size_suffix}.csv"
            output_path = os.path.join(args.output_dir, filename)

            print(f"\n🔄 Converting Table {i} ({table_name})...")
            print(f"   Size: {table['rows']} rows × {table['columns']} columns")
            if table["headers"]:
                print(f"   Headers: {', '.join(table['headers'][:3])}{'...' if len(table['headers']) > 3 else ''}")

            converter.convert_to_csv(table["data"], output_path, table["headers"])

        print(f"\n🎉 All {len(tables)} tables converted to CSV in: {args.output_dir}")
        print(f"📁 Files created:")
        for i, table in enumerate(tables):
            table_name = table["id"].replace("/", "_").replace("\\", "_")
            if not table_name or table_name == f"table_{i}":
                table_name = f"table_{i+1}"
            size_suffix = f"_{table['rows']}x{table['columns']}"
            filename = f"{table_name}{size_suffix}.csv"
            print(f"   - {filename}")


if __name__ == "__main__":
    main()
