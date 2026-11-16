"""Deterministic JSON encoding for the run spec and local metadata."""

import hashlib
import json

from pydantic import BaseModel

from mzizi_engine.runtime.runs.contracts.spec import JobSpec


def canonical_json(model: BaseModel) -> bytes:
    return json.dumps(
        model.model_dump(mode="json"),
        sort_keys=True,
        ensure_ascii=False,
        separators=(",", ":"),
        allow_nan=False,
    ).encode("utf-8")


def spec_hash(spec: JobSpec) -> str:
    return hashlib.sha256(canonical_json(spec)).hexdigest()
