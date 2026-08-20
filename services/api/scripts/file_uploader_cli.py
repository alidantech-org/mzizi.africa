#!/usr/bin/env python3
"""
File Uploader CLI Tool
Bulk file upload to S3 with progress tracking and metadata support
"""

import sys
import os
import argparse
from pathlib import Path
import logging
import mimetypes
from typing import List, Dict, Any, Optional
import json
from datetime import datetime

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


# Import file uploader components
try:
    from app.config.database import get_db
    from app.routes.files.files_service import FileService
    from app.routes.files.files_repository import FileRepository
    from app.config.s3_service import get_s3_service

    colored_print(
        "[INFO] ✅ File uploader components loaded successfully", Colors.GREEN
    )
except ImportError as e:
    colored_print(
        f"[ERROR] Failed to import file uploader components: {e}", Colors.RED
    )
    sys.exit(1)


def get_file_type(file_path: Path) -> str:
    """Determine file type based on extension and content"""
    # Get MIME type
    mime_type, _ = mimetypes.guess_type(str(file_path))
    
    # Map to our file types
    if mime_type:
        if mime_type.startswith('image/'):
            return 'image'
        elif mime_type.startswith('video/'):
            return 'video'
        elif mime_type.startswith('audio/'):
            return 'audio'
        elif mime_type.startswith('text/'):
            return 'text'
        elif mime_type in ['application/pdf']:
            return 'document'
        elif mime_type in ['application/zip', 'application/x-zip-compressed', 'application/x-rar-compressed']:
            return 'archive'
        elif mime_type in ['application/json', 'application/xml']:
            return 'data'
    
    # Fallback to extension-based detection
    ext = file_path.suffix.lower()
    if ext in ['.pdf', '.doc', '.docx', '.txt', '.rtf']:
        return 'document'
    elif ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp']:
        return 'image'
    elif ext in ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']:
        return 'video'
    elif ext in ['.mp3', '.wav', '.flac', '.aac', '.ogg']:
        return 'audio'
    elif ext in ['.zip', '.rar', '.7z', '.tar', '.gz']:
        return 'archive'
    elif ext in ['.csv', '.json', '.xml', '.xlsx', '.xls']:
        return 'data'
    else:
        return 'other'


def list_available_files(input_dir: Path, recursive: bool = False) -> List[Path]:
    """List available files in directory"""
    if not input_dir.exists():
        colored_print(f"[ERROR] Input directory not found: {input_dir}", Colors.RED)
        return []

    if recursive:
        files = sorted([f for f in input_dir.rglob("*") if f.is_file()])
    else:
        files = sorted([f for f in input_dir.iterdir() if f.is_file()])

    colored_print(f"\n[INFO] Available files in {input_dir}:", Colors.BLUE)
    colored_print("=" * 80, Colors.BLUE)

    for i, file in enumerate(files):
        size_kb = file.stat().st_size / 1024
        file_type = get_file_type(file)
        colored_print(f"  [{i}] {file.name} ({size_kb:.1f} KB, {file_type})", Colors.WHITE)

    colored_print("=" * 80, Colors.BLUE)
    return files


def list_available_directories(input_dir: Path) -> List[Path]:
    """List available directories in current path"""
    if not input_dir.exists():
        colored_print(f"[ERROR] Directory not found: {input_dir}", Colors.RED)
        return []

    dirs = sorted([d for d in input_dir.iterdir() if d.is_dir()])
    
    colored_print(f"\n[INFO] Available directories in {input_dir}:", Colors.BLUE)
    colored_print("=" * 80, Colors.BLUE)
    
    # Add parent directory option if not at root
    if input_dir != input_dir.parent:
        colored_print(f"  [..] ../ (Go to parent directory)", Colors.CYAN)
    
    for i, directory in enumerate(dirs):
        # Count files and subdirectories
        file_count = len([f for f in directory.iterdir() if f.is_file()])
        dir_count = len([d for d in directory.iterdir() if d.is_dir()])
        
        colored_print(f"  [{i}] {directory.name}/ ({file_count} files, {dir_count} subdirs)", Colors.WHITE)
    
    colored_print("=" * 80, Colors.BLUE)
    return dirs


