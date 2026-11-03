import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { recorded, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Elections, political parties and events.
 *
 * Election types, result levels, party unit levels, event types and ideologies are
 * jurisdiction-scoped classification records, not enums. Results carry the declaring authority and
 * a verification state so disputed or superseded counts stay visible. Events are a neutral calendar
 * record; election and legislative meaning lives in the domain records they link to.
 */
export const elections = dryv.group({ name: "elections" }).description("Elections, seats, candidates, results and manifestos.").tags("public", "elections")
  .facets({ storage: { namespace: "electoral" } });
export const political = dryv.group({ name: "political" }).description("Political parties, membership, structure and ideology.").tags("public", "political")
  .facets({ storage: { namespace: "political" } });
export const events = dryv.group({ name: "events" }).description("A neutral calendar of dated events linked to domain records.").tags("public", "events")
  .facets({ storage: { namespace: "calendar" } });

export const electionProperties = elections.properties({
  ElectionStatus: dryv.property.enum({
    planned: "planned",
    scheduled: "scheduled",
    inProgress: "in_progress",
    completed: "completed",
    cancelled: "cancelled",
    postponed: "postponed",
  }),
  NominationStatus: dryv.property.enum({
    nominated: "nominated",
    cleared: "cleared",
    disqualified: "disqualified",
    withdrawn: "withdrawn",
  }),
  ResultStatus: dryv.property.enum({ provisional: "provisional", declared: "declared", revised: "revised", disputed: "disputed", setAside: "set_aside" }),
  AllocationKind: dryv.property.enum({ partyList: "party_list", womenSpecial: "women_special", youthSpecial: "youth_special", disabilitySpecial: "disability_special", workersSpecial: "workers_special", nominated: "nominated", other: "other" }),
  RegisterVersion: dryv.property.string().length({ min: 1, max: 200 }),
  EvidenceForm: dryv.property.string().length({ min: 1, max: 120 }),
  Votes: dryv.property.number.integer({ range: { min: 0 } }),
  Rank: dryv.property.number.integer({ range: { min: 1 } }),
});

export const politicalProperties = political.properties({
  PartyStatus: dryv.property.enum({ active: "active", dissolved: "dissolved", suspended: "suspended", inactive: "inactive", provisional: "provisional" }),
  Abbreviation: dryv.property.string().length({ min: 1, max: 40 }),
  RegistryIdentifier: dryv.property.string().length({ min: 1, max: 120 }),
});

export const eventProperties = events.properties({
  EventStatus: dryv.property.enum({
    planned: "planned",
    inProgress: "in_progress",
    completed: "completed",
    cancelled: "cancelled",
    postponed: "postponed",
  }),
  ImpactLevel: dryv.property.enum({ low: "low", medium: "medium", high: "high", critical: "critical" }),
  LinkRole: dryv.property.string().length({ min: 1, max: 100 }),
});

/* ---------------------------------- Elections ---------------------------------- */

const electionCore = elections.schemas({
  Election: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      typeId: plainId(),
      administeringInstitutionId: optionalId(),
      legalBasisId: optionalId(),
      geoUnitId: optionalId(),
      scheduledDate: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"], sort: true }),
      heldDate: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"], sort: true }),
      status: dryv.field(electionProperties.ElectionStatus).query({ filter: ["equal", "in"] }),
    },
    "elections",
    [
      { name: "idx_election_code", fields: ["code"], unique: true },
      { name: "idx_election_jurisdiction", fields: ["jurisdictionId", "status"] },
    ],
  ),
});

const electionSeats = elections.schemas({
  Seat: recorded(
    {
      electionId: relationTo(() => electionCore.Election.field("id")),
      officeId: optionalId(),
      geoUnitId: optionalId(),
      legalBasisId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      positions: dryv.field(sharedProperties.Count),
    },
    "seats",
    [{ name: "idx_seat_election_code", fields: ["electionId", "code"], unique: true }],
  ),
});

const electionContests = elections.schemas({
  Candidate: recorded(
    {
      seatId: relationTo(() => electionSeats.Seat.field("id")),
      personId: plainId(),
      partyId: optionalId(),
      isIndependent: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      nominationStatus: dryv.field(electionProperties.NominationStatus).query({ filter: ["equal", "in"] }),
    },
    "candidates",
    [{ name: "idx_candidate_seat", fields: ["seatId"] }, { name: "idx_candidate_person", fields: ["personId"] }],
  ),
});

