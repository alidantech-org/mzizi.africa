---
{id: GRP-16C9C6125A82,name: Neutral platform and reference-driven localisation proposal,type: documentation,extra: {created_at: 2026-11-15T08:57:08.623Z}}
---

# Plan

Write a single guide under .docs/_plan/guides that records the layer rule, the derivation chain from seeds to vector index, knowledge base and mappings, the per-mapping review loop, risks and open questions. Link it from the plan index with an accurate one-line purpose. Run task validate and confirm no new findings. Risks: overstating what is implemented, and accidentally implying approval of schemas or infrastructure; the document must say plainly that it is a proposal and must not reintroduce schemas the owner removed. No code, SQL or seed changes are part of this group.

Milestones: first the guide is written and linked, then the task is ticked and completed once validation is clean. Any later decision to implement mappings, source goals or a vector index must be raised separately with the owner and tracked as its own group.
