from mzizi_data import census_links
from mzizi_data.imports import census_age, census_breakdowns, poverty


def test_exact_names_with_agreeing_area_score_high_and_a_wrong_area_lowers_the_score():
    good = census_links.score("Kilifi North", "Kilifi North", 784.0, 784.1)
    bad = census_links.score("Kilifi North", "Kilifi North", 264.0, 784.1)
    assert good > 0.99 and bad < good - 0.2


def test_assignment_is_one_to_one_with_a_margin_and_weak_matches_stay_unlinked():
    subs = [{"name": "Banisa", "area": 3944.0, "value": 1}, {"name": "Lafey", "area": 2300.0, "value": 2}, {"name": "Zzz Unknown", "area": 10.0, "value": 3}]
    pool = [{"code": "ke/mandera/banissa", "name": "Banissa", "area": 3950.0}, {"code": "ke/mandera/lafey", "name": "Lafey", "area": 2310.0}]
    got = {a["sub"]["name"]: a for a in census_links.assign(subs, pool)}
    assert got["Banisa"]["code"] == "ke/mandera/banissa" and got["Banisa"]["grade"] == "medium"
    assert got["Lafey"]["code"] == "ke/mandera/lafey"
    assert "Zzz Unknown" not in got


def test_ethnicity_checks_flag_a_total_that_does_not_add():
    e = {"totals": {"KENYANS": 100, "NON KENYANS": 10, "NOT STATED": 5, "TOTAL POPULATION": 115}, "kenyan": [("A", 60), ("B", 30)], "kenyan_so_stated": 10, "non_kenyan": [("X", 8)]}
    ok, bad = census_breakdowns.ethnicity_checks(e)
    assert any("Kenyan communities" in m for m in ok) and any("non-Kenyan nationalities add to 8" in m for m in bad)
    e["kenyan"][0] = ("A", 50)
    assert any("Kenyan communities" in m for m in census_breakdowns.ethnicity_checks(e)[1])


def test_age_rows_read_both_columns_of_a_page():
    page = "Table 2.3: Distribution of Population by Age, Sex*, County\n\nMOMBASA\n   Total      610,257  598,046  1,208,303      0-4   74,725  73,178  147,903\n"
    m = [x.groups() for x in census_age.ROW.finditer(page)]
    assert ("Total", "610,257", "598,046", "1,208,303") in m and ("0-4", "74,725", "73,178", "147,903") in m


def test_poverty_row_pattern():
    m = poverty.ROW.match("Tana River           67.8           1.2           20.5         8.0         357       242")
    assert m and m.group(1) == "Tana River" and m.group(7) == "242"
