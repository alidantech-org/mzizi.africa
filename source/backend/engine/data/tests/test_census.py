from mzizi_data.imports import census
from mzizi_data.statload import ref


def page(title, rows):
    out = [f"      Table 2. {title}", "   National/ County    a   b   c"]
    for name, nums in rows:
        out.append(f"      {name}{'…………..…'}   " + "   ".join(nums))
    return "\n".join(out)


def fixture(break_sum=False):
    kid_b = "40" if not break_sum else "41"
    sex = [("Kenya", ["60", "40", "..", "100"]), ("Alpha", ["30", "20", "..", "50"]), ("Alpha", ["10", "10", "..", "20"]), ("Beta", ["20", "10", "..", "30"]), ("Beta", ["30", "20", "..", "50"]), ("Beta", ["0", "0", "..", "0"])]
    # Alpha has sub-counties Alpha (20) and Beta-less: rewrite as a clean example below
    sex = [
        ("Kenya", ["60", "40", "..", "100"]),
        ("Mombasa", ["30", "20", "..", "50"]),
        ("Changamwe", ["10", "10", "..", "20"]),
        ("Jomvu", ["20", "10", "..", "30" if not break_sum else "31"]),
        ("Kwale", ["30", "20", "..", "50"]),
        ("Kwale", ["30", "20", "..", "50"]),
    ]
    hh = [("Kenya", ["96", "30", "3.2"]), ("Mombasa", ["48", "15", "3.2"]), ("Changamwe", ["19", "6", "3.2"]), ("Jomvu", ["29", "9", "3.2"]), ("Kwale", ["48", "15", "3.2"]), ("Kwale", ["48", "15", "3.2"])]
    area = [("Kenya", ["100", "8,487.0", "0"]), ("Mombasa", ["50", "219.9", "1"]), ("Changamwe", ["20", "17.7", "1"]), ("Jomvu", ["30", "30.0", "1"]), ("Kwale", ["50", "8,267.1", "1"]), ("Kwale", ["50", "8,267.1", "1"])]
    county = lambda rows: [rows[0], rows[1], rows[4]]  # noqa: E731
    return [
        "Table of Contents",
        page("2: Distribution by Sex and County", county(sex)).replace("Table 2. 2:", "Table 2. 2:"),
        page("3: Distribution of Population, Households and size by County", county(hh)),
        page("4: Distribution of Population, Land Area and Density by County", county(area)),
        page("5: Distribution by Sex and Sub-County", sex),
        page("6: Distribution of Households by Sub-County", hh),
        page("7: Land Area by Sub-County", area),
    ]


def test_parse_rows_reads_dot_leader_rows_and_missing_marks():
    rows = census.parse_rows("  Changamwe……………..            68,761        63,121                 ..     131,882\n  Laikipia…………………………..\n   259,440   259,102   18   518,560")
    assert rows[0] == ("Changamwe", ["68,761", "63,121", "..", "131,882"])
    assert rows[1] == ("Laikipia", ["259,440", "259,102", "18", "518,560"])


def test_a_forest_row_with_a_star_and_a_dotted_name_is_read():
    rows = census.parse_rows("      Mt. Kenya Forest*..…...……..………….…19                   3                  ..             22")
    assert rows == [("Mt. Kenya Forest", ["19", "3", "..", "22"])]


def test_clean_table_passes_every_check(monkeypatch):
    monkeypatch.setattr(census, "NATIONAL_TOTAL", 100)
    c = census.parse(fixture())
    assert c.checks == []
    assert any("national total" in p for p in c.passed)


def test_a_table_that_does_not_add_up_is_reported_and_its_rows_are_held_back(monkeypatch):
    monkeypatch.setattr(census, "NATIONAL_TOTAL", 100)
    c = census.parse(fixture(break_sum=True))
    assert any("Jomvu" in m or "Mombasa" in m for m in c.checks)

    class Resolver:
        counties = {"mombasa": "ke/mombasa", "kwale": "ke/kwale"}
        children = {(2, "ke/mombasa"): {"changamwe": "ke/mombasa/changamwe"}}

    groups, report = census.build_groups(c, Resolver())
    assert report["held_back"], "sub-counties that do not add to their county must not be staged"
    assert not [o for o in next(g for g in groups if g.name == "observation").rows if "changamwe" in str(o["geoUnitId"])]


def test_sub_counties_link_to_constituencies_by_exact_name_only(monkeypatch):
    monkeypatch.setattr(census, "NATIONAL_TOTAL", 100)
    c = census.parse(fixture())

    class Resolver:
        counties = {"mombasa": "ke/mombasa", "kwale": "ke/kwale"}
        children = {(2, "ke/mombasa"): {"changamwe": "ke/mombasa/changamwe"}}

    groups, report = census.build_groups(c, Resolver())
    obs = next(g for g in groups if g.name == "observation").rows
    assert report["subcounties_linked"] == 1 and any("Mombasa / Jomvu" == u for u in report["subcounties_unlinked"])
    sub = [o for o in obs if o["geoUnitId"] == ref("geography.units", code="ke/mombasa/changamwe")]
    assert sub and all(o["confidenceLevel"] == "medium" and "matched by name" in o["releaseLabel"] for o in sub)
    national = [o for o in obs if o["geoUnitId"] == ref("geography.units", code="ke")]
    assert national and all(o["confidenceLevel"] == "high" for o in national)
    dims = next(g for g in groups if g.name == "observation_dimension").rows
    assert {d["observationId"] for d in dims} <= {o["id"] for o in obs}
