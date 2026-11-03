from datetime import datetime, timedelta, timezone

from mzizi_data import jobs, reinforcement as r


def test_resolve_agreeing_and_disagreeing_sources():
    t = datetime(2026, 1, 1, tzinfo=timezone.utc)
    agree = r.resolve([r.Claim("a", "h1", "p1", 0.6, t), r.Claim("b", "h1", "p2", 0.7, t)])
    assert agree.winner == "b" and agree.corroboration == 2 and not agree.disputed
    clash = r.resolve([r.Claim("a", "h1", "p1", 0.9, t), r.Claim("b", "h2", "p2", 0.5, t), r.Claim("c", "h2", "p3", 0.5, t), r.Claim("d", "h1", "p1", 0.4, t + timedelta(days=1))])
    assert clash.winner == "a" and clash.disputed and clash.distinct_values == 2 and clash.corroboration == 1


def test_most_recent_wins_a_trust_tie():
    t = datetime(2026, 1, 1, tzinfo=timezone.utc)
    assert r.resolve([r.Claim("old", "h1", "p1", 0.5, t), r.Claim("new", "h2", "p2", 0.5, t + timedelta(days=1))]).winner == "new"


def _attr(conn, code, reliability, target, value_note):
    from mzizi_data.register import DocumentSpec, ensure_document, ensure_method, ensure_publisher

    pub = ensure_publisher(conn, code, code)
    conn.execute("UPDATE source.publishers SET reliability = %s WHERE id = %s", (reliability, pub))
    doc = ensure_document(conn, DocumentSpec(pub, f"{code} page", "survey"))
    method = ensure_method(conn, "extracted", "test", "pytest", "1")
    return conn.execute("""INSERT INTO source.attributions (document_id, target_kind, target_id, target_field, relation, method_id, confidence, created_at, updated_at, version)
        VALUES (%s, 'geography.units', %s, 'population', 'supports', %s, 1.0, now(), now(), 1) RETURNING id""", (doc, target, method)).fetchone()["id"]


def test_coverage_gap_creation_nothing_found_and_found_through_claims(conn):
    import uuid

    rules = {"geography.units": {"parent_id": ["fake"]}}
    cov = r.coverage(conn, rules)[0]
    assert cov["total"] == cov["present"] + cov["unknown"] + cov["known_absent"]
    assert r.build_gaps(conn, rules) == cov["unknown"] and r.build_gaps(conn, rules) == 0

    target = uuid.uuid4()
    gap = conn.execute("INSERT INTO engine.gaps (target_kind, target_id, field, refill_sources, priority) VALUES ('geography.units', %s, 'population', '[\"nothing\", \"finds\"]', 99) RETURNING id", (target,)).fetchone()["id"]
    r.REFILL_SOURCES["nothing"] = lambda g: r.Finding("not_found")
    assert r.enqueue_refills(conn, 1) == 1
    attr_a, attr_b = _attr(conn, "pub-a", 0.9, target, "a"), _attr(conn, "pub-b", 0.4, target, "b")
    r.REFILL_SOURCES["finds"] = lambda g: r.Finding("found", 1234, str(attr_a))
    job = jobs.run_once(conn, {"refill": r.refill_handler(conn)})
    row = conn.execute("SELECT * FROM engine.gaps WHERE id = %s", (gap,)).fetchone()
    assert job and row["status"] == "found" and row["attempts"] == 1
    outcomes = {a["refill_source"]: a["outcome"] for a in conn.execute("SELECT * FROM engine.gap_attempts WHERE gap_id = %s", (gap,))}
    assert outcomes == {"nothing": "not_found", "finds": "found"}
    claim = conn.execute("SELECT * FROM engine.claims WHERE target_id = %s", (target,)).fetchone()
    assert claim["review"] == "proposed" and claim["value"] == 1234 and float(claim["trust"]) == 0.9

    r.add_claim(conn, "geography.units", target, "population", 1500, attr_b)
    st = conn.execute("SELECT * FROM engine.claim_standings WHERE target_id = %s", (target,)).fetchone()
    assert st["disputed"] and st["winning_claim_id"] == claim["id"] and st["corroboration"] == 1
    assert r.mark_disputed_and_stale(conn) >= 1
    assert conn.execute("SELECT reason, status FROM engine.gaps WHERE id = %s", (gap,)).fetchone() == {"reason": "disputed", "status": "open"}


def test_nothing_found_is_not_repeated_before_the_retry_time(conn):
    import uuid

    target = uuid.uuid4()
    gap = conn.execute("INSERT INTO engine.gaps (target_kind, target_id, field, refill_sources, priority) VALUES ('geography.units', %s, 'x', '[\"nothing\"]', 99) RETURNING id", (target,)).fetchone()["id"]
    r.REFILL_SOURCES["nothing"] = lambda g: r.Finding("not_found")
    r.enqueue_refills(conn, 1)
    jobs.run_once(conn, {"refill": r.refill_handler(conn)})
    assert conn.execute("SELECT status FROM engine.gaps WHERE id = %s", (gap,)).fetchone()["status"] == "not_found"
    assert all(g["id"] != gap for g in r.queue(conn, 1000))


def test_scope_gaps_count_records_with_a_jurisdiction_root_and_no_scope(conn):
    rows = {x["table"]: x for x in r.scope_gaps(conn)}
    assert set(rows) == {"governance.institutions", "governance.offices", "finance.units", "statistical.datasets"}
    assert all(x["gaps"] <= x["total"] - x["scoped"] for x in rows.values())
    assert "scope check" in r.format_scope_gaps(list(rows.values()))
