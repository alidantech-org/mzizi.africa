# System input artifact schemas

This is the required home for machine-readable schemas and shared validation contracts for Mzizi system input artifacts: root seed manifests and folder descriptors, API structures (api.structure.yaml), website structures, patterns, mappings, and consumed JSON/YAML/CSV shapes.

This README establishes the location; concrete schemas, schema dialect/version catalog, validator implementation and exports are delivered in the source/pipeline tasks. Current schemas elsewhere are adoption inventory, not silently relocated by this documentation change. Canonical database/API modeling contracts remain under dryv/; define generation/export ownership and staleness checks where those models inform input validation.

Use stable versioned schema IDs, local approved reference resolution, structural and semantic checks, and fixtures covering valid and invalid inputs. CSV needs typed columns, keys, null rules and FK/code resolution. Manifest inputs name registered capabilities; no arbitrary eval, SQL, shell or Python execution. Source credentials are external named references, never schema examples or seed values.

See [source design](../../.docs/improvements/schema-redesign/source.md) and [root seed registry](../../seed/README.md). Schema payload implementation remains planned.
