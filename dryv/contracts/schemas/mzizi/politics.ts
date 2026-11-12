/**
 * Schema: politics | Database: mzizi
 * Approved contract: parties, historical affiliations, elections, contests, outcomes and manifestos.
 * Results and electorates are geographically scoped; referendum choices have their own row types.
 * SQL generation remains gated on faithful CHECK and code-shape enforcement in the Rust pack.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { geographySchemas } from "./geography.ts";
import { governanceSchemas } from "./governance.ts";
import { officialSchemas } from "./official.ts";
import { referenceSchemas } from "./reference.ts";
import { sourceSchemas } from "./source.ts";

export const politics = dryv
  .group({ name: "politics" })
  .description("Parties, elections, candidates, results and attributed political commitments.")
  .facets({ storage: { namespace: "politics" } });
const politicsExpressions = politics.expressions({
  ValidityWindowIsOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "valid_from"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "valid_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "valid_from"), dryv.expression.context("value", "valid_until")),
  ),
});
// biome-ignore lint/suspicious/noExplicitAny: permits forward role references.
export const politicsSchemas: Record<string, any> = {};
const id = () => dryv.field(sharedProperties.Id);
const ref = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const optRef = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().optional().nullable().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const tableName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const grains: Record<string, string> = {
  Parties: "One political-party specialization of an Official entity over an optional effective period.",
  Memberships: "One individual's dated membership in one political party.",
  Coalitions: "One political coalition identity over an optional effective period.",
  Alignments: "One party's dated alignment with one coalition.",
  Elections: "One electoral event in a country, with its event date and source citation.",
  Contests: "One office or electoral question contested in an election and one geographic unit.",
  Candidates: "One person's candidature in one contest, retaining party affiliation at election time.",
  Electorates: "One set of electorate and ballot totals reported for one contest and geographic unit.",
  Results: "One candidate's published vote result for one geographic unit.",
  Manifestos: "One published party or candidate manifesto associated with its election and source document.",
  ManifestoItems: "One policy commitment or promise within a manifesto, optionally linked to a Reference topic.",
  ReferendumOptions: "One ballot option for one referendum contest; options are not modeled as candidates.",
  OptionResults: "One reported vote result for one referendum option and geographic unit.",
};
const table = (name: string, fields: Record<string, any>, indexes: any[] = []) => {
  let definition: any = dryv
    .schema({
      id: id(),
      ...fields,
      source_citation_id: fields.source_citation_id ?? optRef(() => sourceSchemas.Citations.field("id")),
    })
    .description(grains[name]!)
    .role("entity");
  if ("valid_from" in fields && "valid_until" in fields) {
    definition = definition.invariant("ValidityWindowIsOrdered", politicsExpressions.ValidityWindowIsOrdered);
  }
  const x = politics.schemas({
    [name]: definition.facets({
      storage: dryv
        .storage(tableName(name))
        .primaryKey("id")
        .indexes(...indexes, { name: `idx_${tableName(name)}_citation`, fields: ["source_citation_id"] }),
    }),
  });
  politicsSchemas[name] = x[name];
};
const window = {
  valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
  valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
};

/*---------------- politics.parties ----------------*/
table(
  "Parties",
  {
    entity_id: ref(() => officialSchemas.Entities.field("id")),
    party_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    ...window,
  },
  [
    { name: "uq_parties_code", fields: ["code"], unique: true },
    { name: "idx_parties_entity", fields: ["entity_id"] },
  ],
);
/*---------------- End politics.parties ----------------*/
/*---------------- politics.memberships ----------------*/
table(
  "Memberships",
  {
    party_id: ref(() => politicsSchemas.Parties.field("id")),
    individual_id: ref(() => officialSchemas.Individuals.field("id")),
    membership_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...window,
  },
  [
    { name: "idx_memberships_party", fields: ["party_id", "valid_from"] },
    { name: "idx_memberships_person", fields: ["individual_id", "valid_from"] },
  ],
);
/*---------------- End politics.memberships ----------------*/
/*---------------- politics.coalitions ----------------*/
table(
  "Coalitions",
  {
    name: dryv.field(sharedProperties.Name),
    code: dryv.field(sharedProperties.IdentityCode),
    coalition_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...window,
  },
  [{ name: "uq_coalitions_code", fields: ["code"], unique: true }],
);
/*---------------- End politics.coalitions ----------------*/
/*---------------- politics.alignments ----------------*/
table(
  "Alignments",
  {
    coalition_id: ref(() => politicsSchemas.Coalitions.field("id")),
    party_id: ref(() => politicsSchemas.Parties.field("id")),
    alignment_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...window,
  },
  [
    { name: "idx_alignments_coalition", fields: ["coalition_id", "valid_from"] },
    { name: "idx_alignments_party", fields: ["party_id", "valid_from"] },
  ],
);
/*---------------- End politics.alignments ----------------*/
/*---------------- politics.elections ----------------*/
table(
  "Elections",
  {
    code: dryv.field(sharedProperties.IdentityCode),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    election_kind_id: ref(() => referenceSchemas.Value.field("id")),
    held_on: dryv.field(sharedProperties.CalendarDate),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_elections_code", fields: ["code"], unique: true },
    { name: "idx_elections_date", fields: ["held_on"] },
  ],
);
/*---------------- End politics.elections ----------------*/
/*---------------- politics.contests ----------------*/
table(
  "Contests",
  {
    election_id: ref(() => politicsSchemas.Elections.field("id")),
    office_id: optRef(() => governanceSchemas.Offices.field("id")),
    unit_feature_id: ref(() => geographySchemas.Units.field("feature_id")),
    contest_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
  },
  [
    { name: "uq_contests_code", fields: ["code"], unique: true },
    { name: "idx_contests_unit", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End politics.contests ----------------*/
/*---------------- politics.candidates ----------------*/
table(
  "Candidates",
  {
    contest_id: ref(() => politicsSchemas.Contests.field("id")),
    individual_id: ref(() => officialSchemas.Individuals.field("id")),
    party_id_at_election: optRef(() => politicsSchemas.Parties.field("id")),
    candidate_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ballot_order: dryv.field(sharedProperties.PositiveInteger).optional().nullable(),
  },
  [
    { name: "idx_candidates_contest", fields: ["contest_id", "ballot_order"] },
    { name: "idx_candidates_individual", fields: ["individual_id"] },
  ],
);
/*---------------- End politics.candidates ----------------*/
/*---------------- politics.electorates ----------------*/
table(
  "Electorates",
  {
    contest_id: ref(() => politicsSchemas.Contests.field("id")),
    unit_feature_id: ref(() => geographySchemas.Units.field("feature_id")),
    registered_voters: dryv.field(sharedProperties.NonNegativeInt64).optional().nullable(),
    ballots_cast: dryv.field(sharedProperties.NonNegativeInt64).optional().nullable(),
    valid_ballots: dryv.field(sharedProperties.NonNegativeInt64).optional().nullable(),
    rejected_ballots: dryv.field(sharedProperties.NonNegativeInt64).optional().nullable(),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_electorates_contest_unit", fields: ["contest_id", "unit_feature_id"], unique: true },
    { name: "idx_electorates_unit", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End politics.electorates ----------------*/
/*---------------- politics.results ----------------*/
table(
  "Results",
  {
    candidate_id: ref(() => politicsSchemas.Candidates.field("id")),
    unit_feature_id: ref(() => geographySchemas.Units.field("feature_id")),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    status_id: ref(() => referenceSchemas.Value.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_results_candidate_unit", fields: ["candidate_id", "unit_feature_id"], unique: true },
    { name: "idx_results_unit", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End politics.results ----------------*/
/*---------------- politics.manifestos ----------------*/
table(
  "Manifestos",
  {
    party_id: optRef(() => politicsSchemas.Parties.field("id")),
    candidate_id: optRef(() => politicsSchemas.Candidates.field("id")),
    election_id: optRef(() => politicsSchemas.Elections.field("id")),
    document_id: optRef(() => sourceSchemas.Documents.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
    published_on: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
  },
  [
    { name: "idx_manifestos_party", fields: ["party_id"] },
    { name: "idx_manifestos_candidate", fields: ["candidate_id"] },
  ],
);
/*---------------- End politics.manifestos ----------------*/
/*---------------- politics.manifesto_items ----------------*/
table(
  "ManifestoItems",
  {
    manifesto_id: ref(() => politicsSchemas.Manifestos.field("id")),
    topic_id: optRef(() => referenceSchemas.Topic.field("id")),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    position: dryv.field(sharedProperties.PositiveInteger).optional().nullable(),
  },
  [
    { name: "idx_manifesto_items_manifesto", fields: ["manifesto_id", "position"] },
    { name: "idx_manifesto_items_topic", fields: ["topic_id"] },
  ],
);
/*---------------- End politics.manifesto_items ----------------*/
/*---------------- politics.referendum_options ----------------*/
table(
  "ReferendumOptions",
  {
    contest_id: ref(() => politicsSchemas.Contests.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    label: dryv.field(sharedProperties.Name),
    ballot_order: dryv.field(sharedProperties.PositiveInteger).optional().nullable(),
  },
  [
    { name: "uq_referendum_options_code", fields: ["code"], unique: true },
    { name: "idx_referendum_options_contest", fields: ["contest_id", "ballot_order"] },
  ],
);
/*---------------- End politics.referendum_options ----------------*/
/*---------------- politics.option_results ----------------*/
table(
  "OptionResults",
  {
    option_id: ref(() => politicsSchemas.ReferendumOptions.field("id")),
    unit_feature_id: ref(() => geographySchemas.Units.field("feature_id")),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    status_id: ref(() => referenceSchemas.Value.field("id")),
    source_citation_id: optRef(() => sourceSchemas.Citations.field("id")),
  },
  [
    { name: "uq_option_results_option_unit", fields: ["option_id", "unit_feature_id"], unique: true },
    { name: "idx_option_results_unit", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End politics.option_results ----------------*/
