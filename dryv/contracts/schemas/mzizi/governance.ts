/**
 * Schema: governance | Database: mzizi
 * Approved implementation scope: institutions, offices, holders, mandates, relationships, authority_scopes.
 * Country membership is expressed through Reference and geographic scope through Geography units.
 * Legal basis uses Reference.LegalBasisLinks; this contract does not create a proxy Legal model.
 * SQL generation remains gated on pack support for CHECK semantics and composite/partial uniqueness.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties } from "../_shared.ts";
import { geographySchemas } from "./geography.ts";
import { officialSchemas } from "./official.ts";
import { referenceLegalSchemas, referenceSchemas } from "./reference.ts";
import { sourceSchemas } from "./source.ts";

export const governance = dryv
  .group({ name: "governance" })
  .description("Public institutions, offices, mandates, office holders and dated authority scopes.")
  .facets({ storage: { namespace: "governance" } });
// biome-ignore lint/suspicious/noExplicitAny: permits typed role references among this schema's tables.
export const governanceSchemas: Record<string, any> = {};
const id = () => dryv.field(sharedProperties.Id);
const ref = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const optRef = (target: () => dryv.SchemaFieldRef<unknown>) =>
  id().optional().nullable().relation({ target, cardinality: dryv.relation.manyToOne(), onDelete: "restrict", onUpdate: "restrict" });
const tableName = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
const dates = {
  valid_from: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
  valid_until: dryv.field(sharedProperties.CalendarDate).optional().nullable(),
};
export const governanceExpressions = governance.expressions({
  MandateHasExactlyOneOwner: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "institution_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "office_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "institution_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "office_id"), dryv.expression.value(null)),
    ),
  ),
  AuthorityHasExactlyOneOwner: dryv.expression.or(
    dryv.expression.and(
      dryv.expression.notEqual(dryv.expression.context("value", "institution_id"), dryv.expression.value(null)),
      dryv.expression.equal(dryv.expression.context("value", "office_id"), dryv.expression.value(null)),
    ),
    dryv.expression.and(
      dryv.expression.equal(dryv.expression.context("value", "institution_id"), dryv.expression.value(null)),
      dryv.expression.notEqual(dryv.expression.context("value", "office_id"), dryv.expression.value(null)),
    ),
  ),
  RelationshipIsNotSelfReferential: dryv.expression.notEqual(
    dryv.expression.context("value", "subject_institution_id"),
    dryv.expression.context("value", "object_institution_id"),
  ),
  ValidityWindowIsOrdered: dryv.expression.or(
    dryv.expression.equal(dryv.expression.context("value", "valid_from"), dryv.expression.value(null)),
    dryv.expression.equal(dryv.expression.context("value", "valid_until"), dryv.expression.value(null)),
    dryv.expression.lessThan(dryv.expression.context("value", "valid_from"), dryv.expression.context("value", "valid_until")),
  ),
});
const grains: Record<string, string> = {
  Institutions: "One government institution specialization of an Official entity.",
  Offices: "One established public office, independent of any current holder and optionally scoped to a geographic unit.",
  Holders: "One person's continuous tenure in one office, with appointment kind and effective dates.",
  Mandates: "One responsibility or authority assignment linked to its Reference legal-basis association.",
  Relationships: "One dated, typed relationship between two government institutions.",
  AuthorityScopes: "One institution or office authority over a required Geography unit for an effective period.",
};
const table = (name: string, fields: Record<string, any>, indexes: any[] = [], invariants: Array<[string, any]> = []) => {
  let definition: any = dryv
    .schema({
      id: id(),
      ...fields,
      source_citation_id: fields.source_citation_id ?? optRef(() => sourceSchemas.Citations.field("id")),
    })
    .description(grains[name]!)
    .role("entity");
  const allInvariants = [...invariants];
  if ("valid_from" in fields && "valid_until" in fields) {
    allInvariants.push(["ValidityWindowIsOrdered", governanceExpressions.ValidityWindowIsOrdered]);
  }
  if (name === "Relationships") {
    allInvariants.push(["RelationshipIsNotSelfReferential", governanceExpressions.RelationshipIsNotSelfReferential]);
  }
  for (const [invariantName, invariant] of allInvariants) definition = definition.invariant(invariantName, invariant);
  const result = governance.schemas({
    [name]: definition.facets({
      storage: dryv
        .storage(tableName(name))
        .primaryKey("id")
        .indexes(...indexes, { name: `idx_${tableName(name)}_citation`, fields: ["source_citation_id"] }),
    }),
  });
  governanceSchemas[name] = result[name];
};

/*---------------- governance.institutions ----------------*/
table(
  "Institutions",
  {
    entity_id: ref(() => officialSchemas.Entities.field("id")),
    institution_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    ...dates,
  },
  [
    { name: "uq_institutions_code", fields: ["code"], unique: true },
    { name: "idx_institutions_entity", fields: ["entity_id"] },
  ],
);
/*---------------- End governance.institutions ----------------*/
/*---------------- governance.offices ----------------*/
table(
  "Offices",
  {
    institution_id: ref(() => governanceSchemas.Institutions.field("id")),
    office_kind_id: ref(() => referenceSchemas.Value.field("id")),
    code: dryv.field(sharedProperties.IdentityCode),
    unit_feature_id: optRef(() => geographySchemas.Units.field("feature_id")),
    ...dates,
  },
  [
    { name: "uq_offices_code", fields: ["code"], unique: true },
    { name: "idx_offices_geographic_unit", fields: ["unit_feature_id"] },
  ],
);
/*---------------- End governance.offices ----------------*/
/*---------------- governance.holders ----------------*/
table(
  "Holders",
  {
    office_id: ref(() => governanceSchemas.Offices.field("id")),
    individual_id: ref(() => officialSchemas.Individuals.field("id")),
    appointment_kind_id: ref(() => referenceSchemas.Value.field("id")),
    appointed_by_entity_id: optRef(() => officialSchemas.Entities.field("id")),
    ...dates,
  },
  [
    { name: "idx_holders_office_dates", fields: ["office_id", "valid_from", "valid_until"] },
    { name: "idx_holders_person", fields: ["individual_id"] },
  ],
);
/*---------------- End governance.holders ----------------*/
/*---------------- governance.mandates ----------------*/
table(
  "Mandates",
  {
    institution_id: optRef(() => governanceSchemas.Institutions.field("id")),
    office_id: optRef(() => governanceSchemas.Offices.field("id")),
    legal_basis_link_id: ref(() => referenceLegalSchemas.LegalBasisLinks.field("id")),
    mandate_kind_id: ref(() => referenceSchemas.Value.field("id")),
    description: dryv.field(sharedProperties.Description),
    ...dates,
  },
  [
    { name: "idx_mandates_institution", fields: ["institution_id"] },
    { name: "idx_mandates_office", fields: ["office_id"] },
    { name: "idx_mandates_basis", fields: ["legal_basis_link_id"] },
  ],
  [["HasExactlyOneInstitutionOrOffice", governanceExpressions.MandateHasExactlyOneOwner]],
);
/*---------------- End governance.mandates ----------------*/
/*---------------- governance.relationships ----------------*/
table(
  "Relationships",
  {
    subject_institution_id: ref(() => governanceSchemas.Institutions.field("id")),
    object_institution_id: ref(() => governanceSchemas.Institutions.field("id")),
    relationship_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...dates,
  },
  [
    { name: "idx_governance_relationship_subject", fields: ["subject_institution_id", "relationship_kind_id"] },
    { name: "idx_governance_relationship_object", fields: ["object_institution_id", "relationship_kind_id"] },
  ],
);
/*---------------- End governance.relationships ----------------*/
/*---------------- governance.authority_scopes ----------------*/
table(
  "AuthorityScopes",
  {
    institution_id: optRef(() => governanceSchemas.Institutions.field("id")),
    office_id: optRef(() => governanceSchemas.Offices.field("id")),
    country_id: optRef(() => referenceSchemas.Country.field("id")),
    unit_feature_id: ref(() => geographySchemas.Units.field("feature_id")),
    authority_kind_id: ref(() => referenceSchemas.Value.field("id")),
    ...dates,
  },
  [
    { name: "idx_authority_scope_institution", fields: ["institution_id"] },
    { name: "idx_authority_scope_office", fields: ["office_id"] },
    { name: "idx_authority_scope_unit", fields: ["unit_feature_id", "valid_from", "valid_until"] },
    { name: "idx_authority_scope_country", fields: ["country_id"] },
  ],
  [["HasExactlyOneInstitutionOrOffice", governanceExpressions.AuthorityHasExactlyOneOwner]],
);
/*---------------- End governance.authority_scopes ----------------*/
