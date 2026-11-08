"""Engine filesystem endpoints against mzizi_new with an in-memory object store: folders, uploads, downloads, transitions, lineage, scoped authorization."""
from __future__ import annotations

import base64
import uuid

import pytest
from engine_helpers import settings, wait_for
from fastapi.testclient import TestClient

from mzizi_database import connect, rewrite_url
from mzizi_engine.app import create_app
from mzizi_engine.capabilities import build_default_registry
from mzizi_engine.store import MemoryStore
from mzizi_filesystem import MemoryObjectStore
from mzizi_filesystem.hashing import sha256_hex

ISSUER = "https://pytest.mzizi.local"
b64 = lambda data: base64.b64encode(data).decode()  # noqa: E731


def _purge(folder_ids):
    from mzizi_filesystem.testing import purge_tree

    with connect(rewrite_url(), autocommit=True) as conn:
        for fid in folder_ids:
            purge_tree(conn, fid)


@pytest.fixture(scope="module", autouse=True)
def database():
    from mzizi_database.cli import init

    init()


@pytest.fixture
def api():
    store = MemoryObjectStore()
    app = create_app(settings(database_url=rewrite_url()), store=MemoryStore(), registry=build_default_registry())
    app.state.filesystem_store = lambda: store
    created: list[str] = []
    with TestClient(app) as client:
        client.store, client.created = store, created
        yield client
    _purge(created)


def make_root(api, name=None, **fields):
    body = {"name": name or f"pytest-api-{uuid.uuid4().hex[:8]}", "access": "internal", "artifact_role": "seed_input", "acquisition_class": "static_curated", "preparation": "human_prepared", "allow_weaker_children": True, **fields}
    r = api.post("/v1/filesystem/folders", json=body)
    assert r.status_code == 201, r.text
    api.created.append(r.json()["folder"]["id"])
    return r.json()["folder"]["id"]


def test_folders_uploads_downloads_and_transitions_through_the_engine(api):
    root = make_root(api)
    child = api.post("/v1/filesystem/folders", json={"parent_id": root, "name": "docs"}).json()["folder"]["id"]
    view = api.get(f"/v1/filesystem/folders/{child}").json()
    assert view["path"].endswith("/docs") and view["effective"]["access"] == "internal" and view["effective"]["artifact_role"] == "seed_input"
    up = api.post("/v1/filesystem/uploads", json={"folder_id": child, "filename": "note.txt", "size": 6, "sha256": sha256_hex(b"hello\n")})
    assert up.status_code == 201 and "upload=1" in up.json()["put_url"]
    # the client uploads to the presigned URL; here the test writes the temp object the session reserved
    from mzizi_database import connect as c2

    with c2(rewrite_url(), autocommit=True) as conn:
        key = conn.execute("SELECT temp_key FROM filesystem.uploads WHERE id = %s", (up.json()["upload_id"],)).fetchone()["temp_key"]
    api.store.put(key, b"hello\n", "text/plain", "x")
    done = api.post(f"/v1/filesystem/uploads/{up.json()['upload_id']}/complete", json={}).json()
    assert done["outcome"] == "created" and done["verified"] is True and "reused" not in str(done)
    file = api.get(f"/v1/filesystem/files/{done['file_id']}").json()
    assert file["path"].endswith("/docs/note.txt") and file["versions"][0]["sha256"] == sha256_hex(b"hello\n") and "s3_key" not in file["versions"][0]
    link = api.get(f"/v1/filesystem/versions/{done['version_id']}/download").json()
    assert link["kind"] == "presigned" and "private" not in link["url"] and "internal/" in link["url"]
    preview = api.post(f"/v1/filesystem/folders/{child}/access", json={"access": "private"}).json()
    assert preview == {"dry_run": True, "versions_relocated": 1, "superseded_keys_pending_cleanup": 1}
    applied = api.post(f"/v1/filesystem/folders/{child}/access", json={"access": "private", "apply": True}).json()
    assert applied["dry_run"] is False and applied["versions_relocated"] == 1
    assert api.get(f"/v1/filesystem/folders/{child}").json()["effective"]["access"] == "private"
    assert api.post(f"/v1/filesystem/folders/{child}/access", json={"access": "public", "apply": True}).status_code == 409
    cleanup = api.post("/v1/filesystem/uploads/cleanup").json()
    assert cleanup["dry_run"] is True


