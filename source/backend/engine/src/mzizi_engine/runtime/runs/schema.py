"""The JSON Schema of a job spec, generated from the typed model so the schema file and the parser cannot drift."""

import json

from mzizi_engine.runtime.runs.parse import JobInput

SCHEMA_ID = "https://mzizi.africa/schemas/engine/job.schema.json"


def job_schema_text() -> str:
    """The canonical text of `source/schema/engine/job.schema.json`."""
    schema = JobInput.model_json_schema()
    document = {"$schema": "https://json-schema.org/draft/2020-12/schema", "$id": SCHEMA_ID, **schema}
    return json.dumps(document, indent=2, sort_keys=True, ensure_ascii=False) + "\n"
