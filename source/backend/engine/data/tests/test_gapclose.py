from mzizi_data.gapclose import payload_value


def test_payload_value_reads_scalars_only():
    payload = {"registryIdentifier": "0172", "abbreviation": " ", "validFrom": {"$ref": {}}}
    assert payload_value(payload, "registry_identifier") == "0172"
    assert payload_value(payload, "abbreviation") is None
    assert payload_value(payload, "valid_from") is None
    assert payload_value(payload, "wikidata_id") is None
