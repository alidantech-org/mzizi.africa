

def test_a_captcha_word_on_a_real_page_is_not_a_block():
    from mzizi_fetch.web.blocks import BlockKind, detect_block

    real = b"<html><body>" + b"<a href='/x'>x</a>" * 30 + b"<div class='g-recaptcha'></div></body></html>"
    assert detect_block(200, {}, real) is None
    bare = b"<html><body><div class='g-recaptcha'></div><p>verify</p></body></html>"
    assert detect_block(200, {}, bare).kind is BlockKind.CAPTCHA
    assert detect_block(403, {}, real).kind is BlockKind.CAPTCHA


def test_missing_pages_never_escalate_to_a_stop():
    from mzizi_fetch.web.blocks import BlockKind, BlockPolicy, Response, _b

    policy = BlockPolicy(stop_after=3)
    for _ in range(10):
        decision = policy.decide("https://x/y", _b(BlockKind.NOT_FOUND, "HTTP 404", 404), 0)
    assert decision.response != Response.STOP.value and policy.consecutive == 0
    for _ in range(3):
        decision = policy.decide("https://x/z", _b(BlockKind.FORBIDDEN, "HTTP 403", 403), 0)
    assert decision.response == Response.STOP.value
