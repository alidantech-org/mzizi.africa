"""Interface copy rows: every English word and Swahili sentence the web app shows becomes a `reference.copy` row.

Keys: `web.word.<name>` for the interface words, `web.phrase.<slug>` for sentences and headings, where the slug is the
English text lowercased with every run of other characters turned into one hyphen; a slug over 60 characters is cut to 50 and ends with the FNV-1a hash of the whole slug (the app computes the same key).
The English phrase row exists so the database holds the wording in every language; the Swahili rows are development text.
"""

from __future__ import annotations

import json
from pathlib import Path
import re

from dev_seed.store import Tables


def _fnv1a(text: str) -> str:
    h = 0x811C9DC5
    for ch in text:
        h = ((h ^ ord(ch)) * 0x01000193) & 0xFFFFFFFF
    return format(h, "x")


def phrase_key(english: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", english.lower().replace("{}", " n ")).strip("-")
    if len(slug) > 60:
        slug = slug[:50].strip("-") + "-" + _fnv1a(slug)
    return "web.phrase." + slug


def build_copy(t: Tables) -> None:
    data = json.loads((Path(__file__).parent / "data" / "copy.json").read_text(encoding="utf-8"))

    def add(key: str, language: str, text: str) -> None:
        t.add(
            "global/reference/dev.copy.csv",
            {
                "key": key,
                "language_code": language,
                "text": text,
                "is_development_text": "true",
            },
        )

    for language, words in data["words"].items():
        for name, text in words.items():
            add(f"web.word.{name.lower()}", language, text)
    for english, swahili in data["phrases"].items():
        add(phrase_key(english), "en", english)
        add(phrase_key(english), "sw", swahili)
