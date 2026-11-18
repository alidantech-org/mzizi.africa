"""Check the same artifact reference semantics over local and object-backed run stores."""

from datetime import UTC, datetime
from hashlib import sha256
from io import BytesIO
from pathlib import Path
from uuid import uuid4

import pytest
from fastapi.testclient import TestClient

from mzizi_engine import __version__
from mzizi_engine.config import ServerConfig
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.http.app import create_app
from mzizi_engine.runtime.runs.artifacts import ArtifactAccess, ArtifactReader, ArtifactReadError, ArtifactRef
from mzizi_engine.runtime.runs.bundles import assemble_manifest
from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, RunRecord, RunState
from mzizi_engine.runtime.runs.encode import spec_hash
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_engine.runtime.runs.s3_store import S3RunStore
from mzizi_engine.runtime.runs.store import RunStore
from mzizi_filesystem import MemoryObjectStore

TOKEN = {"Authorization": "Bearer test-engine-key"}
CAPTURE = b"<main><h1>Evidence</h1></main>"


@pytest.mark.parametrize("backend", ["local", "s3"])
def test_verified_artifact_replay(tmp_path: Path, backend: str) -> None:
    objects = MemoryObjectStore("test", "memory://", ())
    store: RunStore = LocalRunStore(tmp_path) if backend == "local" else S3RunStore(objects, tmp_path)
    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"collection","name":"fixture","stages":[{"operation":"scraping.crawl",'
        '"params":{"url":"https://example.org/","out_dir":"unused"}}]}',
        registry,
    )
    now = datetime.now(UTC)
    run = RunRecord(
        run_id=uuid4(),
        spec=spec,
        spec_hash=spec_hash(spec),
        requested_by="owner",
        requested_at=now,
        started_at=now,
        finished_at=now,
        state=RunState.COMPLETED,
    )
    raw = store.put(
        run.run_id, "artifacts/raw.html", BytesIO(CAPTURE), ArtifactProvenance(media_type="text/html", stage="fixture")
    )
    derived = store.put(
        run.run_id,
        "artifacts/derived.html",
        BytesIO(CAPTURE),
        ArtifactProvenance(media_type="text/html", stage="fixture", derived_from=(raw.path,)),
    )
    run = run.model_copy(
        update={"manifest_hash": store.write_manifest(assemble_manifest(store, run, __version__, (raw, derived)))}
    )
    reader = ArtifactReader(lambda supplied: run if supplied == run.run_id else None, lambda _: store)
    ref = ArtifactRef(run_id=run.run_id, path=derived.path, sha256=derived.sha256)
    with pytest.raises(ArtifactReadError, match="access refused"):
        reader.read(ref, ArtifactAccess(account_id="another-account"))
    assert reader.read(ref, ArtifactAccess(account_id="owner"))[1] == CAPTURE
    app = create_app(
        ServerConfig(auth="service", service_token="test-engine-key"), registry=registry, research_reader=reader
    )
    with TestClient(app) as client:
        payload = ref.model_dump(mode="json", by_alias=True)
        url = "/v1/research/inspect"
        assert client.post(url, json=payload).status_code == 401
        res = client.post(url, headers=TOKEN, json=payload)
        assert res.status_code == 200, res.text
        assert res.json()["derivedFrom"] == [raw.path]
        assert client.post(url, headers=TOKEN, json={**payload, "sha256": "0" * 64}).status_code == 409
        assert client.post(url, headers=TOKEN, json={**payload, "path": "artifacts/missing.html"}).status_code == 404
        assert client.post(url, headers=TOKEN, json={**payload, "path": "artifacts/../missing.html"}).status_code == 422
        replay = client.post(
            "/v1/research/replay",
            headers=TOKEN,
            json={"artifact": payload, "checks": {"kind": "html", "selectors": [{"selector": "h1", "count": 1}]}},
        )
        assert replay.status_code == 200, replay.text
        assert replay.json()["report"]["passed"] is True
        assert replay.json()["evidence"]["artifact"]["sha256"] == sha256(CAPTURE).hexdigest()

        if isinstance(store, S3RunStore):
            key = store.object_key(run.run_id, derived.path)
            objects.put(key, b"bad", "text/html", derived.sha256)
        else:
            (tmp_path / str(run.run_id) / derived.path).write_bytes(b"bad")
        assert client.post(url, headers=TOKEN, json=payload).status_code == 409
        if isinstance(store, S3RunStore):
            objects.delete(store.object_key(run.run_id, derived.path))
        else:
            (tmp_path / str(run.run_id) / derived.path).unlink()
        assert client.post(url, headers=TOKEN, json=payload).status_code == 404
        run = run.model_copy(update={"state": RunState.EXPIRED})
        assert client.post(url, headers=TOKEN, json=payload).status_code == 410


def test_draft_preserves_source_cells_and_flags_unsupported_fields(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    from mzizi_engine.runtime.assembly import table_draft
    from mzizi_extraction import DocumentProfile
    from mzizi_extraction.core import Status
    from mzizi_extraction.document.models import DocumentOutput, Page, TableBlock

    headings = ("Place name", "Location")
    first_table = TableBlock(
        page=3,
        index=1,
        rows=(headings, ("One", "Old mill"), ("Two", "Bus stop"), ("Three", "Market")),
        header_rows=1,
        bbox=(2.0, 4.0, 5.0, 7.0),
    )

    def extract(data: bytes, profile: DocumentProfile) -> DocumentOutput:
        assert data == b"pdf-fixture" and profile.first_page == profile.last_page == 3
        return DocumentOutput(
            status=Status.SUCCEEDED,
            pages=(Page(number=3, width=100, height=100, blocks=(first_table,)),),
        )

    monkeypatch.setattr(table_draft, "extract_pdf_document", extract)
    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"collection","name":"fixture","stages":[{"operation":"scraping.crawl",'
        '"params":{"url":"https://example.org/","out_dir":"unused"}}]}',
        registry,
    )
    run = RunRecord(
        run_id=uuid4(), spec=spec, spec_hash=spec_hash(spec), requested_at=datetime.now(UTC), state=RunState.COMPLETED
    )
    store = LocalRunStore(tmp_path)
    pdf = store.put(
        run.run_id,
        "artifacts/source.pdf",
        BytesIO(b"pdf-fixture"),
        ArtifactProvenance(media_type="application/pdf", stage="fixture"),
    )
    reference = store.put(
        run.run_id,
        "artifacts/reference.csv",
        BytesIO(b"name,feature_code\nOne,ke.one\nTwo,ke.two\nTwo,ke.other\n"),
        ArtifactProvenance(media_type="text/csv", stage="fixture"),
    )
    reader = ArtifactReader(lambda _: run, lambda _: store)
    source_ref = ArtifactRef(run_id=run.run_id, path=pdf.path, sha256=pdf.sha256)
    lookup_ref = ArtifactRef(run_id=run.run_id, path=reference.path, sha256=reference.sha256)
    app = create_app(
        ServerConfig(auth="service", service_token="test-engine-key"), registry=registry, research_reader=reader
    )
    with TestClient(app) as client:
        res = client.post(
            "/v1/research/table-draft",
            headers=TOKEN,
            json={
                "source": source_ref.model_dump(mode="json"),
                "first_page": 3,
                "last_page": 3,
                "headings": headings,
                "languages": "eng",
                "target_table": "governance.offices",
                "lookup": {
                    "reference": lookup_ref.model_dump(mode="json"),
                    "source_heading": "Place name",
                    "name_column": "name",
                    "code_column": "feature_code",
                    "target_column": "unit_feature_code",
                    "target_table": "geography.features",
                },
            },
        )
    assert res.status_code == 200, res.text
    report = res.json()
    assert [row["resolved_code"] for row in report["rows"]] == ["ke.one", None, None]
    assert {issue["kind"] for issue in report["issues"]} == {"required", "target_gap", "ambiguous", "unresolved"}
    assert "3,1,2,One,Old mill,ke.one" in report["csv"]
    assert report["source"]["artifact"]["sha256"] == pdf.sha256
    assert report["reference"]["artifact"]["sha256"] == reference.sha256


def test_knbs_style_county_table_drafts_statistics_observations(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A county table as the statistics bureau publishes it (county name, population) becomes a reviewable draft of
    statistics.observations rows: county names resolve to feature codes through a reference artifact and the value
    column binds to `value`. Missing required fields (indicator, period, source) are flagged, never invented."""
    from mzizi_engine.runtime.assembly import table_draft
    from mzizi_extraction import DocumentProfile
    from mzizi_extraction.core import Status
    from mzizi_extraction.document.models import DocumentOutput, Page, TableBlock

    headings = ("County", "Population")
    table = TableBlock(
        page=12,
        index=1,
        rows=(headings, ("Mombasa", "1,208,333"), ("Kwale", "866,820"), ("Narnia", "1")),
        header_rows=1,
        bbox=(2.0, 4.0, 5.0, 7.0),
    )

    def extract(data: bytes, profile: DocumentProfile) -> DocumentOutput:
        return DocumentOutput(status=Status.SUCCEEDED, pages=(Page(number=12, width=100, height=100, blocks=(table,)),))

    monkeypatch.setattr(table_draft, "extract_pdf_document", extract)
    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"collection","name":"fixture","stages":[{"operation":"scraping.crawl",'
        '"params":{"url":"https://example.org/","out_dir":"unused"}}]}',
        registry,
    )
    run = RunRecord(
        run_id=uuid4(), spec=spec, spec_hash=spec_hash(spec), requested_at=datetime.now(UTC), state=RunState.COMPLETED
    )
    store = LocalRunStore(tmp_path)
    pdf = store.put(
        run.run_id, "artifacts/census.pdf", BytesIO(b"pdf"), ArtifactProvenance(media_type="application/pdf", stage="f")
    )
    reference = store.put(
        run.run_id,
        "artifacts/counties.csv",
        BytesIO(b"name,feature_code\nMombasa,ke.mombasa\nKwale,ke.kwale\n"),
        ArtifactProvenance(media_type="text/csv", stage="f"),
    )
    reader = ArtifactReader(lambda _: run, lambda _: store)
    app = create_app(
        ServerConfig(auth="service", service_token="test-engine-key"), registry=registry, research_reader=reader
    )
    with TestClient(app) as client:
        res = client.post(
            "/v1/research/table-draft",
            headers=TOKEN,
            json={
                "source": ArtifactRef(run_id=run.run_id, path=pdf.path, sha256=pdf.sha256).model_dump(mode="json"),
                "first_page": 12,
                "last_page": 12,
                "headings": headings,
                "languages": "eng",
                "target_table": "statistics.observations",
                "bindings": [{"source_heading": "Population", "target_column": "value"}],
                "lookup": {
                    "reference": ArtifactRef(
                        run_id=run.run_id, path=reference.path, sha256=reference.sha256
                    ).model_dump(mode="json"),
                    "source_heading": "County",
                    "name_column": "name",
                    "code_column": "feature_code",
                    "target_column": "feature_code",
                    "target_table": "geography.features",
                },
            },
        )
    assert res.status_code == 200, res.text
    report = res.json()
    assert [row["resolved_code"] for row in report["rows"]] == ["ke.mombasa", "ke.kwale", None]
    assert "unresolved" in {issue["kind"] for issue in report["issues"]}
