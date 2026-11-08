import json
from datetime import datetime
from pathlib import Path

import pytest

from mzizi_data.gate import evaluate
from mzizi_data.seedroot import FIXTURES_ROOT

VECTORS = json.loads((FIXTURES_ROOT / "contracts" / "gate-vectors.json").read_text())


@pytest.mark.parametrize("vector", VECTORS["vectors"], ids=[v["name"] for v in VECTORS["vectors"]])
def test_vector(vector):
    base = VECTORS["base"]
    assessment = None if vector.get("assessment", "x") is None else {**base["assessment"], **(vector.get("assessment") or {})}
    stage = vector["dossierStage"] if "dossierStage" in vector else base["dossierStage"]
    decision = evaluate(assessment, stage, {**base["request"], **vector.get("request", {})}, now=datetime.fromisoformat(VECTORS["now"].replace("Z", "+00:00")))
    expect = vector["expect"]
    assert decision.allowed == expect["allowed"], decision.reasons
    if "reason" in expect:
        assert expect["reason"] in " | ".join(decision.reasons)
    if "requestsPerSecond" in expect:
        assert decision.requests_per_second == expect["requestsPerSecond"]
