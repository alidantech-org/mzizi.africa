"""Run specs fail before execution when inputs or required settings cannot be resolved."""

import json
from pathlib import Path

import pytest

from mzizi_engine.config import ConfigError, EngineConfig
from mzizi_engine.runtime.assembly.default_operations import build_default_registry
from mzizi_engine.runtime.operations import OperationRegistry, Requirement
from mzizi_engine.runtime.runs.context import build_worker_context
from mzizi_engine.runtime.runs.encode import canonical_json, spec_hash
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_engine.runtime.runs.runner import validate_execution_scope


def _spec(operation: str, params: dict[str, str]) -> str:
    return json.dumps(
        {
            "spec_version": 1,
            "kind": "collection",
            "name": "example",
            "sources": [{"url": "http://127.0.0.1/", "authority_ref": "local-fixture"}],
            "stages": [{"operation": operation, "params": params}],
        }
    )


@pytest.fixture
def registry() -> OperationRegistry:
    return build_default_registry(EngineConfig.from_env({}))


def test_spec_contains_validated_requests_and_hashes_canonical_json(registry: OperationRegistry) -> None:
    params = {"out_dir": "./output", "url": "http://127.0.0.1/"}
    spec = parse_job_spec(_spec("scraping.crawl", params), registry)
    assert type(spec.stages[0].params) is registry.get("scraping.crawl").request_model
    assert spec_hash(
        parse_job_spec(_spec("scraping.crawl", dict(reversed(tuple(params.items())))), registry)
    ) == spec_hash(spec)
    assert parse_job_spec(canonical_json(spec), registry) == spec
    assert len(spec_hash(spec)) == 64


def test_spec_validation_rejects_empty_legacy_and_invalid_requests(registry: OperationRegistry) -> None:
    with pytest.raises(ValueError, match="at least 1"):
        parse_job_spec('{"spec_version":1,"name":"a","kind":"collection","stages":[]}', registry)
    with pytest.raises(ValueError, match="no request model"):
        parse_job_spec(_spec("extraction.csv", {}), registry)
    with pytest.raises(ValueError, match="Unknown operation"):
        parse_job_spec(_spec("typo", {}), registry)
    with pytest.raises(ValueError, match="out_dir"):
        parse_job_spec(_spec("site.watch", {}), registry)
    with pytest.raises(ValueError, match="typo"):
        parse_job_spec(_spec("site.watch", {"out_dir": "./output", "typo": "x"}), registry)
    browser = parse_job_spec(_spec("browser.open", {"url": "http://127.0.0.1/", "out_dir": "./output"}), registry)
    with pytest.raises(ValueError, match="outside phase-one"):
        validate_execution_scope(browser)


def test_context_names_every_missing_requirement_and_ignores_unneeded_settings(registry: OperationRegistry) -> None:
    spec = parse_job_spec(_spec("scraping.crawl", {"out_dir": "./output"}), registry)
    config = EngineConfig.from_env({})
    with pytest.raises(ConfigError) as error:
        build_worker_context(spec, registry, config, require_ledger=True)
    for name in ("MZIZI_USER_AGENT", "MZIZI_MONGO_URL", "MZIZI_MONGO_DATABASE", "ENGINE_RUN_LOG_RETENTION_DAYS"):
        assert name in str(error.value)
    lookup = EngineConfig.from_env(
        {
            "MZIZI_USER_AGENT": "fixture",
            "DATABASE_WRITE_URL": "postgresql://unused",
            "MZIZI_DEV_ROOT": "/fixture/dev",
            "MZIZI_MARKDOWN_WORKERS": "3",
            "MZIZI_MIN_FREE_GB": "2.5",
            "MZIZI_DEBUG_STACKS": "15",
            "MZIZI_WEB_VOCABULARY": "fixtures/vocabulary.yml",
        }
    )
    context = build_worker_context(spec, registry, lookup)
    assert context.requires == {Requirement.USER_AGENT}
    assert context.postgres is None and context.mongo is None and context.s3 is None
    assert context.crawler is not None and context.crawler.dev_root == Path("/fixture/dev")
    assert context.crawler.markdown_workers == 3 and context.crawler.min_free_bytes == int(2.5 * 1024**3)
    assert context.crawler.debug_stack_seconds == 15
    assert context.crawler.vocabulary_path == Path("fixtures/vocabulary.yml")
