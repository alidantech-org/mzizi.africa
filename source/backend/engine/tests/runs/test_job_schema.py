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


def test_the_example_job_parses_with_the_real_registry() -> None:
    from mzizi_engine.config import EngineConfig
    from mzizi_engine.runtime.assembly.default_operations import build_default_registry
    from mzizi_engine.runtime.runs.parse import parse_job_spec

    example = SCHEMA_FILE.parent / "_example" / "job.json"
    spec = parse_job_spec(example.read_text(encoding="utf-8"), build_default_registry(EngineConfig.from_env({})))
    assert spec.sources[0].authority_ref == "ke.source.websites.example-ministry" and spec.stages[0].operation == "scraping.crawl"
