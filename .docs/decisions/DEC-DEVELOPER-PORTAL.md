---
id: DEC-DEVELOPER-PORTAL
name: Developer portal and agent parity over HTTP
type: decision
tags: [portal, engine, agent, seeds]
extra: {status: accepted, implementation: planned}
---

# Developer portal and agent parity over HTTP

The developer web app will let humans perform the same research and data-preparation actions available to an authorized agent. The portal, CLI and agent share typed engine operations over HTTP, including replay. The earlier CLI-only replay proposal is superseded. Use authorized artifact and workspace references for remote inputs.

The first pilot uses the saved IEBC constituency-office PDF, a developer in the portal and an HTTP API client. The shared workspace supports Python and Bash for data preparation, with read-only source inputs and writable drafts. Developers can inspect and continue a run. A live LLM agent follows after the shared workflow is proven. Conventional processing and validation form the baseline, with optional model assistance for unresolved cases.

The pilot preserves source-linked physical office details even where the existing contracts cannot represent them. It exports a draft and validation evidence for owner review. Any seed registration or database apply follows the separate existing authorization process.

See the [developer portal design](../design/architecture/DEVELOPER_PORTAL.md) for current capabilities, examples, and the decisions needed before implementation tasks are drafted.
