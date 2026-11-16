"""Seed rows are checked against the real dataset a folder names."""

import hashlib
import json
from pathlib import Path

from mzizi_manifest.features.provenance.verify import verify

DATA = {
    "features": [
        {"properties": {"shapeID": "A1", "shapeName": "Alpha", "shapeISO": "KE-01"}},
        {"properties": {"shapeID": "B2", "shapeName": "Beta", "shapeISO": "KE-02"}},
    ]
}


def folder(tmp_path: Path, identifiers: str, names: str, complete: bool = True) -> Path:
    copy = tmp_path / "set.geojson"
    copy.write_text(json.dumps(DATA), encoding="utf-8")
    base = tmp_path / "seed" / "data" / "ke" / "geo" / "counties"
    base.mkdir(parents=True)
    (base / "identifiers.csv").write_text(
        "feature_code,identifier_scheme_code,external_id\n" + identifiers, encoding="utf-8"
    )
    (base / "names.csv").write_text("feature_code,name,name_kind_code\n" + names, encoding="utf-8")
    sha = hashlib.sha256(copy.read_bytes()).hexdigest()
    (base / "_source.yaml").write_text(
        "status: verified\ndataset: {name: t, local_copy: set.geojson, sha256: " + sha + ", boundary_id: T-1}\n"
        f"checks:\n  complete: {str(complete).lower()}\n  identifiers:\n    - {{scheme: s.id, property: shapeID}}\n"
        "    - {scheme: s.iso, property: shapeISO}\n  names:\n    - {kind: n.short, property: shapeName}\n",
        encoding="utf-8",
    )
    return tmp_path / "seed"


GOOD_IDS = "ke.a,s.id,A1\nke.a,s.iso,KE-01\nke.b,s.id,B2\nke.b,s.iso,KE-02\n"
GOOD_NAMES = "ke.a,Alpha,n.short\nke.b,Beta,n.short\n"


def test_rows_that_match_the_dataset_verify(tmp_path: Path) -> None:
    result = verify(folder(tmp_path, GOOD_IDS, GOOD_NAMES), tmp_path)
    assert result.problems == [] and len(result.checked) == 1


def test_an_invented_id_a_wrong_name_and_a_missing_feature_are_reported(tmp_path: Path) -> None:
    result = verify(folder(tmp_path, "ke.a,s.id,A1\nke.a,s.iso,KE-09\nke.x,s.id,ZZ\n", "ke.a,Alfa,n.short\n"), tmp_path)
    text = "\n".join(result.problems)
    assert "ZZ" in text and "KE-09" in text and "Alfa" in text and "'B2'" in text


def test_a_changed_dataset_copy_is_reported(tmp_path: Path) -> None:
    seed = folder(tmp_path, GOOD_IDS, GOOD_NAMES)
    (tmp_path / "set.geojson").write_text('{"features": []}', encoding="utf-8")
    assert any("sha256" in p for p in verify(seed, tmp_path).problems)


def test_a_missing_dataset_copy_is_reported_as_unavailable_not_failed(tmp_path: Path) -> None:
    seed = folder(tmp_path, GOOD_IDS, GOOD_NAMES)
    (tmp_path / "set.geojson").unlink()
    result = verify(seed, tmp_path)
    assert result.problems == [] and len(result.unavailable) == 1
