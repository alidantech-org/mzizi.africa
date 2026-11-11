---
id: HANDOFF-MZIZI-TASK03-20261111
name: Task 03 connected foundation local-agent handoff
type: documentation
tags: [handoff, task03, reference, geography, legal, patterns]
extra: {prepared_on: 2026-11-11, task_id: TSK-7E5E18758D9C}
---

# Local-agent handoff — task 03

## Mission and first actions

Work in `alidantech-org/mzizi.africa`, directly on `develop`. Complete the detailed design for task `TSK-7E5E18758D9C`, using the architectural direction accepted by the user and recorded in [the connected foundation](../improvements/connected-reference-geography-legal-foundation.md). Read that document in full before proposing tables. This is the central account of the November discussion and research; do not restart the jurisdiction/country debate from superseded notes.

Read current `AGENTS.md`, `.docs/rules/branching-and-task-usage.md`, `.docs/rules/task-writing.md`, `.docs/rules/code-columns.md` and the purpose/architecture/lifecycle/domain documents it names. Inspect `git status` and remote `develop`; preserve unrelated local work. Never create a branch/worktree, edit `.github/**`, change storage infrastructure or run archived code.

Run:

```bash
git branch --show-current
git status --short
task list --json
task show TSK-7E5E18758D9C --json
task show TSK-3EA8C40B0F60 --json
task start TSK-7E5E18758D9C
```

The preparation was based on remote `fc40f28dd03e01b52d5f8995dbc308f6fd7c81b9`; recheck subsequent commits. Task 02 has final implementation/publication notes but its task status still says in-progress. Verify the foundation interfaces rather than assuming metadata completion or repeating uploads. Report any real blocker in task 03.

## What is settled

- Country is the modern-governance organizing context; geography connects knowledge across modern countries and history. Africa has a continent unit. Global concepts have explicit global applicability, not a fictional `world` jurisdiction.
- Country identity, authority, legal territorial reach, service reach, headquarters, electoral coverage and statistical coverage are distinct. A county can exercise legal powers within the country's context.
- Reference defines meanings; actual entities and behavior live in domain schemas. Direct FK relationships link domain records to geography and legal provisions. Reference is not an obligatory intermediate join for everything.
- Schemes and values require descriptions and enforced scheme membership. Broad governor classification differs from a country-specific office definition, an actual office, and a person's term in that office.
- Geography supports parallel dated administrative/electoral/statistical relationships, sourced boundary versions, uncertain historical reconstructions and explicitly hypothetical areas. Code hierarchy is identity organization, not geographic containment authority.
- Legal identity, legal text versions, exact provisions, digital file versions and effective dates are different. Multiple typed legal bases explain establishment, powers and selection. Evidence of a law is not proof of occupancy, compliance or a present holder.
- EAC/COMESA are organizations with members, organs, mandates and legal bases. A membership-derived map is a separate dated representation, not a sovereign country or universal legal scope. Representation of Africa requires a sourced mandate.
- Reference owns pattern definitions/versions; filesystem owns their exact artifacts; engine owns runs/retries/scheduling; domains own outputs. Existence established by reviewed rules permits real rows with gaps; uncertain existence remains a discovery manifest/job.
- UI begins with place/date/topic and registered capabilities. Each capability declares its geographic/temporal interpretation and result contract. GPS does not establish residence or voting status. National fallback and unavailable data remain explicit.
- Statistics keep shared measurements/releases/units/provenance but require typed domain meaning: population definition, method, time, boundary coverage, release/revision and uncertainty. No inherited local numbers or incompatible rollups.

## Current implementation interfaces to preserve

Inspect actual code before selecting filenames/functions. Active layout is `source/packages/`, the Python engine at `source/backend/engine/`, NestJS at `source/backend/api/`, schemas/SQL under `source/schema/`, Dryv authoring under `dryv/`, and root `seed/` inputs. Old engine/database/api implementations are archived design evidence.

