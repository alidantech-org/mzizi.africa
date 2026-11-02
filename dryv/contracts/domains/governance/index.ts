import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { evidenced, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface, standardFailures, withStandardHttpFailures } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Governance: institutions, typed relationships, offices, dated office rules, selection
 * procedures, people and office holders.
 *
 * An office is a role; a holder is a person occupying it for a period. Institution types, branches
 * of government, selection methods and procedure stages are jurisdiction-scoped classification
 * records. Term limits and retirement ages are dated rule records with a legal basis, not columns.
 */
export const governance = dryv
  .group({ name: "governance" })
  .description("Institutions, offices, rules, selection procedures, people and office holders.")
  .tags("public", "governance")
  .facets({ storage: { namespace: "governance" } });

export const governanceProperties = governance.properties({
  RelationshipKind: dryv.property.enum({
    hasComponent: "has_component",
    hasOffice: "has_office",
    appoints: "appoints",
    funds: "funds",
    oversees: "oversees",
    accountableTo: "accountable_to",
    delegatesTo: "delegates_to",
  }),
  RuleKind: dryv.property.enum({
    maxTerms: "max_terms",
    termLengthYears: "term_length_years",
    minAge: "min_age",
    retirementAge: "retirement_age",
    other: "other",
  }),
  StageKind: dryv.property.enum({
    nomination: "nomination",
    vetting: "vetting",
    election: "election",
    approval: "approval",
    appointment: "appointment",
    confirmation: "confirmation",
  }),
  LifeStatus: dryv.property.enum({ alive: "alive", deceased: "deceased", unknown: "unknown" }),
  NameKind: dryv.property.enum({ birth: "birth", common: "common", honorific: "honorific", alias: "alias", transliteration: "transliteration" }),
  HolderStatus: dryv.property.enum({ substantive: "substantive", acting: "acting", interim: "interim" }),
  DepartureReason: dryv.property.enum({
    termEnded: "term_ended",
    resigned: "resigned",
    removed: "removed",
    died: "died",
    other: "other",
  }),
  RuleValue: dryv.property.number.decimal({ precision: 12, scale: 2 }),
  StageOrder: dryv.property.number.integer({ range: { min: 1 } }),
});