def interactive_directory_selection(start_dir: Path) -> Optional[Path]:
    """Interactive directory selection with navigation"""
    current_dir = start_dir
    
    while True:
        colored_print(f"\n[INFO] Current directory: {current_dir}", Colors.BOLD)
        list_available_directories(current_dir)
        
        # Calculate max index
        dirs = [d for d in current_dir.iterdir() if d.is_dir()]
        max_index = len(dirs) - 1
        parent_option = current_dir != current_dir.parent
        
        while True:
            try:
                if parent_option:
                    prompt = f"\n[INPUT] Enter directory number (0-{max_index}), '..' for parent, or 'q' to quit: "
                else:
                    prompt = f"\n[INPUT] Enter directory number (0-{max_index}) or 'q' to quit: "
                
                user_input = colored_input(prompt, Colors.CYAN).strip()
                
                if user_input == 'q':
                    return None
                elif user_input == '..' and parent_option:
                    current_dir = current_dir.parent
                    break
                else:
                    try:
                        idx = int(user_input)
                        if 0 <= idx <= max_index:
                            selected_dir = dirs[idx]
                            return selected_dir
                        else:
                            colored_print(f"[ERROR] Invalid index: {idx} (valid: 0-{max_index})", Colors.RED)
                    except ValueError:
                        colored_print(f"[ERROR] Please enter a valid number", Colors.RED)
                        
            except KeyboardInterrupt:
                colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
                return None


def interactive_directory_upload_options(selected_dir: Path) -> str:
    """Show upload options for selected directory"""
    colored_print(f"\n[INFO] Selected directory: {selected_dir}", Colors.BOLD)
    colored_print("=" * 80, Colors.BOLD)
    
    # Count files and subdirectories
    files = [f for f in selected_dir.iterdir() if f.is_file()]
    dirs = [d for d in selected_dir.iterdir() if d.is_dir()]
    
    colored_print(f"  Files in this directory: {len(files)}", Colors.WHITE)
    colored_print(f"  Subdirectories: {len(dirs)}", Colors.WHITE)
    colored_print("=" * 80, Colors.BOLD)
    
    while True:
        colored_print("\n[UPLOAD OPTIONS] Choose upload method:", Colors.CYAN)
        colored_print("  [1] Upload all files in this directory", Colors.WHITE)
        colored_print("  [2] Upload all files recursively (include subdirectories)", Colors.WHITE)
        colored_print("  [3] Choose specific files to upload", Colors.WHITE)
        colored_print("  [4] Navigate to subdirectory", Colors.WHITE)
        colored_print("  [b] Go back to directory selection", Colors.WHITE)
        colored_print("  [q] Quit", Colors.WHITE)
        
        choice = colored_input("\nYour choice: ", Colors.CYAN).strip().lower()
        
        if choice == 'q':
            return 'quit'
        elif choice == 'b':
            return 'back'
        elif choice == '1':
            return 'upload_current'
        elif choice == '2':
            return 'upload_recursive'
        elif choice == '3':
            return 'select_files'
        elif choice == '4':
            return 'navigate'
        else:
            colored_print("[ERROR] Invalid choice", Colors.RED)