Auth has implemented scoped permissions and role assignment. Reuse it; territorial proximity is not authorization. Filesystem's latest recorded model has seven tables including `file_versions` and `file_relations`, plus a paths view. Do not resurrect the older eight-table extraction design or file-type/extension/object tables. Preserve immutable pinned evidence and physical content shared by retained versions.

Task 02 reports live S3 checks and publication as complete. Treat those as delivery-note claims until checking the current code/state. Do not republish old artifacts or restore/delete historical `.data/raw` as task-03 work. Bucket `mzizi` and existing S3 artifacts are protected. Use the current documented filesystem command and API rather than inventing another registry.

## Deliver in dependency order

1. **Current-state inventory:** reference/geography contracts, active SQL/models, consumers, root seed catalogs, auth/filesystem interfaces, and a list separating verified findings from archived/planning claims.
2. **Reference specification:** countries and territorial links; schemes/values/relations/applicability; topics; stable dot-separated `code`; wrong-scheme rejection; localized labels; country-specific meanings without duplicated global catalogs.
3. **Geography specification:** units/types, dated relationship systems, names/changes, geometry/evidence/uncertainty, country roots and cross-border/history cases; contact/place/presence ownership and derived ancestry policy.
4. **Legal/domain connection contracts:** minimal instrument/provision/version references and typed multi-basis links; governance office/rule/holder and electoral/political integration; FK creation order and minimal legal foundation versus task-04 ownership. No fake FK to a nonexistent future table.
5. **Pattern specification:** identity/version, exact `file_version_id`, validated capability bindings, prerequisites, definition versus run dependency, preview/diff/apply, stable outputs, conflict handling and typed lineage. First actual consumer is filesystem folders; governance generation remains a contract case until task 04 settles destinations.
6. **Product/query specification:** capability registry ownership and contracts, topic availability, GPS context resolution, population/representatives/budget query traces, legal explanations and no-data/fallback states.
7. **Implementation proposal:** exact SQL table/column design, initialization sequence, required Dryv/API/package/seed changes and focused validation plan. Return concrete significant changes for review under the repository/user rules. Do not treat this handoff as permission to implement all downstream schemas.

Keep substantive details in the existing schema documents and connected foundation; record decisions in `.docs/decisions/`. Update the same task through Task CLI, not a new parallel TODO. Each table needs types/nullability/defaults/keys/checks/indexes/deletion behavior/comments, acquisition-class eligibility and justified temporal fields. No legacy database compatibility is required in `mzizi_new`; verify the database identity before any later authorized destructive operation.

## Acceptance examples and expected behavior

| Example | What the design must demonstrate |
|---|---|
| Governor of a Kenyan county | Category → specific office definition → actual office → county mandate; Articles 176/179/180 support distinct legal roles; holder remains separately evidenced |
| Election to officeholding | Contest targets office and electoral area; candidacy links person/party; result, declaration and commencement of term remain distinct |
| EAC organ and map | Treaty provision establishes organ; dated membership produces reproducible member-territory coverage; no inferred uniform treaty applicability |
| Historical area | Place/area persists independently of modern country; boundary period/method/uncertainty and competing claims remain visible |
| Vocabulary integrity | Existing UUID from an unrelated scheme is rejected by the database contract |
| Geographic traversal | As-of date and relationship system matter; overlapping/disputed candidates remain qualified; no universal parent chain |
| Folder generation | Preview, first apply, repeat unchanged, conflict and restricted-access cases; real output lineage and no implicit deletion |
| Analytics | Census, revised estimate, language-use survey and historical estimate remain distinguishable; unsupported trend/breakdown controls are absent |

Use labeled fixtures for domains not yet built. Do not manufacture production institutions, officeholders, laws or population numbers to make an example pass.

## Finish and report

Run `task validate`, relevant schema/contract checks, and `uv run mzizi-manifest check` if real seed inputs changed. Tick acceptance only for completed work. Keep task 04 dependent on task 03 and transfer the explicit downstream legal/governance/electoral/political/statistical backlog. Report exact files changed, design choices, verification performed, deferred decisions and any requested implementation approval. Keep significant implementation separate from design readiness; commit reviewed documentation to `develop` and report the commit without bundling unrelated work.
