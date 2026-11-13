"""Pure-package tests: access, keys, codes, catalog, hashing and the authorizer shape. No database or network.

Database-backed behaviour (repository, service, authz.DatabaseAuthorizer and everything built on them) moved to the
engine (`source/backend/engine/tests/filesystem`) with the code it tests; see `.docs/decisions` TSK-E55B1BC4011A.
"""

from __future__ import annotations

import hashlib
import io

import pytest

from mzizi_filesystem import OperatorAuthorizer
from mzizi_filesystem.access import check_key_matches_access, is_anonymously_readable
from mzizi_filesystem.catalog import ContentTypeError, resolve
from mzizi_filesystem.codes import child_code, code_segment, is_code
from mzizi_filesystem.hashing import hash_file, hash_stream
from mzizi_filesystem.keys import archive_key, check_name, current_key, is_protected, sibling_name


def test_public_prefix_is_the_only_anonymously_readable_one():
    assert is_anonymously_readable("public/a/b.pdf")
    assert not is_anonymously_readable("internal/a/b.pdf")


def test_a_key_must_sit_under_its_own_access_prefix():
    check_key_matches_access("internal/a/b.pdf", "internal")
    with pytest.raises(ValueError, match="sits under"):
        check_key_matches_access("internal/a/b.pdf", "public")
    with pytest.raises(ValueError, match="unknown access class"):
        check_key_matches_access("internal/a/b.pdf", "bogus")
    with pytest.raises(ValueError, match="invalid object key"):
        check_key_matches_access("internal/../b.pdf", "internal")


def test_current_and_archive_keys_and_the_protected_raw_archive():
    assert current_key("internal", "/a/b", "f.pdf") == "internal/a/b/f.pdf"
    assert archive_key("internal", "/a/b", "f.pdf", 2) == "internal/a/b/_versions/f.pdf/r0002/f.pdf"
    assert is_protected("public/raw/x") and not is_protected("public/other/x")


def test_names_are_checked_and_sibling_names_disambiguate_by_hash():
    check_name("report.pdf")
    with pytest.raises(ValueError):
        check_name("")
    with pytest.raises(ValueError):
        check_name("a/b")
    with pytest.raises(ValueError):
        check_name("_versions", root=True)
    assert sibling_name("report.pdf", "a" * 64) == "report~aaaaaaaa.pdf"
    assert sibling_name("archive.tar.gz", "b" * 64) == "archive~bbbbbbbb.tar.gz"


def test_code_segments_are_reproducible_and_shape_is_checked():
    assert code_segment("World GeoBoundaries (v2).json") == "world_geoboundaries_v2_json"
    assert child_code("seeds.global", "auth") == "seeds.global.auth"
    assert child_code(None, "x") is None
    assert is_code("seeds.global.auth.roles_csv") and not is_code("Seeds") and not is_code("a-b")


def test_hashing_matches_hashlib_for_both_bytes_and_streams():
    data = b"mzizi filesystem test content"
    expected = hashlib.sha256(data).hexdigest()
    digest, size = hash_stream(io.BytesIO(data))
    assert digest == expected and size == len(data)

    import tempfile
    from pathlib import Path

    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "f.bin"
        path.write_bytes(data)
        digest, size = hash_file(path)
        assert digest == expected and size == len(data)


def test_catalog_resolves_extension_and_checks_declared_type_and_signature():
    ext, content_type = resolve("report.pdf", b"%PDF-1.7 rest", declared="application/pdf")
    assert ext == "pdf" and content_type == "application/pdf"
    with pytest.raises(ContentTypeError, match="do not look like"):
        resolve("report.pdf", b"not actually a pdf")
    with pytest.raises(ContentTypeError, match="contradicts"):
        resolve("data.json", b"{}", declared="text/plain")


def test_the_operator_authorizer_allows_everything():
    authorizer = OperatorAuthorizer()
    authorizer.for_platform(None, "filesystem.edit")
    authorizer.for_new_child("actor", "filesystem.edit", "filesystem.files", None)
    authorizer.for_record(None, "filesystem.read", "filesystem.files", "id")
    authorizer.for_move(None, "filesystem.edit", "filesystem.files", "id", None)
