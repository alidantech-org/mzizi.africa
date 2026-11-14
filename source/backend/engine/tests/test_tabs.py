import threading
import time
from pathlib import Path

import pytest

from mzizi_engine.web.browser.tabs import PopupGate, SiteBusy, TabRegistry


def test_registry_remembers_tabs_and_forgets_closed_ones(tmp_path: Path):
    registry = TabRegistry(tmp_path)
    registry.remember("a.example", "T1")
    registry.remember("b.example", "T2")
    assert registry.tab_for("a.example").target_id == "T1"
    assert registry.forget({"T2"}) == ["a.example"] and registry.tab_for("a.example") is None


def test_a_site_lease_excludes_a_second_user_but_not_other_sites(tmp_path: Path):
    registry = TabRegistry(tmp_path)
    order: list[str] = []

    def other_site():
        with registry.lease("b.example", wait=1):
            order.append("b")

    with registry.lease("a.example", wait=1):
        thread = threading.Thread(target=other_site)
        thread.start()
        thread.join(2)
        assert order == ["b"]  # a different site is not blocked
        with pytest.raises(SiteBusy):
            with registry.lease("a.example", wait=0.3):
                pass
    with registry.lease("a.example", wait=1):  # released: free again
        pass


def test_popup_gate_allows_one_open_popup_and_keeps_the_rest_for_later():
    gate = PopupGate()
    assert gate.opened("https://s/x") is True
    assert gate.opened("https://s/y") is False
    gate.closed()
    assert gate.opened("https://s/z") is True
    assert gate.seen == ["https://s/x", "https://s/y", "https://s/z"] and gate.deferred == ["https://s/y"]
