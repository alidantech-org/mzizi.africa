from mzizi_scraping import detect_challenge


def test_a_challenge_header_is_detected():
    assert detect_challenge(200, {"CF-Mitigated": "challenge"}, b"") == "challenge header"


def test_a_block_notice_in_the_body_is_detected():
    assert detect_challenge(200, {}, b"<html>Just a moment... checking your browser</html>") is not None


def test_a_normal_page_is_not_a_challenge():
    assert detect_challenge(200, {}, b"<html><h1>Counties</h1></html>") is None
