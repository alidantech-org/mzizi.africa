"""Pure-package tests: keys, codes, media catalog, hashing and the in-memory store. No database or network."""

from __future__ import annotations

import hashlib
import io
import json
from pathlib import Path

import pytest

from mzizi_filesystem import Access, ContentTypeError, MediaCatalog, MemoryObjectStore, StoreError
from mzizi_filesystem.features.keys.keys import (
    AccessError,
    InvalidNameError,
    archive_key,
    check_key_matches_access,
    check_name,
    current_key,
    is_anonymously_readable,
    is_protected,
    sibling_name,
)
from mzizi_filesystem.features.media.parse import load_media_formats
from mzizi_filesystem.shared.codes import child_code, code_segment, is_code
from mzizi_filesystem.shared.hashing import hash_file, hash_stream

CATALOG = MediaCatalog({"pdf": "application/pdf"})


def test_public_prefix_is_the_only_anonymously_readable_one() -> None:
    assert is_anonymously_readable("public/a/b.pdf")
    assert not is_anonymously_readable("internal/a/b.pdf")


def test_a_key_must_sit_under_its_own_access_prefix() -> None:
    check_key_matches_access("internal/a/b.pdf", Access.INTERNAL)
    with pytest.raises(AccessError, match="sits under"):
        check_key_matches_access("internal/a/b.pdf", Access.PUBLIC)
    with pytest.raises(AccessError, match="invalid object key"):
        check_key_matches_access("internal/../b.pdf", Access.INTERNAL)


def test_keys_follow_the_registry_path_and_protection_comes_from_configuration() -> None:
    assert current_key(Access.INTERNAL, "/a/b", "f.pdf") == "internal/a/b/f.pdf"
    assert archive_key(Access.INTERNAL, "/a/b", "f.pdf", 2) == "internal/a/b/_versions/f.pdf/r0002/f.pdf"
    assert (
        is_protected("vault/x", ("vault/",))
        and not is_protected("vault/x", ())
        and not is_protected("a/x", ("vault/",))
    )


def test_names_are_checked_and_sibling_names_disambiguate_by_hash() -> None:
    check_name("report.pdf")
    for bad in ("", "a/b", "_versions", " x"):
        with pytest.raises(InvalidNameError):
            check_name(bad)
    assert sibling_name("report.pdf", "a" * 64) == "report~aaaaaaaa.pdf"
    assert sibling_name("archive.tar.gz", "b" * 64) == "archive~bbbbbbbb.tar.gz"


def test_code_segments_are_reproducible_and_shape_is_checked() -> None:
    assert code_segment("World GeoBoundaries (v2).json") == "world_geoboundaries_v2_json"
    assert child_code("seeds.global", "auth") == "seeds.global.auth"
    assert child_code(None, "x") is None
    assert is_code("seeds.global.auth.roles_csv") and not is_code("Seeds") and not is_code("a-b")


def test_hashing_matches_hashlib_for_both_bytes_and_streams(tmp_path: Path) -> None:
    data = b"mzizi filesystem test content"
    expected = hashlib.sha256(data).hexdigest()
    assert hash_stream(io.BytesIO(data)) == (expected, len(data))
    path = tmp_path / "f.bin"
    path.write_bytes(data)
    assert hash_file(path) == (expected, len(data))


def test_the_catalog_resolves_extension_and_checks_declared_type_and_signature() -> None:
    assert CATALOG.resolve("report.pdf", b"%PDF-1.7 rest", declared="application/pdf") == ("pdf", "application/pdf")
    with pytest.raises(ContentTypeError, match="do not look like"):
        CATALOG.resolve("report.pdf", b"not actually a pdf")
    with pytest.raises(ContentTypeError, match="contradicts"):
        CATALOG.resolve("data.json", b"{}", declared="text/plain")
    assert MediaCatalog({}).resolve("notes.zzz", b"", None) == ("zzz", "application/octet-stream")


def test_a_media_reference_file_is_parsed_into_extension_types(tmp_path: Path) -> None:
    file = tmp_path / "media.json"
    file.write_text(
        json.dumps({"rows": [{"values": {"extension": ".ODT", "mimeType": "application/x-odt", "other": 1}}]})
    )
    assert load_media_formats(file) == {"odt": "application/x-odt"}


def test_the_memory_store_refuses_protected_keys_and_stores_nothing_it_cannot_verify() -> None:
    store = MemoryObjectStore(bucket="b", public_endpoint="https://x.test", protected_prefixes=("vault/",))
    store.put("open/a", b"1", "text/plain", hashlib.sha256(b"1").hexdigest())
    with pytest.raises(StoreError):
        store.put("vault/a", b"1", "text/plain", hashlib.sha256(b"1").hexdigest())
    with pytest.raises(StoreError):
        store.delete("vault/a")
