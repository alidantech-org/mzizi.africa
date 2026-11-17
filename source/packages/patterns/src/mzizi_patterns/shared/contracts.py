"""Typed contracts shared by every pattern feature."""

from __future__ import annotations

from enum import IntEnum, StrEnum

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Frozen(BaseModel):
    model_config = ConfigDict(frozen=True, extra="forbid")


class Field_(StrEnum):
    """Which part of a document a piece of text came from."""

    FILENAME = "filename"
    TITLE = "title"
    HEADINGS = "headings"  # table column headings and section headings
    BODY = "body"


class Impact(IntEnum):
    NOISE = 0
    LOW = 1
    MEDIUM = 2
    HIGH = 3


class Axis(StrEnum):
    KIND = "kind"  # what the document is: a register, a notice, a form
    SUBJECT = "subject"  # what it is about: funding, people, places


class Alias(Frozen):
    value: str = Field(min_length=1)
    language: str = ""


class TermEntry(Frozen):
    value: str = Field(min_length=1)
    language: str = ""
    aliases: tuple[Alias, ...] = ()
    meaning: str = ""

    @field_validator("aliases", mode="before")
    @classmethod
    def _alias_forms(cls, value: object) -> object:
        """An alias is a bare string or an object with its own language."""
        if isinstance(value, (list, tuple)):
            return [{"value": item} if isinstance(item, str) else item for item in value]
        return value


class Role(StrEnum):
    KIND = "kind"
    SUBJECT = "subject"
    STOPWORD = "stopword"


class TermGroup(Frozen):
    group: str
    label: str = ""
    describe: str = ""
    role: Role | None = None
    terms: tuple[TermEntry, ...] = Field(min_length=1)


class TermList(Frozen):
    """One term list (the shape of `source/schema/engine/terms.schema.json`): groups of labelled terms."""

    code: str
    describe: str = ""
    extends: tuple[str, ...] = ()
    languages: tuple[str, ...] = ()
    terms: tuple[TermEntry, ...] = ()
    groups: tuple[TermGroup, ...] = ()


class TagRule(Frozen):
    tag: str
    impact: Impact
    weight: float = Field(default=1.0, gt=0)
    group: str  # the term group that evidences this tag; its role decides whether the tag is a kind or a subject


class Profile(Frozen):
    """How evidence becomes tags and an impact level. All of it is data."""

    code: str
    term_lists: tuple[str, ...] = Field(min_length=1)  # lists to load; groups of one name merge across them
    stopword_group: str = ""
    tags: tuple[TagRule, ...] = Field(min_length=1)
    field_weights: tuple[tuple[Field_, float], ...] = (
        (Field_.FILENAME, 3.0),
        (Field_.TITLE, 2.5),
        (Field_.HEADINGS, 1.5),
        (Field_.BODY, 1.0),
    )
    saturation: float = Field(default=1.5, gt=0)  # k in c / (c + k): repeats add less and less
    scale: float = Field(default=4.0, gt=0)  # score at which confidence is about 0.63
    threshold: float = Field(default=0.35, ge=0, le=1)  # confidence needed to keep a tag
    max_ngram: int = Field(default=4, ge=1, le=8)


class DocumentText(Frozen):
    name: str
    filename: str = ""
    title: str = ""
    headings: tuple[str, ...] = ()
    body: str = ""


class MatchedTerm(Frozen):
    term: str
    field: Field_
    count: int
    contribution: float


class TagScore(Frozen):
    tag: str
    axis: Axis
    impact: Impact
    score: float
    confidence: float
    matches: tuple[MatchedTerm, ...]


class DocumentScore(Frozen):
    name: str
    impact: Impact
    kind: str | None  # the strongest kind tag
    subjects: tuple[str, ...]  # subject tags, strongest first
    tags: tuple[TagScore, ...]  # kept tags, strongest first
    reason: str


class DuplicatePair(Frozen):
    left: str
    right: str
    similarity: float
