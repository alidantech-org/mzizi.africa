"""A budget table PDF through extraction, realignment, staging, review and promotion into finance.* tables."""
import os
import subprocess
import uuid
from decimal import Decimal
from pathlib import Path

import pytest

from mzizi_data import tables
from mzizi_data.imports import budget_table
from tests.pdfmaker import make_pdf

BACKEND = Path(__file__).resolve().parents[2]


def cell_text(cells):
    out = []
    for r, row in enumerate(cells):
        for c, text in enumerate(row):
            if text:
                out.append((72 + c * 110 + 4, 500 + (len(cells) - r - 1) * 30 + 10, text))
    return out


def budget_pdf():
    cells = [["MDA", "Recurrent", "Development", "Total"], ["(Kshs. Millions)", "", "", ""], ["Health Dept", "1,200", "300", "1,500"], ["Roads Dept", "800", "1,000", "1,800"]]
    return make_pdf([{"text": [(72, 700, "Table 2: Allocations by MDA, financial year 2023/24"), *cell_text(cells)], "grid": (72, 500, 4, 4, 110, 30)}])


def cli(url, *args):
    out = subprocess.run(["bun", "src/cli.ts", *args], cwd=BACKEND / "database", env={**os.environ, "DATABASE_URL": url}, capture_output=True, text=True)
    assert out.returncode == 0, out.stderr + out.stdout
    return out.stdout


def test_realign_reads_unit_scale_and_right_aligns_short_rows():
    parsed = tables.parse_table([["MDA", "Recurrent", "Development", "Total"], ["(Kshs. Millions)"], ["Ministry A", "10", "5", "15"], ["Ministry B", "7", "7"], ["Ministry C", "(2)", "1", "-1"]])
    assert parsed.currency == "KES" and parsed.scale == Decimal(10) ** 6
    assert [r["label"] for r in parsed.rows] == ["Ministry A", "Ministry B", "Ministry C"]
    assert parsed.rows[1]["values"] == {"Recurrent": None, "Development": Decimal(7), "Total": Decimal(7)}
    assert parsed.rows[2]["values"]["Recurrent"] == Decimal(-2)
    assert any("leading column" in p for p in parsed.problems)


def test_fiscal_year_dates():
    assert budget_table.fiscal_year_dates("2023/24") == ("2023/24", "2023-07-01", "2024-06-30")


def test_a_budget_pdf_reaches_canonical_budgets_only_through_review(tmp_path):
    from tests.conftest import scratch_database
    from mzizi_data.db import connect
    from mzizi_data.files import LocalDirectoryStore

    url = scratch_database("mzizi_test")
    out_title = f"Allocations by MDA {uuid.uuid4()}"
    pdf = tmp_path / "allocations.pdf"
    pdf.write_bytes(budget_pdf())
    with connect(url) as conn:
        out = budget_table.import_budget_table(conn, LocalDirectoryStore(conn, tmp_path / "objects"), pdf, "ke", "2023/24", out_title, "test-treasury", "Test Treasury")
        assert (out.stats["fiscal_year"].created, out.stats["unit"].created) == (1, 2) and "budget" not in out.stats
        assert conn.execute("SELECT count(*) AS n FROM finance.budgets").fetchone()["n"] == 0  # nothing canonical yet
        licence = conn.execute("SELECT licence FROM source.documents WHERE id = %s", (out.document_id,)).fetchone()["licence"]
        assert "Not confirmed by a human reviewer" in licence
        reviewer = conn.execute("INSERT INTO identity.accounts (issuer, subject, status, created_at, updated_at, version) VALUES ('test', 'budget', 'active', now(), now(), 1) RETURNING id").fetchone()["id"]
        conn.execute("INSERT INTO identity.grants (account_id, role, is_current, created_at, updated_at, version) VALUES (%s, 'reviewer', true, now(), now(), 1)", (reviewer,))
        conn.commit()

        def review_and_promote(run):
            cli(url, "validate", run)
            ready = [c["id"] for c in conn.execute("SELECT id FROM staging.candidates WHERE run_id = %s AND status = 'in_review'", (run,)).fetchall()]
            assert ready
            for cid in ready:
                conn.execute("INSERT INTO audit.decisions (target_kind, target_id, decision, proposed_state, rationale, reviewer_id, created_at, updated_at, version) VALUES ('staging.candidates', %s, 'approve', 'unverified', 'test reviewer', %s, now(), now(), 1)", (cid, reviewer))
            conn.commit()
            cli(url, "apply-review")
            cli(url, "promote", run)

        review_and_promote(out.runs["fiscal_year"])
        review_and_promote(out.runs["unit"])
        later = budget_table.import_budget_table(conn, LocalDirectoryStore(conn, tmp_path / "objects"), pdf, "ke", "2023/24", out_title, "test-treasury", "Test Treasury", stages=("budget",))
        assert later.stats["budget"].created == 4 and later.document_id == out.document_id
        review_and_promote(later.runs["budget"])
        rows = conn.execute("SELECT b.program_code, b.approved_amount::numeric AS amount, b.currency_code FROM finance.budgets b JOIN finance.units u ON u.id = b.unit_id WHERE u.name = 'Health Dept' ORDER BY b.program_code").fetchall()
        assert [(r["program_code"], r["amount"], r["currency_code"]) for r in rows] == [("development", Decimal(300_000_000), "KES"), ("recurrent", Decimal(1_200_000_000), "KES")]
        assert conn.execute("SELECT count(*) AS n FROM source.attributions").fetchone()["n"] >= 4
