"""The HTTP draft path reads native PDF geometry without replacing the extractor in a test."""

from datetime import UTC, datetime
from io import BytesIO
from pathlib import Path
from uuid import uuid4

from fastapi.testclient import TestClient

from mzizi_engine.config import ServerConfig
from mzizi_engine.runtime.assembly.default_operations import build_operation_registry
from mzizi_engine.runtime.contracts.table_draft import DraftBinding, DraftLookup, TableDraftRequest
from mzizi_engine.runtime.http.app import create_app
from mzizi_engine.runtime.runs.artifacts import ArtifactReader, ArtifactRef
from mzizi_engine.runtime.runs.contracts.records import ArtifactProvenance, RunRecord, RunState
from mzizi_engine.runtime.runs.encode import spec_hash
from mzizi_engine.runtime.runs.local_store import LocalRunStore
from mzizi_engine.runtime.runs.parse import parse_job_spec
from mzizi_extraction.document.positioned_models import PositionedColumn, PositionedTable


def _pdf() -> bytes:
    stream = b"BT /F1 12 Tf 72 700 Td (North....) Tj 180 0 Td (1 234) Tj ET"
    objects = (
        b"<< /Type /Catalog /Pages 2 0 R >>",
        b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R "
        b"/Resources << /Font << /F1 5 0 R >> >> >>",
        b"<< /Length " + str(len(stream)).encode() + b" >>\nstream\n" + stream + b"\nendstream",
        b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    )
    result = b"%PDF-1.4\n"
    offsets = [0]
    for index, body in enumerate(objects, start=1):
        offsets.append(len(result))
        result += str(index).encode() + b" 0 obj\n" + body + b"\nendobj\n"
    start = len(result)
    result += b"xref\n0 6\n0000000000 65535 f \n"
    result += b"".join(f"{offset:010d} 00000 n \n".encode() for offset in offsets[1:])
    return result + f"trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n{start}\n%%EOF".encode()


def test_positioned_draft_http_validates_geometry_and_preserves_artifact_identity(tmp_path: Path) -> None:
    registry = build_operation_registry()
    spec = parse_job_spec(
        '{"spec_version":1,"kind":"collection","name":"fixture","stages":[{"operation":"fetch.url",'
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
        BytesIO(_pdf()),
        ArtifactProvenance(media_type="application/pdf", stage="fixture"),
    )
    reference = store.put(
        run.run_id,
        "artifacts/reference.csv",
        BytesIO(b"name,code\nNorth,ke.north\n"),
        ArtifactProvenance(media_type="text/csv", stage="fixture"),
    )
    source = ArtifactRef(run_id=run.run_id, path=pdf.path, sha256=pdf.sha256)
    lookup = ArtifactRef(run_id=run.run_id, path=reference.path, sha256=reference.sha256)
    app = create_app(
        ServerConfig(auth="service", service_token="key"),
        registry=registry,
        research_reader=ArtifactReader(lambda _: run, lambda _: store),
    )
    selection = PositionedTable(
        page=1,
        bbox=(60.0, 80.0, 350.0, 130.0),
        columns=(
            PositionedColumn(name="Area", left=60.0, right=240.0, trim_characters=". "),
            PositionedColumn(name="People", left=240.0, right=350.0, remove_characters=" "),
        ),
    )
    request = TableDraftRequest(
        source=source,
        first_page=1,
        last_page=1,
        headings=("Area", "People"),
        target_table="statistics.observations",
        languages="eng",
        positioned_tables=(selection,),
        lookup=DraftLookup(
            reference=lookup,
            source_heading="Area",
            name_column="name",
            code_column="code",
            target_column="feature_code",
            target_table="geography.features",
        ),
        bindings=(DraftBinding(source_heading="People", target_column="value"),),
    )
    with TestClient(app) as client:
        response = client.post(
            "/v1/research/table-draft", json=request.model_dump(mode="json"), headers={"Authorization": "Bearer key"}
        )
        assert response.status_code == 200, response.text
        report = response.json()
        assert report["rows"][0]["source_cells"] == ["North", "1234"]
        assert report["rows"][0]["resolved_code"] == "ke.north"
        assert report["source"]["artifact"]["sha256"] == pdf.sha256
        outside = request.model_copy(
            update={"positioned_tables": (selection.model_copy(update={"bbox": (60.0, 80.0, 350.0, 900.0)}),)}
        )
        response = client.post(
            "/v1/research/table-draft", json=outside.model_dump(mode="json"), headers={"Authorization": "Bearer key"}
        )
        assert response.status_code == 422