def interactive_file_selection(input_dir: Path, recursive: bool = False):
    """Interactive file selection"""
    files = list_available_files(input_dir, recursive)

    if not files:
        colored_print(f"[ERROR] No files found", Colors.RED)
        return None

    while True:
        try:
            colored_print(
                f"\n[INPUT] Enter file number to upload (0-{len(files)-1}) or 'q' to quit:",
                Colors.CYAN,
            )
            user_input = colored_input("Your choice: ", Colors.CYAN).strip().lower()

            if user_input == "q":
                colored_print("[INFO] Quitting...", Colors.YELLOW)
                return None

            try:
                idx = int(user_input)
                if 0 <= idx < len(files):
                    selected_file = files[idx]
                    colored_print(f"[SELECTED] {selected_file.name}", Colors.GREEN)
                    return selected_file
                else:
                    colored_print(
                        f"[ERROR] Invalid index: {idx} (valid: 0-{len(files)-1})",
                        Colors.RED,
                    )
            except ValueError:
                colored_print(f"[ERROR] Please enter a valid number", Colors.RED)

        except KeyboardInterrupt:
            colored_print("\n[INFO] Cancelled by user", Colors.YELLOW)
            return None


def create_metadata(file_path: Path, custom_metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """Create metadata for file upload"""
    stat = file_path.stat()
    file_type = get_file_type(file_path)
    
    metadata = {
        "original_filename": file_path.name,
        "file_type": file_type,
        "file_size_bytes": stat.st_size,
        "file_size_kb": round(stat.st_size / 1024, 2),
        "file_size_mb": round(stat.st_size / (1024 * 1024), 2),
        "upload_source": "cli_uploader",
        "upload_timestamp": datetime.now().isoformat(),
        "file_extension": file_path.suffix.lower(),
        "detected_mime_type": mimetypes.guess_type(str(file_path))[0] or "application/octet-stream",
        "directory_path": str(file_path.parent),
        "relative_path": str(file_path),
    }
    
    if custom_metadata:
        metadata.update(custom_metadata)
    
    return metadata


async def upload_file(file_path: Path, description: Optional[str] = None, custom_metadata: Optional[Dict[str, Any]] = None) -> bool:
    """Upload a single file"""
    try:
        # Get database session
        db = next(get_db())
        
        # Create file service
        file_service = FileService(db)
        
        # Create metadata
        metadata = create_metadata(file_path, custom_metadata)
        if description:
            metadata["description"] = description
        
        # Read file content
        with open(file_path, 'rb') as f:
            content = f.read()
        
        # Determine content type
        content_type = mimetypes.guess_type(str(file_path))[0] or "application/octet-stream"
        
        # Upload file
        colored_print(f"[UPLOADING] {file_path.name}...", Colors.YELLOW)
        file_record = await file_service.create_file(
            filename=file_path.name,
            content=content,
            content_type=content_type,
            metadata=metadata
        )
        
        colored_print(f"[SUCCESS] ✅ Uploaded: {file_path.name}", Colors.GREEN)
        colored_print(f"[INFO] S3 Key: {file_record.s3_key}", Colors.BLUE)
        colored_print(f"[INFO] Public URL: {file_record.public_url}", Colors.BLUE)
        colored_print(f"[INFO] File ID: {file_record.id}", Colors.BLUE)
        
        return True
        
    except Exception as e:
        colored_print(f"[ERROR] ❌ Failed to upload {file_path.name}: {e}", Colors.RED)
        return False
    finally:
        if 'db' in locals():
            db.close()


async def upload_directory(input_dir: Path, recursive: bool = False, description: Optional[str] = None, custom_metadata: Optional[Dict[str, Any]] = None) -> Dict[str, int]:
    """Upload all files in directory"""
    if recursive:
        files = [f for f in input_dir.rglob("*") if f.is_file()]
    else:
        files = [f for f in input_dir.iterdir() if f.is_file()]
    
    if not files:
        colored_print(f"[ERROR] No files found in {input_dir}", Colors.RED)
        return {"total": 0, "success": 0, "failed": 0}
    
    colored_print(f"[INFO] Found {len(files)} files to upload", Colors.BLUE)
    
    success_count = 0
    failed_count = 0
    
    for i, file_path in enumerate(files, 1):
        colored_print(f"\n[PROGRESS] {i}/{len(files)}", Colors.CYAN)
        
        if await upload_file(file_path, description, custom_metadata):
            success_count += 1
        else:
            failed_count += 1
    
    return {
        "total": len(files),
        "success": success_count,
        "failed": failed_count
    }


async def main():
    """Main CLI function"""
    parser = argparse.ArgumentParser(
        description="📁 File Uploader - Bulk file upload to S3 with metadata",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python file_uploader_cli.py                                    # Interactive mode
  python file_uploader_cli.py --file document.pdf                 # Upload single file
  python file_uploader_cli.py --dir ./uploads                    # Upload directory
  python file_uploader_cli.py --dir ./uploads --recursive        # Upload directory recursively
  python file_uploader_cli.py --file document.pdf --desc "Important doc"  # With description
        """,
    )

    # Input/Output
    parser.add_argument("--file", type=str, help="Single file to upload")
    parser.add_argument("--dir", type=str, help="Directory to upload (all files)")
    parser.add_argument(
        "--input",
        type=str,
        default=".",
        help="Input directory for interactive mode (default: current directory)",
    )

    # Upload options
    parser.add_argument(
        "--recursive",
        action="store_true",
        help="Upload directory recursively (include subdirectories)",
    )
    parser.add_argument(
        "--desc",
        type=str,
        help="Description for uploaded files",
    )
    parser.add_argument(
        "--metadata",
        type=str,
        help="JSON metadata string (e.g., '{\"project\": \"my-project\"}')",
    )
    parser.add_argument(
        "--metadata-file",
        type=str,
        help="JSON file containing metadata",
    )

    # Other
    parser.add_argument("--verbose", "-v", action="store_true", help="Verbose logging")
    parser.add_argument("--interactive", "-i", action="store_true", help="Force interactive mode")

    args = parser.parse_args()

    # Setup logging
    if args.verbose:
        logging.basicConfig(level=logging.DEBUG)
    else:
        logging.basicConfig(level=logging.INFO)

    # Parse metadata
    custom_metadata = {}
    if args.metadata:
        try:
            custom_metadata = json.loads(args.metadata)
        except json.JSONDecodeError as e:
            colored_print(f"[ERROR] Invalid metadata JSON: {e}", Colors.RED)
            sys.exit(1)
    
    if args.metadata_file:
        try:
            with open(args.metadata_file, 'r') as f:
                file_metadata = json.load(f)
                custom_metadata.update(file_metadata)
        except (FileNotFoundError, json.JSONDecodeError) as e:
            colored_print(f"[ERROR] Failed to load metadata file: {e}", Colors.RED)
            sys.exit(1)

    # Print header
    colored_print("=" * 80, Colors.BOLD)
    colored_print("📁 FILE UPLOADER CLI", Colors.BOLD + Colors.CYAN)
    colored_print("=" * 80, Colors.BOLD)

    # Determine mode
    if args.file:
        # Single file mode
        file_path = Path(args.file)
        if not file_path.exists():
            colored_print(f"[ERROR] File not found: {file_path}", Colors.RED)
            sys.exit(1)
        
        colored_print(f"[INFO] Uploading single file: {file_path.name}", Colors.BLUE)
        success = await upload_file(file_path, args.desc, custom_metadata)
        sys.exit(0 if success else 1)
        
    elif args.dir:
        # Directory mode
        dir_path = Path(args.dir)
        if not dir_path.exists():
            colored_print(f"[ERROR] Directory not found: {dir_path}", Colors.RED)
            sys.exit(1)
        
        colored_print(f"[INFO] Uploading directory: {dir_path}", Colors.BLUE)
        results = await upload_directory(dir_path, args.recursive, args.desc, custom_metadata)
        
        colored_print(f"\n[SUMMARY] Upload completed:", Colors.BOLD)
        colored_print(f"  Total files: {results['total']}", Colors.WHITE)
        colored_print(f"  Successful: {results['success']}", Colors.GREEN)
        colored_print(f"  Failed: {results['failed']}", Colors.RED)
        
        sys.exit(0 if results['failed'] == 0 else 1)
        
    else:
        # Interactive mode
        input_dir = Path(args.input)
        
        while True:
            colored_print("\n[OPTIONS] Choose upload mode:", Colors.CYAN)
            colored_print("  [1] Upload single file", Colors.WHITE)
            colored_print("  [2] Select and upload directory", Colors.WHITE)
            colored_print("  [3] Upload current directory", Colors.WHITE)
            colored_print("  [4] Upload current directory (recursive)", Colors.WHITE)
            colored_print("  [q] Quit", Colors.WHITE)
            
            choice = colored_input("\nYour choice: ", Colors.CYAN).strip().lower()
            
            if choice == 'q':
                colored_print("[INFO] Goodbye!", Colors.YELLOW)
                break
            elif choice == '1':
                # Single file selection
                selected_file = interactive_file_selection(input_dir, False)
                if selected_file:
                    desc = colored_input("Description (optional): ", Colors.CYAN).strip() or None
                    await upload_file(selected_file, desc, custom_metadata)
            elif choice == '2':
                # Directory selection and upload options
                selected_dir = interactive_directory_selection(input_dir)
                if selected_dir:
                    # Handle directory upload options
                    while True:
                        upload_option = interactive_directory_upload_options(selected_dir)
                        
                        if upload_option == 'quit':
                            break
                        elif upload_option == 'back':
                            break  # Go back to main menu
                        elif upload_option == 'upload_current':
                            desc = colored_input("Description (optional): ", Colors.CYAN).strip() or None
                            results = await upload_directory(selected_dir, False, desc, custom_metadata)
                            colored_print(f"\n[SUMMARY] Upload completed:", Colors.BOLD)
                            colored_print(f"  Total files: {results['total']}", Colors.WHITE)
                            colored_print(f"  Successful: {results['success']}", Colors.GREEN)
                            colored_print(f"  Failed: {results['failed']}", Colors.RED)
                            break
                        elif upload_option == 'upload_recursive':
                            desc = colored_input("Description (optional): ", Colors.CYAN).strip() or None
                            results = await upload_directory(selected_dir, True, desc, custom_metadata)
                            colored_print(f"\n[SUMMARY] Upload completed:", Colors.BOLD)
                            colored_print(f"  Total files: {results['total']}", Colors.WHITE)
                            colored_print(f"  Successful: {results['success']}", Colors.GREEN)
                            colored_print(f"  Failed: {results['failed']}", Colors.RED)
                            break
                        elif upload_option == 'select_files':
                            selected_file = interactive_file_selection(selected_dir, False)
                            if selected_file:
                                desc = colored_input("Description (optional): ", Colors.CYAN).strip() or None
                                await upload_file(selected_file, desc, custom_metadata)
                            break
                        elif upload_option == 'navigate':
                            # Navigate to subdirectory
                            sub_dir = interactive_directory_selection(selected_dir)
                            if sub_dir:
                                selected_dir = sub_dir
                            else:
                                break
            elif choice == '3':
                # Directory upload (non-recursive) from current directory
                results = await upload_directory(input_dir, False, None, custom_metadata)
                colored_print(f"\n[SUMMARY] Upload completed:", Colors.BOLD)
                colored_print(f"  Total files: {results['total']}", Colors.WHITE)
                colored_print(f"  Successful: {results['success']}", Colors.GREEN)
                colored_print(f"  Failed: {results['failed']}", Colors.RED)
            elif choice == '4':
                # Directory upload (recursive) from current directory
                results = await upload_directory(input_dir, True, None, custom_metadata)
                colored_print(f"\n[SUMMARY] Upload completed:", Colors.BOLD)
                colored_print(f"  Total files: {results['total']}", Colors.WHITE)
                colored_print(f"  Successful: {results['success']}", Colors.GREEN)
                colored_print(f"  Failed: {results['failed']}", Colors.RED)
            else:
                colored_print("[ERROR] Invalid choice", Colors.RED)


if __name__ == "__main__":
    import asyncio
    asyncio.run(main())
