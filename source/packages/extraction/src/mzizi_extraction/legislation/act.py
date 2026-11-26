"""An Act of Parliament as a tree: parts, sections, subsections, paragraphs, definitions and schedules, one statement each.

Acts are typeset differently from constitutions, and from one another, so the parser is driven by an `ActLayout` (the
publisher's running headers, where the body starts, how a section heading sits) and reads only text and font weight:

- `heading="inline"`: the section heading shares the line with its number (`3. Formation of political parties`).
- `heading="bold-above"`: the heading is set in bold on the line(s) above the number (`Short title.` then `1. This Act ...`).

As in the constitution parser, a marker is accepted only when it is the one expected next (sections 1, 2, 3, 4A, 4B, 5...;
subsections (1), (1A), (2)...; paragraphs (a), (b), (ha)...), so a cross-reference at the start of a line is not taken for a
new provision. Print annotations (`[Act No. 2 of 2022, s. 4.]`) are kept on the node they follow. The arrangement of sections
in the contents is read too, so the result can be checked against it: anything missing or unplaced is reported, never dropped.
"""

from __future__ import annotations

import re

from mzizi_extraction.legislation.act_lines import (  # noqa: F401  (re-exported)
    CLAUSE_LINE,
    DEFINITION_LINE,
    ITEM_LINE,
    LEAD_IN,
    LETTER_LINE,
    NOTE_START,
    ORDINALS,
    PART_LINE,
    ROMAN_LINE,
    SCHEDULE_LINE,
    SECTION_LINE,
    ActLayout,
    ActLine,
    ActReport,
    _balanced,
    _clean,
    _clean_caps,
    _designation,
    _follows,
    _join,
    _margin_lines,
    _next_letter,
    _roman,
    _roman_value,
    read_lines,
)
from mzizi_extraction.legislation.models import ROMAN, Node


