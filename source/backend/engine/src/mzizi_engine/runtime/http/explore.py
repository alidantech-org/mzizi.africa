"""Read-only exploration endpoints for the developer portal: runs and their outputs, files, the database and data lists."""

from __future__ import annotations

import asyncio
import base64
import mimetypes
from collections.abc import Callable
from functools import partial
from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, HTTPException, Query, Request
from fastapi.responses import FileResponse
from pydantic import BaseModel

from mzizi_engine.config.explore import ExploreConfig
from mzizi_engine.persistence.postgres.browse import (
    BrowseError,
    Browser,
    DataList,
    DataListPage,
    DomainInfo,
    TablePage,
)
from mzizi_engine.runtime.explore.files import FileRoots, FilesError, FileView, Listing
from mzizi_engine.runtime.explore.prepare import PrepareRequest, PrepareResult, prepare, save_text
from mzizi_engine.runtime.explore.terms import TaggedText, TermGroupInfo, groups, tag
from mzizi_engine.runtime.http.auth import require

Limit = Annotated[int, Query(ge=1, le=500)]
Offset = Annotated[int, Query(ge=0)]


MAX_RAW_BYTES = 16 * 1024 * 1024


class RawFile(BaseModel):
    """The bytes of one file as base64 with its content type, for a preview or a download."""

    name: str
    content_type: str
    size: int
    base64: str


class JobDetail(BaseModel):
    job: dict
    events: list[dict]
    output: Listing | None


class SaveFile(BaseModel):
    path: str
    text: str
    overwrite: bool = False


class TagRequest(BaseModel):
    texts: list[str]
    domain: str = ""


class RootInfo(BaseModel):
    name: str
    path: str


class RootList(BaseModel):
    roots: list[RootInfo]


class TermGroupList(BaseModel):
    groups: tuple[TermGroupInfo, ...]


class TaggedList(BaseModel):
    items: tuple[TaggedText, ...]


class DomainList(BaseModel):
    domains: tuple[DomainInfo, ...]


class DataListList(BaseModel):
    lists: tuple[DataList, ...]


async def _browse[R](action: Callable[[], R]) -> R:
    try:
        return await asyncio.to_thread(action)
    except BrowseError as error:
        raise HTTPException(error.status, str(error)) from error


async def _files[R](action: Callable[[], R]) -> R:
    try:
        return await asyncio.to_thread(action)
    except FilesError as error:
        raise HTTPException(error.status, str(error)) from error


def explore_router(config: ExploreConfig) -> APIRouter:
    router = APIRouter(prefix="/v1/explore", tags=["Explore"], dependencies=[require("engine.read")])
    browser, roots = Browser(config.read_url), FileRoots(config.roots)

    @router.get("/roots")
    async def file_roots() -> RootList:
        return RootList(roots=[RootInfo(name=name, path=str(path)) for name, path in config.roots.items()])

    @router.get("/files")
    async def list_files(root: str, path: str = "") -> Listing:
        return await _files(lambda: roots.list(root, path))

    @router.get("/file")
    async def view_file(root: str, path: str, offset: Offset = 0, limit: Limit = 100) -> FileView:
        return await _files(lambda: roots.view(root, path, offset, limit))

    @router.get("/file/data")
    async def raw_file_data(root: str, path: str) -> RawFile:
        target: Path = await _files(lambda: roots.raw(root, path))
        size = target.stat().st_size
        if size > MAX_RAW_BYTES:
            raise HTTPException(413, f"the file is {size} bytes; previews are limited to {MAX_RAW_BYTES}")
        data = await asyncio.to_thread(target.read_bytes)
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        return RawFile(name=target.name, content_type=content_type, size=size, base64=base64.b64encode(data).decode("ascii"))

    @router.get("/file/raw")
    async def raw_file(root: str, path: str) -> FileResponse:
        target: Path = await _files(lambda: roots.raw(root, path))
        return FileResponse(target, filename=target.name, content_disposition_type="inline")

    @router.post("/csv/prepare", dependencies=[require("engine.edit")])
    async def prepare_csv(body: PrepareRequest) -> PrepareResult:
        return await _files(lambda: prepare(roots, body))

    @router.put("/file", dependencies=[require("engine.edit")])
    async def save_file(body: SaveFile) -> dict[str, str]:
        return {"path": await _files(lambda: save_text(roots, body.path, body.text, body.overwrite))}

    @router.get("/terms")
    async def term_groups() -> TermGroupList:
        return TermGroupList(groups=await asyncio.to_thread(groups, config.roots["seed"]))

    @router.post("/terms/tag")
    async def tag_texts(body: TagRequest) -> TaggedList:
        return TaggedList(items=await asyncio.to_thread(tag, config.roots["seed"], body.texts[:500], body.domain))

    @router.get("/db/domains")
    async def domains() -> DomainList:
        return DomainList(domains=await _browse(browser.domains))

    @router.get("/db/tables/{domain}/{table}")
    async def table_rows(
        domain: str,
        table: str,
        limit: Limit = 50,
        offset: Offset = 0,
        order: str = "",
        direction: str = "asc",
        q: str = "",
    ) -> TablePage:
        return await _browse(lambda: browser.table(domain, table, limit, offset, order, direction, q))

    @router.get("/db/lists")
    async def data_lists() -> DataListList:
        return DataListList(lists=tuple(item.model_copy(update={"sql": ""}) for item in browser.lists()))

    @router.get("/db/lists/{domain}/{code}")
    async def data_list(domain: str, code: str, limit: Limit = 50, offset: Offset = 0) -> DataListPage:
        return await _browse(lambda: browser.datalist(domain, code, limit, offset))

    @router.get("/jobs/{job_id}")
    async def job_detail(job_id: str, request: Request) -> JobDetail:
        store = request.app.state.store
        job = await asyncio.to_thread(store.get_job, job_id)
        if job is None:
            raise HTTPException(404, "no such job")
        events = await asyncio.to_thread(store.events_after, 0, job_id, 500)
        output = None
        folder = job.get("input", {}).get("out_dir")
        if isinstance(folder, str):
            for name, base in config.roots.items():
                try:
                    relative = Path(folder).resolve().relative_to(base)
                except ValueError:
                    continue
                where = "" if str(relative) == "." else str(relative)
                output = await _files(partial(roots.list, name, where))
                break
        return JobDetail(job=job, events=events, output=output)

    return router


def media_router(config: ExploreConfig) -> APIRouter:
    """Public, read-only access to the registered media bytes of the development stack (`s3_key` is `media/<name>`).

    In production the same keys resolve in the object store; here the engine serves the folder the seed builder filled."""
    router = APIRouter(tags=["Media"])
    base = config.roots.get("media")

    @router.get("/media/{name}", include_in_schema=False)
    async def media_file(name: str) -> FileResponse:
        if base is None or "/" in name or name.startswith("."):
            raise HTTPException(404, "no such media")
        target = (base / name).resolve()
        if base not in target.parents or not target.is_file():
            raise HTTPException(404, "no such media")
        return FileResponse(target, headers={"Cache-Control": "public, max-age=86400"})

    return router
