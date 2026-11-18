/**
 * Schema: politics | Database: mzizi
 * Approved contract: parties, historical affiliations, elections, contests, outcomes and manifestos.
 * Results and electorates are geographically scoped; referendum choices have their own row types.
 * SQL generation remains gated on faithful CHECK and code-shape enforcement in the Rust pack.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { Features } from "./geography.ts";
import { Holders, Offices } from "./governance.ts";
import { Entities, Individuals } from "./official.ts";
import { Country, Topic, Value } from "./reference.ts";
import { Artifacts, Citations } from "./source.ts";

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
    registeredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    deregisteredOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("PartiesDatesAreOrdered", rule.ordered("registeredOn", "deregisteredOn", { allowEqual: true }))
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
    joinedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    leftOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("MembershipsDatesAreOrdered", rule.ordered("joinedOn", "leftOn", { allowEqual: true }))
  .description("One individual's dated membership in one political party.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("memberships")
      .index("partyId", "fromYear")
      .index("individualId", "fromYear")
      .index("sourceCitationId"),
  });

/*---------------- politics.coalitions ----------------*/
export const Coalitions = politics
  .schema("Coalitions", {
    name: dryv.field(sharedProperties.Name),
    coalitionKindId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    formedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    dissolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("CoalitionsDatesAreOrdered", rule.ordered("formedOn", "dissolvedOn", { allowEqual: true }))
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
  .extends(baseSchemas.CodedPeriodEntity)
  .description("One party's dated alignment with one coalition.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("alignments")
      .index("coalitionId", "fromYear")
      .index("partyId", "fromYear")
      .index("sourceCitationId"),
  });

/*---------------- politics.elections ----------------*/
export const Elections = politics
  .schema("Elections", {
    countryId: belongsTo(() => Country).maybe(),
    /** Scheme pol.election.kind: general, by-election, referendum, runoff, repeat, primary. */
    electionKindId: belongsTo(() => Value).tags("scheme:ref.sch.pol.election.kind"),
    /** Scheme pol.election.status: planned, announced, nominations open, voting, counting, declared, certified, disputed, annulled, repeated, cancelled, postponed. */
    statusId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.pol.election.status"),
    heldOn: dryv.field(sharedProperties.CalendarDate),
    /** The election this one repeats, follows (a runoff) or replaces; absent for an ordinary election. */
    parentElectionId: belongsTo(() => Elections).maybe(),
    /** The term this election fills or begins; a by-election belongs to the term of the seat it fills. */
    termId: belongsTo(() => ElectoralTerms).maybe(),
    /** The body that runs it (an electoral commission). */
    authorityEntityId: belongsTo(() => Entities).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One electoral event in a country with its kind, status, date, running body, term and source citation. Milestones such as registration and nominations are events attached to it.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("elections")
      .index("heldOn")
      .index("electionKindId")
      .index("statusId")
      .index("parentElectionId")
      .index("termId")
      .index("authorityEntityId")
      .index("sourceCitationId"),
  });

/*---------------- politics.contests ----------------*/
export const Contests = politics
  .schema("Contests", {
    electionId: belongsTo(() => Elections),
    officeId: belongsTo(() => Offices).maybe(),
    unitFeatureId: belongsTo(() => Features),
    contestKindId: belongsTo(() => Value),
    /** Scheme pol.vacancy.reason: death, resignation, nullification, recall, removal, disqualification. Set for a by-election. */
    vacancyReasonId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.pol.vacancy.reason"),
    /** The holder whose seat became vacant, for a by-election. */
    previousHolderId: belongsTo(() => Holders).maybe(),
    /** How many seats this contest fills; one unless the contest is multi-member. */
    seatCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
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
  .extends(baseSchemas.CodedEntity)
  .description("One person's candidature in one contest, retaining party affiliation at election time.")
  .role("entity")
  .facets({
    storage: dryv.storage("candidates").index("contestId", "ballotOrder").index("individualId").index("sourceCitationId"),
  });

/*---------------- politics.electorates ----------------*/
export const Electorates = politics
  .schema("Electorates", {
    contestId: belongsTo(() => Contests),
    unitFeatureId: belongsTo(() => Features),
    registeredVoters: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    ballotsCast: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    validBallots: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    rejectedBallots: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    spoiltBallots: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    /** Scheme pol.result.status: provisional, tallied, declared, final. A provisional and a final total can both be held. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.pol.result.status"),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One set of electorate and ballot totals reported for one contest and geographic unit (a polling station, ward, constituency, county or the nation) at one stage of reporting.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("electorates")
      .unique("contestId", "unitFeatureId", "statusId")
      .index("unitFeatureId")
      .index("sourceCitationId"),
  });

/*---------------- politics.results ----------------*/
export const Results = politics
  .schema("Results", {
    candidateId: belongsTo(() => Candidates),
    unitFeatureId: belongsTo(() => Features),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    statusId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One candidate's published vote result for one geographic unit.")
  .role("entity")
  .facets({
    storage: dryv.storage("results").unique("candidateId", "unitFeatureId", "statusId").index("unitFeatureId").index("sourceCitationId"),
  });

/*---------------- politics.manifestos ----------------*/
export const Manifestos = politics
  .schema("Manifestos", {
    partyId: belongsTo(() => Parties).maybe(),
    candidateId: belongsTo(() => Candidates).maybe(),
    electionId: belongsTo(() => Elections).maybe(),
    artifactId: belongsTo(() => Artifacts).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
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
  .extends(baseSchemas.CodedEntity)
  .description("One policy commitment or promise within a manifesto, optionally linked to a Reference topic.")
  .role("entity")
  .facets({
    storage: dryv.storage("manifesto_items").index("manifestoId", "position").index("topicId").index("sourceCitationId"),
  });

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
    unitFeatureId: belongsTo(() => Features),
    votes: dryv.field(sharedProperties.NonNegativeInt64),
    statusId: belongsTo(() => Value),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("One reported vote result for one referendum option and geographic unit.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("option_results")
      .unique("optionId", "unitFeatureId")
      .index("unitFeatureId")
      .index("sourceCitationId"),
  });


/*---------------- politics.electoral_terms ----------------*/
export const ElectoralTerms = politics
  .schema("ElectoralTerms", {
    countryId: belongsTo(() => Country),
    /** Scheme pol.term.kind: presidential, parliamentary, county, ward and other bodies' terms. */
    termKindId: belongsTo(() => Value).tags("scheme:ref.sch.pol.term.kind"),
    /** The place the term is for, when it is not the whole country. */
    unitFeatureId: belongsTo(() => Features).maybe(),
    startsOn: dryv.field(sharedProperties.CalendarDate),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("TermDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description(
    "A fixed period for which offices are filled, so by-elections, mandates and the next general election belong to a term.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("electoral_terms").index("countryId", "startsOn").index("termKindId").index("unitFeatureId").index("sourceCitationId") });

/*---------------- politics.polling_stations ----------------*/
export const PollingStations = politics
  .schema("PollingStations", {
    /** The geographic feature of the station. Where it is hosted (a school, hall or tent) is a dated relationship to the host facility's feature. */
    featureId: belongsTo(() => Features),
    countryId: belongsTo(() => Country),
    /** Scheme pol.station.kind: polling station, registration centre, tallying centre, out-of-country station. */
    stationKindId: belongsTo(() => Value).tags("scheme:ref.sch.pol.station.kind"),
    /** The code the electoral commission gives the station, kept as an identifier too. */
    commissionCode: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    /** The registration centre the station belongs to, when the commission groups stations. */
    registrationCentreId: belongsTo(() => PollingStations).maybe(),
    streamCount: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** Access notes (step-free entry, distance from transport) for voters. */
    accessNote: dryv.field(sharedProperties.Description).maybe(),
    openedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    closedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** The station that continued this one after a merge, split or move. */
    succeededByStationId: belongsTo(() => PollingStations).maybe(),
    sourceCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("StationDatesAreOrdered", rule.ordered("openedOn", "closedOn", { allowEqual: true }))
  .description(
    "One polling place's own identity, separate from the school or hall that hosts it. Registered voters and results per election are electorates and results with the station's feature as the unit.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("polling_stations")
      .unique("featureId")
      .index("countryId")
      .index("stationKindId")
      .index("commissionCode")
      .index("registrationCentreId")
      .index("succeededByStationId")
      .index("sourceCitationId"),
  });
