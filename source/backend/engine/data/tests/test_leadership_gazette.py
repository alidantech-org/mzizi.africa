"""Leadership page and Gazette appointment extractors."""
import json

from mzizi_data.extractors import gazette_appointments as g
from mzizi_data.extractors import leadership_pages as L

PAGE = b"""<html><body><nav>Home</nav><div><h4>HON. SEN. MUTAHI KAGWE</h4><p>Cabinet Secretary- Ministry of Agriculture</p>
<h4>DR. KIPRONOH RONOH PAUL, CBS</h4><p>Principal Secretary - State Department for Agriculture</p>
<p>Charles Dulo - Chairperson</p><p>Toll Free</p><p>Commissioner</p></div></body></html>"""


def test_leadership_pairs_in_both_layouts_and_noise_skipped():
    out = L.run(PAGE, "ke/ministry/agriculture")
    got = {(json.loads(s["content"])["displayName"], json.loads(s["content"])["title"][:16]) for s in out.segments}
    assert ("Mutahi Kagwe", "Cabinet Secretar") in got
    assert ("Kipronoh Ronoh Paul", "Principal Secret") in got
    assert any(n == "Charles Dulo" for n, _ in got)
    assert not any("Toll" in n for n, _ in got)


def test_name_of_rejects_organisations_and_numbers():
    assert L.name_of("Ministry of Health") is None
    assert L.name_of("Ms. Mercy Wanjau") == "Mercy Wanjau"
    assert L.name_of("P.O. Box 30028") is None


def test_gazette_dates_names_and_digit_repair():
    assert g.iso("l9", "March", "2O24") == "2024-03-19"
    assert g.iso("22", "Septcmber", "2024") == "2024-09-22"
    assert g.plausible("Rosemary Wacera Kuria")
    assert not g.plausible("MoHnurueo Asor MoHnurueo")
    assert not g.plausible("Defence Forces")
    assert g.proper("TIMOTHY OLWENY") == "Timothy Olweny"


def test_gazette_split_names_reads_chair_suffix():
    pairs = g.split_names("Under paragraph (a)- Rosemary Wacera Kuria - Chairperson Under paragraph (b)- Ruth Okowa, Samson Kitonyi")
    assert ("Rosemary Wacera Kuria", "Chairperson") in pairs
    assert ("Ruth Okowa", None) in pairs
