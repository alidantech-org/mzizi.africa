# Synthetic web proof fixtures

`fixtures.sql` extends an explicitly selected development database after the approved country/language inputs and current schema have been loaded. It is not a production seed and does not add files under root `seed/`.

Run from the repository root with the normal PostgreSQL client against the chosen local development database. The script uses deterministic identities, preserves existing fixtures on repeat runs, and wraps all changes in one transaction. Its helper functions live in the development-only `web_fixture` schema.

The demonstration council has direct/indirect election, nomination, appointment and ex officio positions, two numbered seats per position, distinct approval/appointment powers, and a public-function assignment. South Africa has an independent demonstration council with an indirectly selected premier. Routing-root pointers make country-level exploration explicit. All new bodies and position titles are labelled as demonstrations; these are not constitutional facts or verified officials. No engine operation, domain probe or promise matching is involved.

Current coverage does not yet include the planned supplier, promise, conflict, completeness, vacancy and evidence-grade fixture scenarios. Do not report the full integrated fixture plan as complete.

The separate transactional `scripts/dev/model_proof/50_integrity.sql` verifies the generated integrity constraints against a database loaded from the latest SQL snapshot. Applying fixtures to an older development schema does not prove that schema has the latest constraints.

After loading, run `psql -h127.0.0.1 -U postgres -d <development-database> -f scripts/dev/web_proof/verify.sql`. This read-only transactional proof checks country isolation, five selection methods, ten Kenya seats, separate powers and both routing roots. It does not claim the missing analytical scenarios are covered.
