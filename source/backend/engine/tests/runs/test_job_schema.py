"""The generated job schema file matches the typed job spec model."""

import os
from pathlib import Path

from mzizi_engine.runtime.runs.schema import job_schema_text

SCHEMA_FILE = Path(__file__).resolve().parents[4] / "schema" / "engine" / "job.schema.json"


def test_job_schema_file_is_generated_from_the_model() -> None:
    expected = job_schema_text()
    if os.environ.get("MZIZI_WRITE_SCHEMAS") == "1":
        SCHEMA_FILE.write_text(expected, encoding="utf-8")
    assert SCHEMA_FILE.read_text(encoding="utf-8") == expected, "run with MZIZI_WRITE_SCHEMAS=1 to regenerate"
