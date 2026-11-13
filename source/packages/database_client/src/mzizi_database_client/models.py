"""Typed request/response models for the database service's named HTTP operations.

Wire fields are camelCase (the convention the service and every other caller already use);
Python code reads and writes snake_case attributes. Hand-written today because the official
Dryv client-generation pack for Python fails to load against the running engine (see
DEC-DATABASE-ACCESS-LIFECYCLE); shaped so swapping in generated code later changes nothing a
caller sees.
"""

from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import AliasGenerator, BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class Frozen(BaseModel):
    """Every model in this client: immutable, strict, camelCase on the wire."""

    model_config = ConfigDict(
        # Not strict: every instance of this model is built either by a caller passing plain
        # values or by parsing JSON off the wire (this package's whole job, not a lapse from
        # the typed-contract rule). Coercion (string -> UUID, ISO text -> datetime) belongs here.
        frozen=True,
        extra="forbid",
        populate_by_name=True,
        alias_generator=AliasGenerator(validation_alias=to_camel, serialization_alias=to_camel),
    )


class Folder(Frozen):
    id: UUID
    parent_id: UUID | None
    name: str
    code: str
    access: str
    role_id: UUID
    version: int
    created_at: datetime


class CreateFolderRequest(Frozen):
    account_id: UUID
    parent_id: UUID | None = None
    name: str
    code: str
    access: str
    role_id: UUID


class CreateFolderResponse(Frozen):
    folder: Folder
