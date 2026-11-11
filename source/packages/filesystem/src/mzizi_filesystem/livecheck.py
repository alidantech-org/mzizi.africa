"""Bounded live check against the configured Mzizi bucket, in an unmistakable test namespace.

Store level: everything lives under private/tmp/mzizi-live-check-<id>/. Service level: random bytes (so no existing object can
match) are registered twice in a private test folder of the rewrite database; the second registration must reuse the first key.
Cleanup removes only objects this check created and only while no retained version references them, then its own database rows.
"""
from __future__ import annotations

import os
import secrets
import uuid

from .access import is_anonymously_readable
from .hashing import hash_stream, sha256_hex
from .repository import Repository
from .service import FilesystemService
from .store import ObjectStore


def run_live_check(store: ObjectStore, repo: Repository | None = None, actor: str | None = None) -> dict:
    token = uuid.uuid4().hex[:12]
    ns = f"private/tmp/mzizi-live-check-{token}/"
    steps: list[dict] = []
    created_keys: list[str] = []

    def step(name: str, ok: bool, detail: str = "") -> bool:
        steps.append({"step": name, "ok": ok, "detail": detail})
        return ok

    payload = b"mzizi live check " + token.encode() + b"\n" + secrets.token_bytes(65536)
    sha = sha256_hex(payload)
    k1, k2 = ns + "a.bin", ns + "copy-of-a.bin"
    try:
        store.put(k1, payload, "application/octet-stream", sha)
        created_keys.append(k1)
        head = store.head(k1)
        step("put and head", head is not None and head.size == len(payload) and head.sha256 == sha, f"{head}")
        step("read back and hash", sha256_hex(store.get(k1)) == sha)
        with store.open_stream(k1) as stream:
            step("streamed hash", hash_stream(stream) == (sha, len(payload)))
        store.copy(k1, k2, "application/octet-stream", sha)
        created_keys.append(k2)
        step("server-side copy", (store.head(k2) is not None) and sha256_hex(store.get(k2)) == sha)
        try:
            url = store.presign_get(k1, 60)
            step("presigned URL uses a client-reachable host", "object-storage" not in url, url.split("?")[0])
        except Exception as error:  # noqa: BLE001 - reported, not fatal: S3_PUBLIC_ENDPOINT may be unset on this machine
            step("presigned URL", "S3_PUBLIC_ENDPOINT is not set" in str(error), "skipped: " + str(error) if "S3_PUBLIC_ENDPOINT is not set" in str(error) else str(error))
        step("test namespace is not anonymously readable", not is_anonymously_readable(k1))
        if repo is not None:
            service = FilesystemService(repo, store)
            with repo.transaction():
                folder = repo.create_folder(None, f"_live-check-{token}", {"access": "private", "artifact_role": "report", "acquisition_class": "internally_derived", "preparation": "programmatically_generated", "is_seed": False, "description": "live check (removed after the check)"}, actor)
            a = service.register(folder["id"], "one.bin", payload, actor=actor)
            b = service.register(folder["id"], "two.bin", payload, actor=actor)
            for r in (a, b):
                if r.key:
                    created_keys.append(r.key)
            step("registered twice", a.outcome == "created" and b.outcome == "created", f"{a.outcome}/{b.outcome}")
            step("each file has its own readable key and the second was a server-side copy", bool(a.key) and bool(b.key) and a.key != b.key and a.key.endswith("/one.bin") and b.server_copied, f"{a.key} {b.key}")
            step("registered key is private and verified", bool(a.key) and a.key.startswith("private/") and a.verified)
            for name in ("one.bin", "two.bin"):
                f = repo.find_file(folder["id"], name)
                if f:
                    with repo.transaction():
                        repo.delete_file(f["id"], f["revision"])
            with repo.transaction():
                repo.conn.execute("DELETE FROM filesystem.folders WHERE id = %s", (folder["id"],))
    finally:
        removed, kept = [], []
        for key in dict.fromkeys(created_keys):
            if repo is not None and repo.key_in_use(key):
                kept.append(key)
                continue
            try:
                store.delete(key)
                removed.append(key)
            except Exception as error:  # noqa: BLE001
                kept.append(f"{key} ({error})")
        gone = all(store.head(k) is None for k in removed)
        step("cleanup removed only objects created by this check", gone and not kept, f"removed {len(removed)}, kept {len(kept)}")
    return {"namespace": ns, "ok": all(s["ok"] for s in steps), "steps": steps}