const electionOutcomes = elections.schemas({
  ElectionResult: recorded(
    {
      candidateId: relationTo(() => electionContests.Candidate.field("id")),
      seatId: plainId(),
      resultLevelId: plainId(),
      geoUnitId: optionalId(),
      declaringInstitutionId: optionalId(),
      votes: dryv.field(electionProperties.Votes).query({ filter: ["between"], sort: true }),
      rank: dryv.field(electionProperties.Rank).optional().nullable(),
      isWinner: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      declaredAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "results",
    [{ name: "idx_result_candidate", fields: ["candidateId"] }, { name: "idx_result_seat", fields: ["seatId", "resultLevelId"] }],
  ),

  Manifesto: recorded(
    {
      candidateId: relationTo(() => electionContests.Candidate.field("id")),
      title: dryv.field(sharedProperties.Name).query(searchable),
      language: dryv.field(sharedProperties.Label).optional().nullable(),
      documentUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      publishedOn: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "manifestos",
    [{ name: "idx_manifesto_candidate", fields: ["candidateId"] }],
  ),
});

/**
 * The electorate and the ballot, not only the candidates: how many voters were registered, how many voted and how many
 * ballots were valid, rejected or spoilt in an area at a result level (optionally for one contest), referendum questions
 * and options with the votes for each, and party-list or nominated seat allocations. Each row is a recorded fact with valid
 * time and a version, so a revised or court-set-aside count is a new version. `evidenceForm` names the IEBC form the
 * figure was declared on (34A at polling station, 34B at constituency, 34C at national level); the source document and
 * its capture are linked through the source schema's attributions like every other claim.
 */
const electorates = elections.schemas({
  Electorate: recorded(
    {
      electionId: relationTo(() => electionCore.Election.field("id")),
      seatId: optionalId(),
      geoUnitId: optionalId(),
      resultLevelId: plainId(),
      registerVersion: dryv.field(electionProperties.RegisterVersion).optional().nullable(),
      registeredVoters: dryv.field(electionProperties.Votes).optional().nullable().query({ filter: ["between"], sort: true }),
      votesCast: dryv.field(electionProperties.Votes).optional().nullable().query({ filter: ["between"], sort: true }),
      validVotes: dryv.field(electionProperties.Votes).optional().nullable(),
      rejectedVotes: dryv.field(electionProperties.Votes).optional().nullable(),
      spoiltVotes: dryv.field(electionProperties.Votes).optional().nullable(),
      resultStatus: dryv.field(electionProperties.ResultStatus).optional().nullable().query({ filter: ["equal", "in"] }),
      evidenceForm: dryv.field(electionProperties.EvidenceForm).optional().nullable(),
      declaringInstitutionId: optionalId(),
      declaredAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "electorates",
    [
      { name: "idx_electorate_election", fields: ["electionId", "resultLevelId"] },
      { name: "idx_electorate_geo", fields: ["geoUnitId"] },
    ],
  ),
});

const referendums = elections.schemas({
  ReferendumQuestion: recorded(
    {
      electionId: relationTo(() => electionCore.Election.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      text: dryv.field(sharedProperties.LongText),
      position: dryv.field(sharedProperties.Count).optional().nullable(),
    },
    "referendum_questions",
    [{ name: "idx_referendum_question_code", fields: ["electionId", "code"], unique: true }],
  ),
});

const referendumOptions = elections.schemas({
  ReferendumOption: recorded(
    {
      questionId: relationTo(() => referendums.ReferendumQuestion.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label),
      position: dryv.field(sharedProperties.Count).optional().nullable(),
    },
    "referendum_options",
    [{ name: "idx_referendum_option_code", fields: ["questionId", "code"], unique: true }],
  ),
});

const referendumOutcomes = elections.schemas({
  ReferendumResult: recorded(
    {
      optionId: relationTo(() => referendumOptions.ReferendumOption.field("id")),
      resultLevelId: plainId(),
      geoUnitId: optionalId(),
      declaringInstitutionId: optionalId(),
      votes: dryv.field(electionProperties.Votes).query({ filter: ["between"], sort: true }),
      resultStatus: dryv.field(electionProperties.ResultStatus).optional().nullable().query({ filter: ["equal", "in"] }),
      evidenceForm: dryv.field(electionProperties.EvidenceForm).optional().nullable(),
      declaredAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "referendum_results",
    [{ name: "idx_referendum_result_option", fields: ["optionId", "resultLevelId"] }, { name: "idx_referendum_result_geo", fields: ["geoUnitId"] }],
  ),
});

const seatAllocations = elections.schemas({
  SeatAllocation: recorded(
    {
      electionId: relationTo(() => electionCore.Election.field("id")),
      seatId: optionalId(),
      partyId: plainId(),
      personId: optionalId(),
      geoUnitId: optionalId(),
      kind: dryv.field(electionProperties.AllocationKind).query({ filter: ["equal", "in"] }),
      listPosition: dryv.field(sharedProperties.Count).optional().nullable(),
      seatsEntitled: dryv.field(sharedProperties.Count).optional().nullable(),
      allocatedOn: dryv.field(sharedProperties.Date).optional().nullable(),
      declaringInstitutionId: optionalId(),
    },
    "seat_allocations",
    [{ name: "idx_seat_allocation_election", fields: ["electionId", "kind"] }, { name: "idx_seat_allocation_party", fields: ["partyId"] }],
  ),
});

const manifestoCommitments = elections.schemas({
  ManifestoCommitment: recorded(
    {
      manifestoId: relationTo(() => electionOutcomes.Manifesto.field("id")),
      parentId: optionalId(),
      topicId: optionalId(),
      text: dryv.field(sharedProperties.LongText),
      sortOrder: dryv.field(sharedProperties.Count).query({ sort: true }),
    },
    "commitments",
    [{ name: "idx_commitment_manifesto", fields: ["manifestoId"] }],
  ),
});

/* ---------------------------------- Political ---------------------------------- */

const parties = political.schemas({
  Party: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      abbreviation: dryv.field(politicalProperties.Abbreviation).optional().nullable().query({ filter: ["contains"], search: true }),
      status: dryv.field(politicalProperties.PartyStatus).query({ filter: ["equal", "in"] }),
      registryIdentifier: dryv.field(politicalProperties.RegistryIdentifier).optional().nullable(),
      registryAuthorityId: optionalId(),
      symbolUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      wikidataId: dryv.field(sharedProperties.WikidataId).optional().nullable().query({ filter: ["equal"] }),
      logoMarker: dryv.field(sharedProperties.MediaMarker).optional().nullable().query({ filter: ["equal"] }),
    },
    "parties",
    [{ name: "idx_party_code", fields: ["code"], unique: true }, { name: "idx_party_jurisdiction", fields: ["jurisdictionId"] }],
  ),
});

const partyDetails = political.schemas({
  PartyMembership: recorded(
    {
      partyId: relationTo(() => parties.Party.field("id")),
      personId: plainId(),
      roleTitle: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "memberships",
    [{ name: "idx_membership_party", fields: ["partyId"] }, { name: "idx_membership_person", fields: ["personId"] }],
  ),

  PartyUnit: recorded(
    {
      partyId: relationTo(() => parties.Party.field("id")),
      parentUnitId: optionalId(),
      levelId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      geoUnitId: optionalId(),
    },
    "units",
    [{ name: "idx_party_unit_party_code", fields: ["partyId", "code"], unique: true }],
  ),

  Ideology: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      label: dryv.field(sharedProperties.Label).query(searchable),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "ideologies",
    [{ name: "idx_ideology_code", fields: ["code"], unique: true }],
  ),
});

const partyLinks = political.schemas({
  PartyPosition: recorded(
    {
      unitId: relationTo(() => partyDetails.PartyUnit.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      title: dryv.field(sharedProperties.Name).query(searchable),
    },
    "positions",
    [{ name: "idx_party_position_unit_code", fields: ["unitId", "code"], unique: true }],
  ),

  PartyIdeology: recorded(
    {
      partyId: relationTo(() => parties.Party.field("id")),
      ideologyId: plainId(),
    },
    "alignments",
    [{ name: "idx_party_ideology_party", fields: ["partyId"] }],
  ),
});

const partyHolders = political.schemas({
  PartyPositionHolder: recorded(
    {
      positionId: relationTo(() => partyLinks.PartyPosition.field("id")),
      personId: plainId(),
      isActing: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
    },
    "holders",
    [{ name: "idx_party_holder_position", fields: ["positionId"] }, { name: "idx_party_holder_person", fields: ["personId"] }],
  ),
});

/* ----------------------------------- Events ------------------------------------ */

const eventCore = events.schemas({
  Event: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      title: dryv.field(sharedProperties.Name).query(searchable),
      typeId: plainId(),
      geoUnitId: optionalId(),
      startsOn: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
      endsOn: dryv.field(sharedProperties.Date).optional().nullable(),
      status: dryv.field(eventProperties.EventStatus).query({ filter: ["equal", "in"] }),
      impactLevel: dryv.field(eventProperties.ImpactLevel).optional().nullable().query({ filter: ["equal"] }),
      isRecurring: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      description: dryv.field(sharedProperties.LongText).optional().nullable(),
    },
    "events",
    [{ name: "idx_event_code", fields: ["code"], unique: true }, { name: "idx_event_starts", fields: ["startsOn"] }],
  ),
});

const eventLinks = events.schemas({
  EventLink: recorded(
    {
      eventId: relationTo(() => eventCore.Event.field("id")),
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      role: dryv.field(eventProperties.LinkRole).optional().nullable(),
    },
    "links",
    [{ name: "idx_event_link_event", fields: ["eventId"] }, { name: "idx_event_link_target", fields: ["targetKind", "targetId"] }],
  ),
});

/* ------------------------------------ Reads ------------------------------------ */

const id = () => dryv.field(sharedProperties.Id).optional();
const q = () => dryv.field(sharedProperties.Name).optional();

const electionRead = elections.feature("ElectionsRead").description("Public read access to elections, seats, candidates, results and manifestos.").tags("public");
const electionSurfaces = [
  readSurface(elections, { singular: "Election", plural: "Elections", itemKey: "election", listKey: "elections", path: "/elections/elections", idParam: "electionId", entity: electionCore.Election, description: "elections", filters: { jurisdictionId: id(), status: dryv.field(electionProperties.ElectionStatus).optional(), q: q() } }),
  readSurface(elections, { singular: "Seat", plural: "Seats", itemKey: "seat", listKey: "seats", path: "/elections/seats", idParam: "seatId", entity: electionSeats.Seat, description: "seats", filters: { electionId: id(), q: q() } }),
  readSurface(elections, { singular: "Candidate", plural: "Candidates", itemKey: "candidate", listKey: "candidates", path: "/elections/candidates", idParam: "candidateId", entity: electionContests.Candidate, description: "candidates", filters: { seatId: id(), personId: id(), partyId: id() } }),
  readSurface(elections, { singular: "ElectionResult", plural: "ElectionResults", itemKey: "result", listKey: "results", path: "/elections/results", idParam: "resultId", entity: electionOutcomes.ElectionResult, description: "election results", filters: { candidateId: id(), seatId: id(), resultLevelId: id(), geoUnitId: id() } }),
  readSurface(elections, { singular: "Electorate", plural: "Electorates", itemKey: "electorate", listKey: "electorates", path: "/elections/electorates", idParam: "electorateId", entity: electorates.Electorate, description: "registered voters, turnout and ballot counts", filters: { electionId: id(), seatId: id(), geoUnitId: id(), resultLevelId: id() } }),
  readSurface(elections, { singular: "ReferendumQuestion", plural: "ReferendumQuestions", itemKey: "question", listKey: "questions", path: "/elections/referendum-questions", idParam: "questionId", entity: referendums.ReferendumQuestion, description: "referendum questions", filters: { electionId: id(), q: q() } }),
  readSurface(elections, { singular: "ReferendumOption", plural: "ReferendumOptions", itemKey: "option", listKey: "options", path: "/elections/referendum-options", idParam: "optionId", entity: referendumOptions.ReferendumOption, description: "referendum options", filters: { questionId: id() } }),
  readSurface(elections, { singular: "ReferendumResult", plural: "ReferendumResults", itemKey: "referendumResult", listKey: "referendumResults", path: "/elections/referendum-results", idParam: "referendumResultId", entity: referendumOutcomes.ReferendumResult, description: "referendum results", filters: { optionId: id(), resultLevelId: id(), geoUnitId: id() } }),
  readSurface(elections, { singular: "SeatAllocation", plural: "SeatAllocations", itemKey: "allocation", listKey: "allocations", path: "/elections/seat-allocations", idParam: "allocationId", entity: seatAllocations.SeatAllocation, description: "party-list and nominated seat allocations", filters: { electionId: id(), partyId: id(), personId: id() } }),
  readSurface(elections, { singular: "Manifesto", plural: "Manifestos", itemKey: "manifesto", listKey: "manifestos", path: "/elections/manifestos", idParam: "manifestoId", entity: electionOutcomes.Manifesto, description: "manifestos", filters: { candidateId: id(), q: q() } }),
  readSurface(elections, { singular: "ManifestoCommitment", plural: "ManifestoCommitments", itemKey: "commitment", listKey: "commitments", path: "/elections/manifesto-commitments", idParam: "commitmentId", entity: manifestoCommitments.ManifestoCommitment, description: "manifesto commitments", filters: { manifestoId: id(), parentId: id() } }),
];
export const electionsReadOperations = electionRead.operations(Object.assign({}, ...electionSurfaces.map((surface) => surface.operations)));

const politicalRead = political.feature("PoliticalRead").description("Public read access to parties, membership, structure and ideology.").tags("public");
const politicalSurfaces = [
  readSurface(political, { singular: "Party", plural: "Parties", itemKey: "party", listKey: "parties", path: "/political/parties", idParam: "partyId", entity: parties.Party, description: "parties", filters: { jurisdictionId: id(), status: dryv.field(politicalProperties.PartyStatus).optional(), q: q() } }),
  readSurface(political, { singular: "PartyMembership", plural: "PartyMemberships", itemKey: "membership", listKey: "memberships", path: "/political/memberships", idParam: "membershipId", entity: partyDetails.PartyMembership, description: "party memberships", filters: { partyId: id(), personId: id() } }),
  readSurface(political, { singular: "PartyUnit", plural: "PartyUnits", itemKey: "unit", listKey: "units", path: "/political/units", idParam: "unitId", entity: partyDetails.PartyUnit, description: "party units", filters: { partyId: id(), parentUnitId: id() } }),
  readSurface(political, { singular: "Ideology", plural: "Ideologies", itemKey: "ideology", listKey: "ideologies", path: "/political/ideologies", idParam: "ideologyId", entity: partyDetails.Ideology, description: "ideologies", filters: { jurisdictionId: id(), q: q() } }),
  readSurface(political, { singular: "PartyPosition", plural: "PartyPositions", itemKey: "position", listKey: "positions", path: "/political/positions", idParam: "positionId", entity: partyLinks.PartyPosition, description: "party positions", filters: { unitId: id() } }),
  readSurface(political, { singular: "PartyIdeology", plural: "PartyIdeologies", itemKey: "partyIdeology", listKey: "partyIdeologies", path: "/political/party-ideologies", idParam: "partyIdeologyId", entity: partyLinks.PartyIdeology, description: "party ideologies", filters: { partyId: id(), ideologyId: id() } }),
  readSurface(political, { singular: "PartyPositionHolder", plural: "PartyPositionHolders", itemKey: "holder", listKey: "holders", path: "/political/position-holders", idParam: "holderId", entity: partyHolders.PartyPositionHolder, description: "party position holders", filters: { positionId: id(), personId: id() } }),
];
export const politicalReadOperations = politicalRead.operations(Object.assign({}, ...politicalSurfaces.map((surface) => surface.operations)));

const eventsRead = events.feature("EventsRead").description("Public read access to events and their links.").tags("public");
const eventSurfaces = [
  readSurface(events, { singular: "Event", plural: "Events", itemKey: "event", listKey: "events", path: "/events/events", idParam: "eventId", entity: eventCore.Event, description: "events", filters: { jurisdictionId: id(), status: dryv.field(eventProperties.EventStatus).optional(), q: q() } }),
  readSurface(events, { singular: "EventLink", plural: "EventLinks", itemKey: "link", listKey: "links", path: "/events/links", idParam: "linkId", entity: eventLinks.EventLink, description: "event links", filters: { eventId: id(), targetKind: dryv.field(sharedProperties.TargetKind).optional(), targetId: id() } }),
];
export const eventsReadOperations = eventsRead.operations(Object.assign({}, ...eventSurfaces.map((surface) => surface.operations)));
