import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { recorded, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface, standardFailures, withStandardHttpFailures } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Governance: institutions, typed relationships, offices, dated office rules, selection
 * procedures and office holders. People live in the person schema; a holder refers to an
 * individual by id and never copies a name.
 *
 * An office is a role; a holder is a person occupying it for a period. Institution types, branches
 * of government, selection methods and procedure stages are jurisdiction-scoped classification
 * records. Term limits and retirement ages are dated rule records with a legal basis, not columns.
 */
export const governance = dryv
  .group({ name: "governance" })
  .description("Institutions, offices, rules, selection procedures and office holders.")
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
    ownedBy: "owned_by",
    operatedBy: "operated_by",
    fundedBy: "funded_by",
    regulatedBy: "regulated_by",
    overseenBy: "overseen_by",
    partOf: "part_of",
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
  Institution: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      typeId: plainId(),
      branchId: optionalId(),
      /** Optional soft link to the legal person (organization.entities) when the public body is also a registered entity. */
      entityId: optionalId(),
      /** Territory the body serves (jurisdiction scope). Never a building: physical sites are place.places. */
      scopeGeoUnitId: optionalId(),
      legalBasisId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      wikidataId: dryv.field(sharedProperties.WikidataId).optional().nullable().query({ filter: ["equal"] }),
      logoMarker: dryv.field(sharedProperties.MediaMarker).optional().nullable().query({ filter: ["equal"] }),
    },
    "institutions",
    [
      { name: "idx_institution_code", fields: ["code"], unique: true },
      { name: "idx_institution_jurisdiction", fields: ["jurisdictionId"] },
      { name: "idx_institution_entity", fields: ["entityId"] },
      { name: "idx_institution_scope", fields: ["scopeGeoUnitId"] },
    ],
  ),
});

const relationships = governance.schemas({
  /**
   * A typed edge between any two subjects (institution, entity, amenity, unit): "subject kind object",
   * for example amenity operated_by entity, institution oversees institution, institution has_component unit.
   * Subjects are plain kind and id pairs, never foreign keys, so the edge can cross schemas. Money amounts stay in finance.
   */
  InstitutionRelationship: recorded(
    {
      subjectKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      subjectId: plainId(),
      objectKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      objectId: plainId(),
      kind: dryv.field(governanceProperties.RelationshipKind).query({ filter: ["equal", "in"] }),
      legalBasisId: optionalId(),
    },
    "relationships",
    [
      { name: "idx_relationship_subject", fields: ["subjectKind", "subjectId", "kind"] },
      { name: "idx_relationship_object", fields: ["objectKind", "objectId", "kind"] },
    ],
  ),

  Office: recorded(
    {
      institutionId: relationTo(() => institutions.Institution.field("id")),
      parentOfficeId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      /** Reusable pattern the post was created from (for example county-executive/governor); definitions live in seed JSON, not a table. */
      definitionCode: dryv.field(sharedProperties.BusinessCode).optional().nullable().query({ filter: ["equal"] }),
      /** The geography unit this post represents (the constituency of an MP, the county of a governor). Null for national posts. */
      scopeGeoUnitId: optionalId(),
      name: dryv.field(sharedProperties.Name).query(searchable),
      isSingleton: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "offices",
    [
      { name: "idx_office_code", fields: ["code"], unique: true },
      { name: "idx_office_institution", fields: ["institutionId"] },
      { name: "idx_office_scope", fields: ["scopeGeoUnitId"] },
    ],
  ),
});

const officeDetails = governance.schemas({
  /** A dated rule on an office (term limit, term length, age limits) with its legal basis. */
  OfficeRule: recorded(
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

  SelectionProcedure: recorded(
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
  SelectionStage: recorded(
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

const officeHolders = governance.schemas({
  OfficeHolder: recorded(
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

const entities = { ...institutions, ...relationships, ...officeDetails, ...procedureStages, ...officeHolders };

const governanceRead = governance.feature("GovernanceRead").description("Public read access to institutions, offices, rules and office holders.").tags("public");

const surfaces = [
  readSurface(governance, {
    singular: "Institution", plural: "Institutions", itemKey: "institution", listKey: "institutions",
    path: "/governance/institutions", idParam: "institutionId", entity: entities.Institution, description: "institutions",
    filters: {
      jurisdictionId: dryv.field(sharedProperties.Id).optional(),
      typeId: dryv.field(sharedProperties.Id).optional(),
      entityId: dryv.field(sharedProperties.Id).optional(),
      scopeGeoUnitId: dryv.field(sharedProperties.Id).optional(),
      q: dryv.field(sharedProperties.Name).optional(),
    },
  }),
  readSurface(governance, {
    singular: "InstitutionRelationship", plural: "InstitutionRelationships", itemKey: "relationship", listKey: "relationships",
    path: "/governance/institution-relationships", idParam: "relationshipId", entity: entities.InstitutionRelationship, description: "institution relationships",
    filters: {
      subjectKind: dryv.field(sharedProperties.TargetKind).optional(),
      subjectId: dryv.field(sharedProperties.Id).optional(),
      objectKind: dryv.field(sharedProperties.TargetKind).optional(),
      objectId: dryv.field(sharedProperties.Id).optional(),
      kind: dryv.field(governanceProperties.RelationshipKind).optional(),
    },
  }),
  readSurface(governance, {
    singular: "Office", plural: "Offices", itemKey: "office", listKey: "offices",
    path: "/governance/offices", idParam: "officeId", entity: entities.Office, description: "offices",
    filters: { institutionId: dryv.field(sharedProperties.Id).optional(), scopeGeoUnitId: dryv.field(sharedProperties.Id).optional(), q: dryv.field(sharedProperties.Name).optional() },
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