class _Parser:
    def __init__(self, layout: ActLayout) -> None:
        self.layout = layout
        self.root = Node("instrument", "", "")
        self.report = ActReport(self.root)
        self.part: Node | None = None
        self.section: Node | None = None
        self.clause: Node | None = None
        self.paragraph: Node | None = None
        self.definition: Node | None = None
        self.schedule: Node | None = None
        self.item: Node | None = None
        self.target: Node | None = None
        self.buffer: list[str] = []
        self.pending: list[str] = []
        self.note: list[str] = []
        self.last_section: tuple[int, str] | None = None
        self.heading_open = False
        self.last_schedule = 0
        self.last_part = 0

    def flush(self) -> None:
        if self.target is not None and self.buffer:
            self.target.text = _join([self.target.text, *self.buffer]) if self.target.text else _join(self.buffer)
        self.buffer = []

    def open(self, node: Node, parent: Node | list[Node], text: str = "") -> None:
        self.flush()
        (parent if isinstance(parent, list) else parent.children).append(node)
        self.target, self.buffer = node, [text] if text else []

    def holder(self) -> Node | None:
        return self.definition or self.clause or self.section

    def siblings_last(self, holder: Node, kind: str) -> Node | None:
        same = [c for c in holder.children if c.kind == kind]
        return same[-1] if same else None

    def end_note(self, page: int) -> None:
        owner = self.schedule or self.section or self.part
        if owner is not None:
            owner.notes.append(_clean(" ".join(self.note)))
        else:
            self.report.notes.append(f"page {page}: annotation before any provision: {' '.join(self.note)[:80]}")
        self.note = []

    def margin_heading(self, text: str) -> None:
        """A margin heading line: the end of the open section's heading (it wraps below the number) or the next one's start."""
        if self.section is not None and self.heading_open:
            self.section.title = _join([self.section.title, text]).rstrip(".")
            self.heading_open = not text.endswith(".")
        else:
            self.pending.append(text)

    def feed(self, line: ActLine) -> None:
        text = line.text
        if line.margin and self.schedule is None:
            self.margin_heading(text)
            return
        if self.note:
            self.note.append(text)
            if text.endswith("]"):
                self.end_note(line.page)
            return
        if NOTE_START.match(text):
            self.note = [text]
            if text.endswith("]"):
                self.end_note(line.page)
            return
        sched = SCHEDULE_LINE.match(text)
        if (
            sched
            and (sched.group(1) is None or sched.group(1) in ORDINALS)
            and text.split("SCHEDULE")[0].strip().isupper() | (text.startswith("SCHEDULE"))
        ):
            ordinal = ORDINALS.get(sched.group(1) or "", 0)
            if ordinal == self.last_schedule + 1 or (not ordinal and self.last_schedule == 0):
                self.last_schedule = ordinal or 1
                self.start_schedule(sched, line.page)
                return
            if "continued" in text.lower():
                return  # a running head repeated on the schedule's next page
        if self.schedule is not None:
            self.in_schedule(line)
            return
        part = PART_LINE.match(text)
        if part:
            self.flush()
            number = _roman_value(part.group(1))
            if number <= self.last_part:
                self.report.notes.append(
                    f"page {line.page}: Part {part.group(1).upper()} printed twice; read as Part {_roman(self.last_part + 1)}"
                )
                number = self.last_part + 1
            self.last_part = number
            self.part = Node("part", f"Part {_roman(number)}", _clean_caps(part.group(2)), page=line.page)
            self.root.children.append(self.part)
            self.section = self.clause = self.paragraph = self.definition = None
            self.target = self.part
            return
        if (
            self.target is self.part
            and self.part is not None
            and not self.part.children
            and text.isupper()
            and not self.buffer
        ):
            self.part.title = _clean(f"{self.part.title} {text}")
            return
        if self.start_section(line):
            return
        if self.section is not None and self.in_section(line):
            return
        if self.layout.heading == "bold-above" and line.bold and not re.match(r"^[(\d]", text):
            self.pending.append(text)
            return
        if self.target is not None:
            self.buffer.append(text)
        else:
            self.report.unplaced.append(f"page {line.page}: {text[:80]}")

    def start_section(self, line: ActLine) -> bool:
        m = SECTION_LINE.match(line.text)
        if not m or not _follows(self.last_section, int(m.group(1)), m.group(2)):
            return False
        number, rest = f"{m.group(1)}{m.group(2)}", m.group(3)
        if self.layout.heading == "inline":
            if len(rest) > self.layout.longest_inline_heading or rest.startswith("("):
                return False
            heading, body = rest, ""
        else:
            heading, body = _join(self.pending).rstrip("."), rest
            self.heading_open = bool(self.pending) and not self.pending[-1].endswith(".")
            self.pending = []
        self.last_section = (int(m.group(1)), m.group(2))
        self.flush()
        section = Node("section", f"Section {number}", heading, page=line.page)
        (self.part.children if self.part is not None else self.root.children).append(section)
        self.section, self.clause, self.paragraph, self.definition = section, None, None, None
        self.report.sections.append(number)
        self.target, self.buffer = section, []
        self.body(body, line.page)
        return True

    def body(self, text: str, page: int) -> None:
        if not text:
            return
        c = CLAUSE_LINE.match(text)
        if c and (int(c.group(1)), c.group(2)) == (1, "") and self.section is not None:
            self.clause = Node("subsection", "(1)", page=page)
            self.open(self.clause, self.section, c.group(3))
        else:
            self.buffer.append(text)

    def in_section(self, line: ActLine) -> bool:
        section, text = self.section, line.text
        assert section is not None
        if self.layout.definitions_in.search(section.title):
            d = DEFINITION_LINE.match(text)
            if d:
                holder = self.clause or section
                self.definition = Node("definition", d.group(1), page=line.page)
                self.paragraph = None
                self.open(self.definition, holder, text)
                return True
        c = CLAUSE_LINE.match(text)
        if c and self.definition is None:
            last = self.siblings_last(section, "subsection")
            prior = _designation(last.designation.strip("()")) if last else None
            if _follows(prior, int(c.group(1)), c.group(2)) and not (
                last is None and (int(c.group(1)), c.group(2)) != (1, "")
            ):
                self.clause, self.paragraph = Node("subsection", f"({c.group(1)}{c.group(2)})", page=line.page), None
                self.open(self.clause, section, c.group(3))
                return True
        parent = self.holder()
        if parent is None:
            return False
        r = ROMAN_LINE.match(text)
        if r and self.paragraph is not None:
            want = ROMAN[len(self.paragraph.children)] if len(self.paragraph.children) < len(ROMAN) else ""
            lead = (
                _join([self.paragraph.text, *self.buffer]).endswith(LEAD_IN) if self.target is self.paragraph else True
            )
            ambiguous = r.group(1) in _next_letter(self._last_letter(parent))
            if r.group(1) == want and (not ambiguous or lead):
                sub = Node("subparagraph", f"({r.group(1)})", page=line.page)
                self.open(sub, self.paragraph, r.group(2))
                return True
        p = LETTER_LINE.match(text)
        if p and p.group(1) in _next_letter(self._last_letter(parent)):
            self.paragraph = Node("paragraph", f"({p.group(1)})", page=line.page)
            self.open(self.paragraph, parent, p.group(2))
            return True
        return False

    def _last_letter(self, holder: Node) -> str | None:
        last = self.siblings_last(holder, "paragraph")
        return last.designation.strip("()") if last else None

    def start_schedule(self, m: re.Match[str], page: int) -> None:
        self.flush()
        ordinal = ORDINALS.get(m.group(1) or "")
        rest = m.group(2)
        ref = _balanced(rest)
        node = Node(
            "schedule", f"Schedule {ordinal}" if ordinal else "Schedule", _clean(ref[1] if ref else rest), page=page
        )
        if ref:
            node.notes.append(ref[0])
        self.root.children.append(node)
        self.schedule, self.item, self.paragraph = node, None, None
        self.section = self.clause = self.definition = self.part = None
        self.target = node

    def in_schedule(self, line: ActLine) -> None:
        text, schedule = line.text, self.schedule
        assert schedule is not None
        if not schedule.children and not schedule.text and not self.buffer and text.isupper():
            schedule.title = _clean(f"{schedule.title} {text}")
            return
        m = ITEM_LINE.match(text)
        if m and int(m.group(1)) == len([c for c in schedule.children if c.kind == "item"]) + 1:
            self.item, self.paragraph = Node("item", m.group(1), page=line.page), None
            self.open(self.item, schedule, m.group(2))
            return
        p = LETTER_LINE.match(text)
        holder = self.item or schedule
        if p and p.group(1) in _next_letter(self._last_letter(holder)):
            self.paragraph = Node("paragraph", f"({p.group(1)})", page=line.page)
            self.open(self.paragraph, holder, p.group(2))
            return
        self.buffer.append(text)


def parse_act(path: str, layout: ActLayout, first: int = 0, last: int | None = None) -> ActReport:
    """Parse the pages [first, last) (0-based) of an Act laid out as `layout` describes."""
    parser = _Parser(layout)
    started = False
    for line in read_lines(path, first, last, layout):
        if any(p.match(line.text) for p in layout.running):
            continue
        if not started:
            if layout.toc_entry is not None:
                t = layout.toc_entry.match(line.text)
                if t:
                    parser.report.toc[t.group(1)] = _clean(t.group(2))
                    continue
            if layout.body_start.match(line.text) and not re.search(r"\.{4,}", line.text):
                started = True
                if layout.skip_start_line:
                    continue
            else:
                parser.report.front.append(line.text)
                continue
        parser.feed(line)
    parser.flush()
    return parser.report
