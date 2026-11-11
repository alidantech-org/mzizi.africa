"""Builds tiny valid PDFs for tests: text pages, a ruled table, and an image-only (scanned) page."""

from __future__ import annotations


def _obj(n: int, body: bytes) -> bytes:
    return f"{n} 0 obj\n".encode() + body + b"\nendobj\n"


def make_pdf(pages: list[dict]) -> bytes:
    """pages: dicts with 'text' (list of (x, y, str)), 'grid' (x0, y0, cols, rows, cell_w, cell_h) and/or 'image' True."""
    objs: list[bytes] = []
    kids = []
    next_id = 4
    filler: list[int] = []
    page_objs = []
    for page in pages:
        stream = b""
        for x, y, s in page.get("text", []):
            stream += f"BT /F1 11 Tf {x} {y} Td ({s}) Tj ET\n".encode()
        if "grid" in page:
            x0, y0, cols, rows, cw, ch = page["grid"]
            for c in range(cols + 1):
                stream += f"{x0 + c * cw} {y0} m {x0 + c * cw} {y0 + rows * ch} l S\n".encode()
            for r in range(rows + 1):
                stream += f"{x0} {y0 + r * ch} m {x0 + cols * cw} {y0 + r * ch} l S\n".encode()
        if page.get("image"):
            stream += b"q 200 0 0 200 100 400 cm /Im1 Do Q\n"
        content_id, page_id, image_id = next_id, next_id + 1, next_id + 2
        next_id += 3
        if not page.get("image"):
            filler.append(image_id)
        resources = b"<< /Font << /F1 3 0 R >>"
        if page.get("image"):
            resources += f" /XObject << /Im1 {image_id} 0 R >>".encode()
        resources += b" >>"
        page_objs.append((content_id, stream, page_id, resources, image_id if page.get("image") else None))
        kids.append(page_id)
    objs.append(_obj(1, b"<< /Type /Catalog /Pages 2 0 R >>"))
    objs.append(_obj(2, f"<< /Type /Pages /Kids [{' '.join(f'{k} 0 R' for k in kids)}] /Count {len(kids)} >>".encode()))
    objs.append(_obj(3, b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"))
    extra: list[tuple[int, bytes]] = []
    for content_id, stream, page_id, resources, image_id in page_objs:
        extra.append(
            (content_id, b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"endstream")
        )
        extra.append(
            (
                page_id,
                b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents "
                + f"{content_id} 0 R".encode()
                + b" /Resources "
                + resources
                + b" >>",
            )
        )
        if image_id:
            pixel = bytes([200, 200, 200])
            extra.append(
                (
                    image_id,
                    b"<< /Type /XObject /Subtype /Image /Width 1 /Height 1 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Length 3 >>\nstream\n"
                    + pixel
                    + b"\nendstream",
                )
            )
    extra += [(n, b"null") for n in filler]
    for n, body in sorted(extra):
        objs.append(_obj(n, body))
    out = b"%PDF-1.4\n"
    offsets = {}
    for obj in objs:
        n = int(obj.split(b" ", 1)[0])
        offsets[n] = len(out)
        out += obj
    size = max(offsets) + 1
    xref_at = len(out)
    out += f"xref\n0 {size}\n".encode() + b"0000000000 65535 f \n"
    for n in range(1, size):
        out += f"{offsets[n]:010d} 00000 n \n".encode()
    out += f"trailer\n<< /Size {size} /Root 1 0 R >>\nstartxref\n{xref_at}\n%%EOF\n".encode()
    return out
