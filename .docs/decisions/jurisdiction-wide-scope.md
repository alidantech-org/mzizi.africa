---
{id: DEC-JURISDICTION-WIDE-SCOPE,name: "Decision - jurisdiction-wide scope is the root geography unit, never null",type: decision,tags: [geography,governance,scope,seeds]}
---

# Decision: jurisdiction-wide scope

Date: 3 November 2026. Set by the product owner.

**Bug.** Records that apply to a whole jurisdiction (the IEBC, a national ministry, the Senate, a national finance unit) were stored with no geography unit, as if "nationwide" meant "no place". That makes them invisible to geography queries and breaks the rule that everything is geographically identifiable.

**Rule.** A jurisdiction has a root geography unit (the country unit, for example `ke`). A record scoped to the whole jurisdiction points at that unit. A geography link may be empty only when the record is genuinely outside every modelled jurisdiction (a supranational or international body such as the UN or an organisation spanning several countries) or when its scope has not been researched; the second case is a known gap reported by the reinforcement framework, not a normal state.

**Consequences.**
- Existing rows scoped nationally are backfilled to the root unit: 101 of 195 governance institutions, 202 of 2,172 finance units and the one statistical dataset had a null link on 3 November 2026.
- Seeds and patterns express scope explicitly (`national`, a level, or a unit code) and the loader resolves `national` to the root unit of the record's jurisdiction. A missing scope in a seed is an error, not a default.
- New scope columns (`scope_geo_unit_id` on offices and institutions, place expectations) follow the same rule.
- Integrity rule: every scoped record whose jurisdiction has a root unit must have a scope; a null scope with a jurisdiction is reported.
- A scope that is the root unit is a jurisdiction scope, never a physical location. Physical placement stays in the place model.