def test_derived_files_record_exact_version_relations_through_the_engine(api):
    root = make_root(api)
    from mzizi_filesystem import FilesystemService, Repository

    with connect(rewrite_url(), autocommit=True) as conn:
        svc = FilesystemService(Repository(conn), api.store)
        src = svc.register(root, "source.txt", b"source text\n")
    out = api.post("/v1/filesystem/derived", json={"sources": [str(src.version_id)], "folder_id": root, "name": "upper.txt", "content_base64": b64(b"SOURCE TEXT\n"), "relation": "converted_from"}).json()
    lin = api.get(f"/v1/filesystem/versions/{out['version_id']}/lineage").json()
    assert [(a["source"], a["relation"]) for a in lin["ancestry"]] == [(str(src.version_id), "converted_from")]
    assert api.get(f"/v1/filesystem/versions/{src.version_id}/lineage").json()["derived"] == [{"derived": out["version_id"], "relation": "converted_from"}]
    assert api.post("/v1/filesystem/relations", json={"source_version_id": out["version_id"], "derived_version_id": str(src.version_id)}).status_code >= 400  # cycle refused


def test_scoped_authorization_guards_every_filesystem_endpoint():
    store = MemoryObjectStore()
    with connect(rewrite_url(), autocommit=True) as conn:
        admin = conn.execute("SELECT account_id FROM auth.resolve_identity(%s, 'fs-admin')", (ISSUER,)).fetchone()["account_id"] or conn.execute("SELECT auth.bootstrap_admin(%s, 'fs-admin', 'Filesystem test admin', 'admin') AS id", (ISSUER,)).fetchone()["id"]
        top = conn.execute("INSERT INTO filesystem.folders (name, access, artifact_role, acquisition_class, preparation, allow_weaker_children) VALUES (%s, 'internal', 'seed_input', 'static_curated', 'human_prepared', true) RETURNING id", (f"pytest-authz-{uuid.uuid4().hex[:8]}",)).fetchone()["id"]
        mine = conn.execute("INSERT INTO filesystem.folders (parent_id, name) VALUES (%s, 'mine') RETURNING id", (top,)).fetchone()["id"]
        theirs = conn.execute("INSERT INTO filesystem.folders (parent_id, name) VALUES (%s, 'theirs') RETURNING id", (top,)).fetchone()["id"]
        worker = conn.execute("INSERT INTO auth.accounts (display_name) VALUES (%s) RETURNING id", (f"worker-{uuid.uuid4().hex[:6]}",)).fetchone()["id"]
        conn.execute("INSERT INTO auth.identities (account_id, issuer, subject) VALUES (%s, %s, %s)", (worker, ISSUER, f"worker-{worker}"))
        conn.execute("SELECT auth.grant_role(%s, %s, 'filesystem_manager', 'filesystem.folders', %s)", (admin, worker, mine))
        subject = f"worker-{worker}"

    async def verifier(token):
        return ISSUER, token

    from mzizi_engine.auth import DatabaseAuthority

    app = create_app(settings(auth="oidc", issuer=ISSUER, database_url=rewrite_url()), store=MemoryStore(), registry=build_default_registry(), authority=DatabaseAuthority(rewrite_url()), verifier=verifier)
    app.state.filesystem_store = lambda: store
    try:
        with TestClient(app) as client:
            bearer = {"Authorization": f"Bearer {subject}"}
            assert client.post("/v1/filesystem/folders", json={"parent_id": str(mine), "name": "x"}).status_code == 401
            ok = client.post("/v1/filesystem/folders", json={"parent_id": str(mine), "name": "x"}, headers=bearer)
            assert ok.status_code == 201, ok.text
            assert client.post("/v1/filesystem/folders", json={"parent_id": str(theirs), "name": "x"}, headers=bearer).status_code == 403
            assert client.get(f"/v1/filesystem/folders/{theirs}", headers=bearer).status_code == 403
            assert client.get(f"/v1/filesystem/folders/{mine}", headers=bearer).status_code == 200
            assert client.post(f"/v1/filesystem/folders/{mine}/access", json={"access": "private"}, headers=bearer).status_code == 200  # preview within scope
            assert client.post(f"/v1/filesystem/folders/{theirs}/access", json={"access": "private"}, headers=bearer).status_code == 403
            assert client.post("/v1/filesystem/uploads", json={"folder_id": str(theirs), "filename": "n.txt"}, headers=bearer).status_code == 403
            assert client.post("/v1/filesystem/uploads/cleanup", headers=bearer).status_code == 403  # platform-wide delete permission needed
    finally:
        _purge([str(top)])
