

def test_a_captcha_word_on_a_real_page_is_not_a_block():
    from mzizi_fetch.web.blocks import BlockKind, detect_block

    real = b"<html><body>" + b"<a href='/x'>x</a>" * 30 + b"<div class='g-recaptcha'></div></body></html>"
    assert detect_block(200, {}, real) is None
    bare = b"<html><body><div class='g-recaptcha'></div><p>verify</p></body></html>"
    assert detect_block(200, {}, bare).kind is BlockKind.CAPTCHA
    assert detect_block(403, {}, real).kind is BlockKind.CAPTCHA
