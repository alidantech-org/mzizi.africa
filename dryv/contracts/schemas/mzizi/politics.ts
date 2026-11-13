/**
 * Schema: politics | Database: mzizi
 * Approved contract: parties, historical affiliations, elections, contests, outcomes and manifestos.
 * Results and electorates are geographically scoped; referendum choices have their own row types.
 * SQL generation remains gated on faithful CHECK and code-shape enforcement in the Rust pack.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "../_base.ts";
import { sharedProperties } from "../_shared.ts";
import { Units } from "./geography.ts";
import { Offices } from "./governance.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Topic, Value } from "./reference.ts";
import { Citations, Documents } from "./source.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const politics = dryv
  .group({ name: "politics" })
  .description("Parties, elections, candidates, results and attributed political commitments.")
  .facets({ storage: { namespace: "politics", store: "main" } });

/*---------------- politics.parties ----------------*/
export const Parties = politics
  .schema("Parties", {
    entityId: belongsTo(() => Entities),
    partyKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedValidityEntity)
  .description("One political-party specialization of an Official entity over an optional effective period.")
  .role("entity")
  .facets({ storage: dryv.storage("parties").index("entityId").index("sourceCitationId") });

/*---------------- politics.memberships ----------------*/
export const Memberships = politics
  .schema("Memberships", {
    partyId: belongsTo(() => Parties),
    individualId: belongsTo(() => Individuals),
    membershipKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .description("One individual's dated membership in one political party.")
  .role("entity")
  .facets({
    storage: dryv.storage("memberships").index("partyId", "validFrom").index("individualId", "validFrom").index("sourceCitationId"),
  });

/*---------------- politics.coalitions ----------------*/
export const Coalitions = politics
  .schema("Coalitions", {
    name: dryv.field(sharedProperties.Name),
    coalitionKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedValidityEntity)
  .description("One political coalition identity over an optional effective period.")
  .role("entity")
  .facets({ storage: dryv.storage("coalitions").index("sourceCitationId") });

/*---------------- politics.alignments ----------------*/
export const Alignments = politics
  .schema("Alignments", {
    coalitionId: belongsTo(() => Coalitions),
    partyId: belongsTo(() => Parties),
    alignmentKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.ValidityEntity)
  .description("One party's dated alignment with one coalition.")
  .role("entity")
  .facets({
    storage: dryv.storage("alignments").index("coalitionId", "validFrom").index("partyId", "validFrom").index("sourceCitationId"),
  });

/*---------------- politics.elections ----------------*/
export const Elections = politics
  .schema("Elections", {
    countryId: belongsTo(() => Country).maybe(),
    electionKindId: belongsTo(() => Value),
    heldOn: dryv.field(sharedProperties.CalendarDate),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One electoral event in a country, with its event date and source citation.")
  .role("entity")
  .facets({ storage: dryv.storage("elections").index("heldOn").index("sourceCitationId") });

/*---------------- politics.contests ----------------*/
export const Contests = politics
  .schema("Contests", {
    electionId: belongsTo(() => Elections),
    officeId: belongsTo(() => Offices).maybe(),
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }),
    contestKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One office or electoral question contested in an election and one geographic unit.")
  .role("entity")
  .facets({ storage: dryv.storage("contests").index("unitFeatureId").index("sourceCitationId") });

/*---------------- politics.candidates ----------------*/
export const Candidates = politics
  .schema("Candidates", {
    contestId: belongsTo(() => Contests),
    individualId: belongsTo(() => Individuals),
    partyIdAtElection: belongsTo(() => Parties).maybe(),
    candidateKindId: belongsTo(() => Value),
    ballotOrder: dryv.field(sharedProperties.PositiveInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One person's candidature in one contest, retaining party affiliation at election time.")
  .role("entity")
  .facets({ storage: dryv.storage("candidates").index("contestId", "ballotOrder").index("individualId").index("sourceCitationId") });

/*---------------- politics.electorates ----------------*/
export const Electorates = politics
  .schema("Electorates", {
    contestId: belongsTo(() => Contests),
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }),
    registeredVoters: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    ballotsCast: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    validBallots: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    rejectedBallots: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One set of electorate and ballot totals reported for one contest and geographic unit.")
  .role("entity")
  .facets({ storage: dryv.storage("electorates").unique("contestId", "unitFeatureId").index("unitFeatureId").index("sourceCitationId") });

/*---------------- politics.results ----------------*/
export const Results = politics
  .schema("Results", {
    candidateId: belongsTo(() => Candidates),
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    statusId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One candidate's published vote result for one geographic unit.")
  .role("entity")
  .facets({ storage: dryv.storage("results").unique("candidateId", "unitFeatureId").index("unitFeatureId").index("sourceCitationId") });

/*---------------- politics.manifestos ----------------*/
export const Manifestos = politics
  .schema("Manifestos", {
    partyId: belongsTo(() => Parties).maybe(),
    candidateId: belongsTo(() => Candidates).maybe(),
    electionId: belongsTo(() => Elections).maybe(),
    documentId: belongsTo(() => Documents).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One published party or candidate manifesto associated with its election and source document.")
  .role("entity")
  .facets({ storage: dryv.storage("manifestos").index("partyId").index("candidateId").index("sourceCitationId") });

/*---------------- politics.manifesto_items ----------------*/
export const ManifestoItems = politics
  .schema("ManifestoItems", {
    manifestoId: belongsTo(() => Manifestos),
    topicId: belongsTo(() => Topic).maybe(),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description),
    position: dryv.field(sharedProperties.PositiveInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One policy commitment or promise within a manifesto, optionally linked to a Reference topic.")
  .role("entity")
  .facets({ storage: dryv.storage("manifesto_items").index("manifestoId", "position").index("topicId").index("sourceCitationId") });

/*---------------- politics.referendum_options ----------------*/
export const ReferendumOptions = politics
  .schema("ReferendumOptions", {
    contestId: belongsTo(() => Contests),
    label: dryv.field(sharedProperties.Name),
    ballotOrder: dryv.field(sharedProperties.PositiveInteger).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One ballot option for one referendum contest; options are not modeled as candidates.")
  .role("entity")
  .facets({ storage: dryv.storage("referendum_options").index("contestId", "ballotOrder").index("sourceCitationId") });

/*---------------- politics.option_results ----------------*/
export const OptionResults = politics
  .schema("OptionResults", {
    optionId: belongsTo(() => ReferendumOptions),
    unitFeatureId: belongsTo(() => Units, { to: "featureId" }),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    statusId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One reported vote result for one referendum option and geographic unit.")
  .role("entity")
  .facets({
    storage: dryv.storage("option_results").unique("optionId", "unitFeatureId").index("unitFeatureId").index("sourceCitationId"),
  });
