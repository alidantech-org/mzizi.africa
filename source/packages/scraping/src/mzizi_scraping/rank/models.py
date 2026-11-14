"""Typed contracts for ranking a found file or page against Mzizi targets, from manifest rules."""

from __future__ import annotations

from enum import StrEnum

from pydantic import ConfigDict, Field

from mzizi_scraping.core import External, Frozen


class Signal(StrEnum):
    """What a rule looks at; each is a fact recorded when the file was found."""

    SECTION = "section"
    ANCHOR_TEXT = "anchor_text"
    FILENAME = "filename"
    SOURCE_PAGE_TITLE = "source_page_title"
    SOURCE_PAGE_PATH = "source_page_path"
    EXTENSION = "extension"


class Condition(External):
    signal: Signal
    contains: tuple[str, ...] = Field(min_length=1)
    weight: float = Field(default=1.0, gt=0, le=10)


class RankRule(External):
    model_config = ConfigDict(frozen=True, populate_by_name=True, extra="ignore")

    target: str  # a `schema.table` listed in the targets contract
    label: str  # what the content is expected to be, e.g. "allocation schedule"
    conditions: tuple[Condition, ...] = Field(min_length=1)
    confidence_cap: float = Field(default=0.8, gt=0, le=1)
    provenance: str = "custom-prepared"


class RankingRules(External):
    schema_version: str = Field(default="mzizi.ranking/v1", alias="schema")
    rules: tuple[RankRule, ...] = ()


class FileFeatures(Frozen):
    """The facts known about a file before it is opened."""

    url: str
    filename: str
    extension: str
    section: str
    anchor_text: str
    source_page_title: str
    source_page_path: str


class Evidence(Frozen):
    signal: Signal
    matched: str
    weight: float


class Expectation(Frozen):
    target: str
    label: str
    score: float
    evidence: tuple[Evidence, ...]
    rule_provenance: str


class ExpectationMap(Frozen):
    """Ranked expectations for one file. Proposals: scores rank candidates, they never decide a mapping."""

    url: str
    expectations: tuple[Expectation, ...]
