from pathlib import Path

from pdfmaker import make_pdf

from mzizi_extraction.folder import FolderRequest, extract_folder


def test_folder_extraction_writes_text_and_skips_unchanged_files(tmp_path: Path) -> None:
    source, out = tmp_path / "in", tmp_path / "out"
    source.mkdir()
    (source / "a.pdf").write_bytes(make_pdf([{"text": [(72, 720, "Hello Mzizi: a page with enough text to count")]}]))
    (source / "note.txt").write_text("ignored")
    request = FolderRequest(source=str(source), out_dir=str(out), ocr=False)
    first = extract_folder(request)
    assert first.extracted == 1 and "Hello Mzizi" in (out / "a" / "document.md").read_text()
    second = extract_folder(request)
    assert second.extracted == 0 and second.skipped == 1


def test_crop_png_survives_a_box_outside_the_page() -> None:
    from PIL import Image

    from mzizi_extraction.document.figures import Box, crop_png

    image = Image.new("RGB", (100, 100), "white")
    box = Box(x0=500.0, x1=600.0, top=900.0, bottom=950.0, has_image=True)
    assert crop_png(image, box).startswith(b"\x89PNG")
