"""
PDF Downloader - Non-blocking PDF download functionality
"""

import logging
import requests
import urllib3
from pathlib import Path
from typing import Dict, List
from concurrent.futures import ThreadPoolExecutor, as_completed
import hashlib

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


class PDFDownloader:
    """Handle PDF downloads in a non-blocking manner"""

    def __init__(self, max_workers: int = 3):
        self.logger = logging.getLogger(__name__)
        self.max_workers = max_workers
        self.downloaded_urls = set()  # Track downloaded URLs to avoid duplicates

    def _sanitize_filename(self, text: str, max_length: int = 100) -> str:
        """Create a safe filename from text"""
        # Remove invalid characters
        safe_chars = "".join(c for c in text if c.isalnum() or c in (" ", "-", "_"))
        safe_chars = safe_chars.strip().replace(" ", "_")

        # Limit length
        if len(safe_chars) > max_length:
            safe_chars = safe_chars[:max_length]

        # If empty, use hash
        if not safe_chars:
            safe_chars = hashlib.md5(text.encode()).hexdigest()[:10]

        return safe_chars

    def _download_single_pdf(
        self, pdf_info: Dict[str, str], output_dir: Path, index: int
    ) -> Dict[str, any]:
        """Download a single PDF file"""
        result = {
            "url": pdf_info["url"],
            "text": pdf_info["text"],
            "success": False,
            "filepath": None,
            "error": None,
            "size": 0,
        }

        try:
            url = pdf_info["url"]

            # Skip if already downloaded
            if url in self.downloaded_urls:
                result["error"] = "Already downloaded"
                return result

            self.logger.info(f"Downloading PDF {index}: {pdf_info['text'][:50]}...")

            # Download PDF (disable SSL verification for problematic sites)
            response = requests.get(url, timeout=30, stream=True, verify=False)
            response.raise_for_status()

            # Check if it's actually a PDF
            content_type = response.headers.get("Content-Type", "").lower()
            if "pdf" not in content_type and not url.lower().endswith(".pdf"):
                result["error"] = f"Not a PDF (Content-Type: {content_type})"
                return result

            # Create filename
            filename = self._sanitize_filename(pdf_info["text"])
            if not filename.endswith(".pdf"):
                filename += ".pdf"

            # Ensure unique filename
            filepath = output_dir / filename
            counter = 1
            while filepath.exists():
                base_name = filename.replace(".pdf", "")
                filepath = output_dir / f"{base_name}_{counter}.pdf"
                counter += 1

            # Save PDF
            with open(filepath, "wb") as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)

            file_size = filepath.stat().st_size

            result["success"] = True
            result["filepath"] = str(filepath)
            result["size"] = file_size

            self.downloaded_urls.add(url)
            self.logger.info(
                f"✓ Downloaded: {filepath.name} ({file_size / 1024:.1f} KB)"
            )

        except requests.exceptions.Timeout:
            result["error"] = "Download timeout"
            self.logger.warning(f"Timeout downloading: {pdf_info['url']}")
        except requests.exceptions.RequestException as e:
            result["error"] = f"Request error: {str(e)}"
            self.logger.warning(f"Error downloading: {pdf_info['url']} - {e}")
        except Exception as e:
            result["error"] = f"Unexpected error: {str(e)}"
            self.logger.error(f"Unexpected error downloading PDF: {e}")

        return result

    def download_pdfs(self, pdf_links: List, output_dir: Path) -> List[Dict[str, any]]:
        """
        Download multiple PDFs in parallel

        Args:
            pdf_links: List of PDF URLs (strings) or dictionaries with 'url' and 'text' keys
            output_dir: Directory to save PDFs

        Returns:
            List of result dictionaries
        """
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)

        # Normalize pdf_links to list of dicts
        normalized_links = []
        for item in pdf_links:
            if isinstance(item, str):
                # If it's just a URL string, create a dict
                normalized_links.append(
                    {
                        "url": item,
                        "text": item.split("/")[-1].replace(
                            ".pdf", ""
                        ),  # Use filename as text
                    }
                )
            elif isinstance(item, dict):
                # Already a dict, use as-is
                normalized_links.append(item)
            else:
                self.logger.warning(f"Invalid PDF link format: {item}")
                continue

        results = []

        # Download PDFs in parallel
        with ThreadPoolExecutor(max_workers=self.max_workers) as executor:
            futures = {
                executor.submit(
                    self._download_single_pdf, pdf_info, output_dir, idx
                ): pdf_info
                for idx, pdf_info in enumerate(normalized_links, 1)
            }

            for future in as_completed(futures):
                try:
                    result = future.result()
                    results.append(result)

                    if result["success"]:
                        self.logger.info(
                            f"✓ Downloaded: {result['filepath']} ({result['size']:,} bytes)"
                        )
                    else:
                        self.logger.warning(
                            f"✗ Failed: {result['url']} - {result['error']}"
                        )

                except Exception as e:
                    self.logger.error(f"Error in PDF download task: {e}")

        return results
