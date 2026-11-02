from mzizi_data.dedup import Record, clusters, find_matches, score_pair, token_similarity, tokens


def person(i, name, **kw):
    return Record(i, name, **{k: set(v) for k, v in kw.items()})


def test_token_order_and_honorifics_do_not_hide_the_same_name():
    assert token_similarity(tokens("Benjamin Gathiru Mejjadonk"), tokens("Mejjadonk Benjamin Gathiru")) > 0.99
    assert token_similarity(tokens("Hon. Dr. Amollo Paul Otiende"), tokens("Amollo Paul Otiende")) > 0.9


def test_two_people_with_one_name_are_flagged_never_merged():
    a = person("1", "John Kamau Mwangi", places=["ke/nairobi/westlands"], parties=["uda"])
    b = person("2", "John Kamau Mwangi", places=["ke/kiambu/thika-town"], parties=["uda"])
    m = score_pair(a, b, "person")
    assert m and m.decision == "flagged" and m.features["placeConflict"]


def test_same_name_with_a_shared_office_is_merged():
    a = person("1", "Amollo Paul Otiende", offices=["office-rarieda"])
    b = person("2", "Paul Otiende Amollo", offices=["office-rarieda"])
    m = score_pair(a, b, "person")
    assert m and m.decision == "auto_merged"


def test_name_alone_is_not_enough():
    m = score_pair(person("1", "Mary Wanjiku Njoroge"), person("2", "Mary Wanjiku Njoroge"), "person")
    assert m and m.decision == "flagged"


def test_organisations_with_a_shared_registration_number_merge_even_when_the_names_differ_a_little():
    a = person("a", "KIOLI INVESTMENTS LIMITED", identifiers=["BNOVSP5RPP"])
    b = person("b", "Kioli Investments Ltd", identifiers=["BNOVSP5RPP"])
    m = score_pair(a, b, "organization")
    assert m and m.decision == "auto_merged" and m.score == 1.0


def test_different_companies_stay_apart_and_clusters_follow_merged_pairs():
    recs = [person("a", "Nextwave Investments Limited"), person("b", "Huhaha Investments Limited"), person("c", "Nextwave Ltd", places=["x"]), person("d", "Nextwave Investments Ltd", places=["x"])]
    matches = find_matches(recs, "organization")
    assert not any({m.left, m.right} == {"a", "b"} for m in matches)
    assert clusters(["a", "b", "c", "d"], [("a", "d"), ("d", "c")]) == {"a": ["a", "c", "d"]}