const institutions = governance.schemas({
  Institution: evidenced(
    {
      jurisdictionId: relationTo(() => referenceSchemas.Jurisdiction.field("id")),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      typeId: plainId(),
      branchId: optionalId(),
      geoUnitId: optionalId(),
      legalBasisId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "institutions",
    [
      { name: "idx_institution_code", fields: ["code"], unique: true },
      { name: "idx_institution_jurisdiction", fields: ["jurisdictionId"] },
    ],
  ),
});

const relationships = governance.schemas({
  InstitutionRelationship: evidenced(
    {
      parentInstitutionId: relationTo(() => institutions.Institution.field("id")),
      childInstitutionId: plainId(),
      kind: dryv.field(governanceProperties.RelationshipKind).query({ filter: ["equal", "in"] }),
      legalBasisId: optionalId(),
    },
    "relationships",
    [{ name: "idx_institution_relationship_parent", fields: ["parentInstitutionId", "kind"] }],
  ),

  Office: evidenced(
    {
      institutionId: relationTo(() => institutions.Institution.field("id")),
      parentOfficeId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      isSingleton: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "offices",
    [
      { name: "idx_office_code", fields: ["code"], unique: true },
      { name: "idx_office_institution", fields: ["institutionId"] },
    ],
  ),
});

const officeDetails = governance.schemas({
  /** A dated rule on an office (term limit, term length, age limits) with its legal basis. */
  OfficeRule: evidenced(
    {
      officeId: relationTo(() => relationships.Office.field("id")),
      kind: dryv.field(governanceProperties.RuleKind).query({ filter: ["equal", "in"] }),
      numericValue: dryv.field(governanceProperties.RuleValue).optional().nullable(),
      textValue: dryv.field(sharedProperties.Description).optional().nullable(),
      legalBasisId: optionalId(),
    },
    "rules",
    [{ name: "idx_office_rule_office", fields: ["officeId", "kind"] }],
  ),

  SelectionProcedure: evidenced(
    {
      officeId: relationTo(() => relationships.Office.field("id")),
      methodId: plainId(),
      legalBasisId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "procedures",
    [{ name: "idx_selection_procedure_office", fields: ["officeId"] }],
  ),
});

const procedureStages = governance.schemas({
  SelectionStage: evidenced(
    {
      procedureId: relationTo(() => officeDetails.SelectionProcedure.field("id")),
      stageOrder: dryv.field(governanceProperties.StageOrder).query({ sort: true }),
      kind: dryv.field(governanceProperties.StageKind).query({ filter: ["equal", "in"] }),
      actorInstitutionId: optionalId(),
      actorOfficeId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "stages",
    [{ name: "idx_selection_stage_procedure", fields: ["procedureId", "stageOrder"] }],
  ),
});

const people = governance.schemas({
  Person: evidenced(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      displayName: dryv.field(sharedProperties.Name).query(searchable),
      givenName: dryv.field(sharedProperties.Name).optional().nullable(),
      familyName: dryv.field(sharedProperties.Name).optional().nullable(),
      birthDate: dryv.field(sharedProperties.Date).optional().nullable().query({ filter: ["between"] }),
      birthDatePrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      deathDate: dryv.field(sharedProperties.Date).optional().nullable(),
      deathDatePrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      lifeStatus: dryv.field(governanceProperties.LifeStatus).query({ filter: ["equal"] }),
      birthPlaceId: optionalId(),
    },
    "people",
    [{ name: "idx_person_code", fields: ["code"], unique: true }],
  ),
});

const personDetails = governance.schemas({
  PersonName: evidenced(
    {
      personId: relationTo(() => people.Person.field("id")),
      name: dryv.field(sharedProperties.Name).query({ filter: ["contains"], search: true }),
      kind: dryv.field(governanceProperties.NameKind).query({ filter: ["equal"] }),
      language: dryv.field(sharedProperties.Label).optional().nullable(),
    },
    "aliases",
    [{ name: "idx_person_name_person", fields: ["personId"] }],
  ),

  OfficeHolder: evidenced(
    {
      officeId: relationTo(() => relationships.Office.field("id")),
      personId: plainId(),
      selectionProcedureId: optionalId(),
      legalBasisId: optionalId(),
      termNumber: dryv.field(sharedProperties.Count).optional().nullable(),
      status: dryv.field(governanceProperties.HolderStatus).query({ filter: ["equal"] }),
      departureReason: dryv.field(governanceProperties.DepartureReason).optional().nullable(),
    },
    "holders",
    [
      { name: "idx_office_holder_office", fields: ["officeId", "isCurrent"] },
      { name: "idx_office_holder_person", fields: ["personId"] },
    ],
  ),
});

const entities = { ...institutions, ...relationships, ...officeDetails, ...procedureStages, ...people, ...personDetails };

const governanceRead = governance.feature("GovernanceRead").description("Public read access to institutions, offices, rules, people and office holders.").tags("public");

const surfaces = [
  readSurface(governance, {
    singular: "Institution", plural: "Institutions", itemKey: "institution", listKey: "institutions",
    path: "/governance/institutions", idParam: "institutionId", entity: entities.Institution, description: "institutions",
    filters: {
      jurisdictionId: dryv.field(sharedProperties.Id).optional(),
      typeId: dryv.field(sharedProperties.Id).optional(),
      q: dryv.field(sharedProperties.Name).optional(),
    },
  }),
  readSurface(governance, {
    singular: "InstitutionRelationship", plural: "InstitutionRelationships", itemKey: "relationship", listKey: "relationships",
    path: "/governance/institution-relationships", idParam: "relationshipId", entity: entities.InstitutionRelationship, description: "institution relationships",
    filters: {
      parentInstitutionId: dryv.field(sharedProperties.Id).optional(),
      childInstitutionId: dryv.field(sharedProperties.Id).optional(),
      kind: dryv.field(governanceProperties.RelationshipKind).optional(),
    },
  }),
  readSurface(governance, {
    singular: "Office", plural: "Offices", itemKey: "office", listKey: "offices",
    path: "/governance/offices", idParam: "officeId", entity: entities.Office, description: "offices",
    filters: { institutionId: dryv.field(sharedProperties.Id).optional(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(governance, {
    singular: "OfficeRule", plural: "OfficeRules", itemKey: "rule", listKey: "rules",
    path: "/governance/office-rules", idParam: "ruleId", entity: entities.OfficeRule, description: "office rules",
    filters: { officeId: dryv.field(sharedProperties.Id).optional(), kind: dryv.field(governanceProperties.RuleKind).optional() },
  }),
  readSurface(governance, {
    singular: "SelectionProcedure", plural: "SelectionProcedures", itemKey: "procedure", listKey: "procedures",
    path: "/governance/selection-procedures", idParam: "procedureId", entity: entities.SelectionProcedure, description: "selection procedures",
    filters: { officeId: dryv.field(sharedProperties.Id).optional() },
  }),
  readSurface(governance, {
    singular: "SelectionStage", plural: "SelectionStages", itemKey: "stage", listKey: "stages",
    path: "/governance/selection-stages", idParam: "stageId", entity: entities.SelectionStage, description: "selection stages",
    filters: { procedureId: dryv.field(sharedProperties.Id).optional() },
  }),
  readSurface(governance, {
    singular: "Person", plural: "People", itemKey: "person", listKey: "people",
    path: "/governance/people", idParam: "personId", entity: entities.Person, description: "people",
    filters: { lifeStatus: dryv.field(governanceProperties.LifeStatus).optional(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(governance, {
    singular: "PersonName", plural: "PersonNames", itemKey: "personName", listKey: "personNames",
    path: "/governance/person-names", idParam: "personNameId", entity: entities.PersonName, description: "person names",
    filters: { personId: dryv.field(sharedProperties.Id).optional(), q: dryv.field(sharedProperties.Name).optional() },
  }),
  readSurface(governance, {
    singular: "OfficeHolder", plural: "OfficeHolders", itemKey: "holder", listKey: "holders",
    path: "/governance/office-holders", idParam: "holderId", entity: entities.OfficeHolder, description: "office holders",
    filters: {
      officeId: dryv.field(sharedProperties.Id).optional(),
      personId: dryv.field(sharedProperties.Id).optional(),
      status: dryv.field(governanceProperties.HolderStatus).optional(),
    },
  }),
];

const surfaceSchemas = Object.assign({}, ...surfaces.map((surface) => surface.schemas)) as Record<string, any>;

/** Governance linked to a place: institutions with that territorial scope, their offices and current holders. */
const governanceByGeography = governance.schemas({
  GeographyGovernanceResponse: dryv.schema({
    institutions: dryv.field(surfaceSchemas.InstitutionPublic).array(),
    offices: dryv.field(surfaceSchemas.OfficePublic).array(),
    holders: dryv.field(surfaceSchemas.OfficeHolderPublic).array(),
  }),
});

const GetGeographyGovernance = dryv
  .operation()
  .description("Institutions, offices and current office holders linked to a geography entity.")
  .input({ entityId: sharedProperties.Id })
  .output(governanceByGeography.GeographyGovernanceResponse)
  .failures(...standardFailures);

GetGeographyGovernance.facets({
  http: withStandardHttpFailures(
    dryv
      .http("GET", "/v1/geography/entities/{entityId}/governance")
      .description("Get governance for a geography entity.")
      .input(GetGeographyGovernance.in.entityId, dryv.path())
      .output(GetGeographyGovernance.out, dryv.respond(200)),
  ),
});

export const governanceReadOperations = governanceRead.operations({
  ...Object.assign({}, ...surfaces.map((surface) => surface.operations)),
  GetGeographyGovernance,
});
