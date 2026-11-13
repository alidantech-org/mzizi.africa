"""Markdown chunking for retrieval."""

from mzizi_extraction.document import chunk_markdown

DOC = """<!-- page 1 -->

# Budget

Intro paragraph about the county budget and its purpose for the year ahead of us all.

## Revenue

Revenue comes from taxes and fees collected across the county every quarter without fail.

- list item one
- list item two

## Spending

Spending covers health, roads and schools according to the approved appropriation act.
"""


def test_chunks_follow_headings_and_keep_the_path() -> None:
    chunks = chunk_markdown(DOC, max_chars=400, min_chars=10)
    paths = [c.heading_path for c in chunks]
    assert paths == [("Budget",), ("Budget", "Revenue"), ("Budget", "Spending")]
    assert (
        [c.index for c in chunks] == [0, 1, 2] and "list item two" in chunks[1].text and "page 1" not in chunks[0].text
    )


def test_long_paragraphs_split_without_breaking_words_and_small_tails_merge() -> None:
    body = " ".join(["word"] * 400)
    chunks = chunk_markdown(f"# T\n\n{body}\n\ntiny", max_chars=300, min_chars=50)
    assert all(len(c.text) <= 340 for c in chunks) and chunks[-1].text.endswith("tiny")
    assert all(not w or w == "word" or w == "tiny" for c in chunks for w in c.text.split())


def test_empty_and_heading_only_documents_give_no_chunks() -> None:
    assert chunk_markdown("") == [] and chunk_markdown("# Only a title\n") == []
