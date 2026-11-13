---
{id: RULE-TYPED-CODE,name: Typed and data-driven code,type: rule,tags: [python,rust,typescript,agent-guidance]}
---

# Typed, data-driven code

These rules apply to **all hand-written code in this repository, in every language**: Python, Rust and TypeScript, including scripts, tests and tools. They follow the Dryv typed-contract rule (`dryv/.tasks/docs/agents/typed-contracts.md`) and extend `coding.md`. If a rule here conflicts with older code, the code is the defect. Generated Dryv output is exempt only because it is not hand-edited.

## 1. Known structures have named, typed contracts

- Every request, response, event, configuration envelope, record and protocol message is a named type: a frozen pydantic model in Python (`ConfigDict(frozen=True, strict=True, extra="forbid")`), a struct or enum with `serde` in Rust, an interface or zod-validated type in TypeScript.
- Forbidden past the parsing boundary: `dict`, `dict[str, Any]`, `dict[str, object]`, `Mapping[str, object]`, `Any`, `object` as a contract; `serde_json::Value`; `any`, `unknown` and `Record<string, unknown>`. A dictionary whose keys are genuinely dynamic is allowed only with real key and value types (for example `dict[str, str]` for header-to-cell).
- Use enums or literal types instead of status strings, and discriminated unions instead of "kind" strings with optional fields.
- Contract types hold data and invariants only. They do not parse untrusted input, perform I/O or turn themselves into free dictionaries.

## 2. One parsing boundary

- Untyped data may exist only where it is unavoidable: `json.loads`, `yaml.safe_load`, `response.json()`, `serde_json::from_str`, `JSON.parse`, database rows and environment variables.
- A parser at that edge validates immediately and returns a typed contract. Application code never sees the raw value.
- Outbound is the mirror: typed contract, then an encoder, then text. Encoders may build transient raw objects internally, and these must not leave the encoder.
- Keep parsers and encoders in dedicated modules (`parse/`, `encode/`) so reviewers can see where untyped data lives. When a new boundary appears, define the real type first, then the parser.

## 3. Nothing is hard-coded: data lives in manifests

- Source-, publisher-, jurisdiction-, language-, domain- and classification-specific knowledge is **data**, not code: selectors, URL patterns, field maps, name aliases, category lists, challenge markers, stop-words, personal-data categories, thresholds and similar tables live in manifests, seed inputs or database records, validated against schemas under `source/schema/`.
- Code contains **mechanisms** only: it loads a typed rule set and applies it. A new site, country, language or category must be addable without changing Python, Rust or TypeScript.
- Constants that are true of the language or protocol (HTTP verbs, ISO formats, unit conversions) may stay in code, but they live in one named module. Safety ceilings (global rate limits and size caps) are policy: they live in a versioned policy manifest and are enforced by code.
- Do not scatter literals. A string or number that changes behavior is a named, documented value in exactly one place.

## 4. Pattern matching is centralised

- Regular expressions, glob/URL patterns, string normalisation and similarity helpers exist only in the pattern-matching packages (see `.docs/design/architecture/PATTERN_MATCHING.md`, a proposal). No other module compiles a regex or hand-rolls string matching.
- Callers ask a named question (`matcher.matches(rule, text)`, `normalise_name(text)`), supplied with a rule from a manifest, and receive a typed result with the matched span, rule id and confidence.
- Matchers must be safe on untrusted input: linear-time engines (no catastrophic backtracking), length and time bounds, and no evaluation of manifest text as code.
- Model-assisted or vector matches are proposals with a score and rule provenance, never silent decisions.

## 5. Tooling and size

- Python: `mypy --strict` with the pydantic plugin plus `disallow_any_explicit` and `disallow_any_generics`; ruff with annotation rules (including `ANN401`). Rust: `clippy -D warnings`, no `unwrap`/`expect` outside tests, no `serde_json::Value` in contracts. TypeScript: strict `tsc` with `noImplicitAny`, no `any`, Biome.
- `bun run check` must pass, including `bun run structure` (hard file-size limits; split by responsibility, never raise the limit). Package roots hold only `__init__`/`mod`/`index` files; code sits in folders by responsibility.
- Packages are pure libraries: no database or network knowledge, with side effects behind injected ports (see `.docs/design/architecture/ENGINE_JOB_MODEL.md`).
- Review checklist: any `dict`, `Any`, `any`, `Value`, inline regex or inline category list in a diff is a defect unless it sits in a parser, encoder or pattern module.
