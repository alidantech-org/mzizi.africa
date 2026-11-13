"""Manifest-sync route: submits a bounded engine job rather than running inline."""

from __future__ import annotations

from pathlib import Path

from fastapi import Depends, HTTPException, Request

from mzizi_manifest.paths import SEED_ROOT

from ..auth import Principal, authenticated
from ._shared import SyncIn, router


@router.post("/sync", status_code=202)
async def start_sync(body: SyncIn, request: Request, principal: Principal = Depends(authenticated)) -> dict:
    """Plan (default) or apply a manifest sync as an engine job; the actor is the authenticated principal, never taken from the body."""
    manifest = (SEED_ROOT / body.manifest) if not Path(body.manifest).is_absolute() else Path(body.manifest)
    if SEED_ROOT.resolve() not in manifest.resolve().parents:
        raise HTTPException(422, "manifest must be inside the seed root")
    job, created = await request.app.state.executor.submit(
        "filesystem.sync",
        {
            "manifest": str(manifest),
            "entries": body.entries,
            "apply": body.apply,
            "actor": principal.account_id,
            "database_url": request.app.state.settings.database_url,
        },
        None,
        principal.account_id,
    )
    return {**job, "created": created}
