import json
from datetime import datetime

import pytest

from mzizi_engine.runtime.policy import decide
from mzizi_manifest.shared.paths import SEED_ROOT

FIXTURE = SEED_ROOT / "_fixtures" / "contracts" / "gate-vectors.json"
VECTORS = json.loads(FIXTURE.read_text()) if FIXTURE.exists() else {"vectors": [], "base": {}}


@pytest.mark.skipif(not FIXTURE.exists(), reason="the seed fixtures were emptied for the rebuild")
@pytest.mark.parametrize(
    "vector", VECTORS["vectors"] or [{}], ids=[v["name"] for v in VECTORS["vectors"]] or ["no-fixture"]
)
def test_vector(vector):
    base = VECTORS["base"]
    assessment = (
        None if vector.get("assessment", "x") is None else {**base["assessment"], **(vector.get("assessment") or {})}
    )
    stage = vector["dossierStage"] if "dossierStage" in vector else base["dossierStage"]
    decision = decide(
        assessment,
        stage,
        {**base["request"], **vector.get("request", {})},
        now=datetime.fromisoformat(VECTORS["now"].replace("Z", "+00:00")),
    )
    expect = vector["expect"]
    assert decision.allowed == expect["allowed"], decision.reasons
    if "reason" in expect:
        assert expect["reason"] in " | ".join(decision.reasons)
    if "requestsPerSecond" in expect:
        assert decision.requests_per_second == expect["requestsPerSecond"]
