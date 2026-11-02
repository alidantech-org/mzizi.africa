# Neutral model fixtures

Two structurally different countries expressed as records over the same schema, to prove the model is country-neutral:

| | Kenya (`kenya.json`) | South Africa (`south-africa.json`) |
|---|---|---|
| Place hierarchy | country, county, ward | country, province, municipality |
| Head of state | President, direct election run by the electoral commission | President, chosen by the National Assembly in a nomination then election stage |
| Election system | general election | general election by closed-list proportional representation |
| Fiscal year | 1 July to 30 June, KES | 1 April to 31 March, ZAR |
| Fiscal workflow | requisition, commitment, verification, payment | appropriation, release, expenditure |

Each file is `{ rows: [{ entity, key, values }] }`. A string value `"@key"` refers to the row with that key. The loader fills the evidence fields (source "Test fixture", method curated, state unverified), so these rows are never mistaken for canonical data. The API's `src/neutral/neutral-model.integration.spec.ts` loads both into one schema and asserts the differences are carried by classification records only, with no schema change. Real seeds belong in the database management engine's seed classes, not here.

## Gaps the exercise found

- Jurisdictions and classification records had no read endpoints, so a client could not discover a country's levels or vocabularies. Fixed: `ReferenceRead` (`/v1/reference/jurisdictions`, `/v1/reference/classification-records`).
- References between records are plain ids, not foreign keys, wherever an entity already has a generated relation to the same target (a generator limit, see `dryv/README.md`). Integrity of those links must come from db-engine validation, not the schema alone.
- `ClassificationRecord.code` is unique per jurisdiction and scheme but nothing yet checks that a record's `scheme` is one the contracts expect (for example `geography/level`). A scheme registry is a db-engine concern still to be designed.
- Only structure that differs most between the two countries is exercised (hierarchy, selection of head of state, election system, fiscal calendar and currency). Seats, results, parties, procurement and statistics have no fixtures yet.
