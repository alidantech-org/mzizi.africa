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


class TermKind(StrEnum):
    CONCEPT = "concept"
    INSTANCE = "instance"
    ABBREVIATION = "abbreviation"
    TITLE = "title"
    UNIT = "unit"
    PATTERN_WORD = "pattern-word"


class TermEntry(Frozen):
    model_config = ConfigDict(frozen=True, extra="forbid", populate_by_name=True)

    value: str = Field(min_length=1)
    language: str = ""
    aliases: tuple[Alias, ...] = ()
    meaning: str = ""
    kind: TermKind | None = None
    represents: str = ""  # the reference value or seed row this term stands for
    variant_of: str = ""
    refers_to: str = ""
    applies_to: tuple[str, ...] = ()
    valid_from: str = ""
    valid_until: str = ""
    register_: str = Field(default="", alias="register")
    source: str = ""
    notes: str = ""

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
    CONCEPT = "concept"


class Shape(StrEnum):
    TEXT = "text"
    NAME = "name"
    MONEY = "money"
    DATE = "date"
    INTEGER = "integer"
    CODE = "code"
    PERCENTAGE = "percentage"
    URL = "url"
    EMAIL = "email"
    PHONE = "phone"


class Repeat(Frozen):
    min: int = Field(default=1, ge=0, le=20)
    max: int = Field(default=1, ge=1, le=20)


class Span(Frozen):
    min: int = Field(default=1, ge=1, le=20)
    max: int = Field(default=20, ge=1, le=20)


class LetterSpan(Span):
    case: str = "any"


class Part(Frozen):
    """One part of a pattern; exactly one of the kinds below is set."""

    as_: str = Field(default="", alias="as")
    optional: bool = False
    lazy: bool = False
    repeat: Repeat | None = None
    group: str = ""
    literal: str = ""
    words: str = ""
    digits: Span | None = None
    letters: LetterSpan | None = None
    punct: str = ""
    number: bool = False
    any_of: tuple[Part, ...] = ()

    model_config = ConfigDict(frozen=True, extra="forbid", populate_by_name=True)


Part.model_rebuild()


class Example(Frozen):
    text: str
    captures: dict[str, str] = Field(default_factory=dict)


class Pattern(Frozen):
    pattern: str
    label: str = ""
    describe: str = ""
    means: str = ""
    sequences: tuple[tuple[Part, ...], ...]
    examples: tuple[Example, ...]
    counterexamples: tuple[str, ...] = ()


class HeadingRule(Frozen):
    rule: str
    label: str = ""
    describe: str = ""
    qualifier_is: str = ""
    sequences: tuple[tuple[Part, ...], ...]
    examples: tuple[Example, ...]
    counterexamples: tuple[str, ...] = ()


class SplitInto(Frozen):
    from_capture: str
    as_: str = Field(alias="as")

    model_config = ConfigDict(frozen=True, extra="forbid", populate_by_name=True)


class Split(Frozen):
    split: str
    label: str = ""
    describe: str = ""
    heading_rule: str
    cell_pattern: str
    min_share: float = 0.8
    into: tuple[SplitInto, ...]
    examples: tuple[Example, ...] = ()


class TermGroup(Frozen):
    group: str
    kind_words: bool = False
    shape: Shape | None = None
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
    patterns: tuple[Pattern, ...] = ()
    heading_rules: tuple[HeadingRule, ...] = ()
    splits: tuple[Split, ...] = ()


class TagRule(Frozen):
    tag: str
    impact: Impact
    weight: float = Field(default=1.0, gt=0)
    schemas: tuple[
        str, ...
    ] = ()  # database schemas a document with this tag is likely about (finance, civic, official)
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


class ColumnProbe(Frozen):
    """One column of a source table: its heading and a few of its cells."""

    header: str
    samples: tuple[str, ...] = ()


class ColumnCandidate(Frozen):
    target: str  # <schema>.<table>.<column>, as the stored column
    group: str
    score: float
    matched_term: str
    header_score: float
    shape: Shape | None  # what the group expects
    shape_share: float | None  # share of the sampled cells that look like that shape
    specificity: int = 0  # 0 global, 1 country, 2 publisher: a more specific list wins a tie
    preferred: bool = False  # the target is in a schema the document is about; wins a tie
    reads_as: str = ""  # what the matched link says the cell is (person, organisation, abbreviation)


class ColumnProposal(Frozen):
    header: str
    status: str  # matched, weak (a person should confirm), ambiguous (rival targets) or unmatched
    chosen: ColumnCandidate | None
    alternatives: tuple[ColumnCandidate, ...]
    detected: tuple[tuple[Shape, float], ...]  # the shapes the cells look like, strongest first
    heading: HeadingParts | None = None  # how the heading is built, when a heading rule matched
    unit: str = ""  # a unit read from the heading's qualifier (ksh, USD)
    says: tuple[tuple[str, int], ...] = ()  # what cells turned out to be: person, organisation, address ... with counts
    split: SplitProposal | None = None  # the column looks like two collapsed into one
    note: str = ""


class DictLink(Frozen):
    list: str
    key: str
    role: str  # heading, value, unit, member or exclude
    weight: float = 1.0
    says: str = ""


class DictColumn(Frozen):
    means: str = ""
    shape: Shape | None = None
    says: str = ""
    terms: tuple[DictLink, ...] = ()


class CodePart(Frozen):
    scope: bool = False
    const: str = ""
    slug: str = ""
    name_slug: str = ""
    code: str = ""
    last: str = ""
    value: str = ""
    kind: str = ""
    input: str = ""
    qualifier: str = ""
    optional: bool = False


class CodeRecipe(Frozen):
    parts: tuple[CodePart, ...] = Field(min_length=1)
    unique_within: tuple[str, ...] = ()


class InputLink(Frozen):
    list: str
    key: str


class LookupKind(Frozen):
    table: str
    key: str
    column: str


class LookupSource(Frozen):
    table: str
    text: str
    code: str
    language: str = ""
    kind: LookupKind | None = None


class TableLookup(Frozen):
    sources: tuple[LookupSource, ...] = Field(min_length=1)


class TableSpec(Frozen):
    describe: str = ""
    code: CodeRecipe | None = None
    lookup: TableLookup | None = None
    inputs: dict[str, tuple[InputLink, ...]] = Field(default_factory=dict)  # named values a source column can supply


class Dictionary(Frozen):
    """A column dictionary (`sys.col.<scope>.<domain>`): the terms that define each database column."""

    code: str
    describe: str = ""
    columns: dict[str, DictColumn] = Field(default_factory=dict)
    tables: dict[str, TableSpec] = Field(default_factory=dict)


class HeadingParts(Frozen):
    base: str
    qualifier: str = ""
    qualifier_is: str = ""
    rule: str = ""


class SplitProposal(Frozen):
    split: str
    source_header: str = ""
    cell_pattern: str = ""
    domain: str = ""
    main_capture: str = ""
    qualifier_capture: str = ""
    share: float
    main_heading: str
    qualifier_heading: str
    main_cells: tuple[str, ...]
    qualifier_cells: tuple[str, ...]
