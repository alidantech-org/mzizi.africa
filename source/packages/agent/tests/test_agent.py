import pytest

from mzizi_agent import ModelRequest, Proposal, ProposalStatus, StaticProvider, Tool, ToolRegistry


def test_a_proposal_is_attributable_starts_proposed_and_has_a_stable_fingerprint():
    provider = StaticProvider({"classify": "budget"})
    reply = provider.complete(ModelRequest("classify"))
    a = Proposal(
        "classification", {"label": reply.text}, reply.provider, reply.model, "prompt-v1", ("sha256:abc",), 0.7
    )
    b = Proposal(
        "classification",
        {"label": "budget"},
        "static",
        "static-v1",
        "prompt-v1",
        ("sha256:abc",),
        0.2,
        status=ProposalStatus.ACCEPTED,
    )
    assert (
        a.status is ProposalStatus.PROPOSED and a.fingerprint == b.fingerprint
    )  # status and confidence are not identity
    assert (
        Proposal("classification", {"label": "other"}, "static", "static-v1", "prompt-v1", ("sha256:abc",)).fingerprint
        != a.fingerprint
    )


def test_tools_are_explicit_named_and_unknown_tools_fail_clearly():
    tools = ToolRegistry()
    tools.register(Tool("add", "adds", lambda x, y: x + y))
    assert tools.call("add", x=1, y=2) == 3 and tools.describe() == [{"name": "add", "description": "adds"}]
    with pytest.raises(ValueError):
        tools.register(Tool("add", "dup", lambda: 0))
    with pytest.raises(KeyError, match="available"):
        tools.get("shell")
