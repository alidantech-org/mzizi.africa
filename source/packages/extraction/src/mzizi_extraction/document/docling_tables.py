"""Optional second opinion on tables from Docling (layout model plus TableFormer).

Docling pulls in PyTorch and model weights, so it is never imported here. It runs in its own interpreter, named by the
caller, and talks JSON over a subprocess. Absence of Docling is reported, never silent."""

from __future__ import annotations

import json
import subprocess
from pathlib import Path

from pydantic import BaseModel, ConfigDict

from mzizi_extraction.document.table_models import TableRows

RUNNER = """
import json, sys
from docling.document_converter import DocumentConverter
doc = DocumentConverter().convert(sys.argv[1]).document
out = []
for table in doc.tables:
    page = table.prov[0].page_no if table.prov else 0
    frame = table.export_to_dataframe(doc)
    rows = [list(map(str, frame.columns))] + [[str(v) for v in row] for row in frame.values.tolist()]
    out.append({"page": page, "rows": rows})
print(json.dumps(out))
"""


class DoclingTable(BaseModel):
    model_config = ConfigDict(frozen=True)
    page: int
    rows: TableRows


class DoclingUnavailable(RuntimeError):
    pass


def docling_tables(pdf: Path, python: Path, timeout: int = 900) -> list[DoclingTable]:
    """Tables Docling finds in the PDF. `python` is an interpreter that has Docling installed."""
    if not python.is_file():
        raise DoclingUnavailable(f"no interpreter at {python}; install Docling in its own environment")
    done = subprocess.run([str(python), "-c", RUNNER, str(pdf)], capture_output=True, text=True, timeout=timeout)
    if done.returncode != 0:
        raise DoclingUnavailable(done.stderr.strip().splitlines()[-1] if done.stderr else "docling failed")
    found = json.loads(done.stdout.strip().splitlines()[-1])
    return [DoclingTable(page=item["page"], rows=tuple(tuple(r) for r in item["rows"])) for item in found]
