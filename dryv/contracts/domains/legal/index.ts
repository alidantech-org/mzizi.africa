import * as dryv from "@dryvcode/author";

import { referenceSchemas } from "../../foundation/reference/index.ts";
import { recorded, optionalId, plainId, relationTo, searchable } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Legal instruments and provisions.
 *
 * Generalises constitutions and sections into one model: a constitution, statute, regulation,
 * treaty, decree or customary code is a LegalInstrument whose kind is a jurisdiction-scoped
 * classification record. Provisions carry pinpoint structure, so any other domain can cite the
 * exact provision that is its legal basis through LegalAuthorityLink.
 */
export const legal = dryv.group({ name: "legal" }).description("Legal instruments, provisions, amendments and authority links.").tags("public", "legal")
  .facets({ storage: { namespace: "legal" } });

export const legalProperties = legal.properties({
  InstrumentStatus: dryv.property.enum({
    draft: "draft",
    inForce: "in_force",
    suspended: "suspended",
    superseded: "superseded",
    repealed: "repealed",
  }),
  ProvisionKind: dryv.property.enum({
    preamble: "preamble",
    chapter: "chapter",
    part: "part",
    section: "section",
    article: "article",
    clause: "clause",
    subclause: "subclause",
    schedule: "schedule",
    appendix: "appendix",
  }),
  AmendmentChangeKind: dryv.property.enum({
    inserted: "inserted",
    replaced: "replaced",
    repealed: "repealed",
    renumbered: "renumbered",
  }),
  /** Pinpoint reference such as "Art. 131(2)(a)"; free text because citation styles differ by jurisdiction. */
  Citation: dryv.property.string().length({ min: 1, max: 300 }),
});

export const legalEntitySchemas = legal.schemas({
  LegalInstrument: recorded(
    {
      jurisdictionId: plainId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      title: dryv.field(sharedProperties.Name).query(searchable),
      kindId: plainId(),
      status: dryv.field(legalProperties.InstrumentStatus).query({ filter: ["equal", "in"] }),
      issuingInstitutionId: optionalId(),
      documentUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      contentHash: dryv.field(sharedProperties.Checksum).optional().nullable(),
      summary: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "instruments",
    [
      { name: "idx_legal_instrument_code", fields: ["code"], unique: true },
      { name: "idx_legal_instrument_jurisdiction", fields: ["jurisdictionId", "status"] },
    ],
  ),
});

export const legalProvisionSchemas = legal.schemas({
  LegalProvision: recorded(
    {
      instrumentId: relationTo(() => legalEntitySchemas.LegalInstrument.field("id")),
      parentId: optionalId(),
      previousVersionId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      kind: dryv.field(legalProperties.ProvisionKind).query({ filter: ["equal", "in"] }),
      citation: dryv.field(legalProperties.Citation).query({ filter: ["contains"], search: true }),
      heading: dryv.field(sharedProperties.Name).optional().nullable().query({ filter: ["contains"], search: true }),
      content: dryv.field(sharedProperties.LongText).optional().nullable(),
      sortOrder: dryv.field(sharedProperties.Count).query({ sort: true }),
    },
    "provisions",
    [
      { name: "idx_legal_provision_instrument_code", fields: ["instrumentId", "code", "version"], unique: true },
      { name: "idx_legal_provision_parent", fields: ["parentId"] },
    ],
  ),
});

export const legalAmendmentSchemas = legal.schemas({
  LegalAmendment: recorded(
    {
      instrumentId: relationTo(() => legalEntitySchemas.LegalInstrument.field("id")),
      amendingInstrumentId: optionalId(),
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      summary: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "amendments",
    [{ name: "idx_legal_amendment_instrument", fields: ["instrumentId"] }],
  ),
});

export const legalChangeSchemas = legal.schemas({
  LegalAmendmentChange: recorded(
    {
      amendmentId: relationTo(() => legalAmendmentSchemas.LegalAmendment.field("id")),
      provisionId: plainId(),
      kind: dryv.field(legalProperties.AmendmentChangeKind).query({ filter: ["equal", "in"] }),
      previousText: dryv.field(sharedProperties.LongText).optional().nullable(),
      newText: dryv.field(sharedProperties.LongText).optional().nullable(),
    },
    "changes",
    [{ name: "idx_legal_change_amendment", fields: ["amendmentId"] }],
  ),

  /**
   * Legal basis link: the provision that authorises, establishes or constrains a record in another
   * domain (an office rule, an election, a budget, a loan). targetKind + targetId name the record.
   */
  LegalAuthorityLink: recorded(
    {
      provisionId: relationTo(() => legalProvisionSchemas.LegalProvision.field("id")),
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      note: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "links",
    [{ name: "idx_legal_authority_target", fields: ["targetKind", "targetId"] }],
  ),
});

const entities = { ...legalEntitySchemas, ...legalProvisionSchemas, ...legalAmendmentSchemas, ...legalChangeSchemas };

const legalRead = legal.feature("LegalRead").description("Public read access to legal instruments, provisions and amendments.").tags("public");

const instruments = readSurface(legal, {
  singular: "LegalInstrument", plural: "LegalInstruments", itemKey: "instrument", listKey: "instruments",
  path: "/legal/instruments", idParam: "instrumentId", entity: entities.LegalInstrument, description: "legal instruments",
  filters: {
    jurisdictionId: dryv.field(sharedProperties.Id).optional(),
    status: dryv.field(legalProperties.InstrumentStatus).optional(),
    q: dryv.field(sharedProperties.Name).optional(),
  },
});
const provisions = readSurface(legal, {
  singular: "LegalProvision", plural: "LegalProvisions", itemKey: "provision", listKey: "provisions",
  path: "/legal/provisions", idParam: "provisionId", entity: entities.LegalProvision, description: "legal provisions",
  filters: {
    instrumentId: dryv.field(sharedProperties.Id).optional(),
    parentId: dryv.field(sharedProperties.Id).optional(),
    kind: dryv.field(legalProperties.ProvisionKind).optional(),
    q: dryv.field(sharedProperties.Name).optional(),
  },
});
const amendments = readSurface(legal, {
  singular: "LegalAmendment", plural: "LegalAmendments", itemKey: "amendment", listKey: "amendments",
  path: "/legal/amendments", idParam: "amendmentId", entity: entities.LegalAmendment, description: "legal amendments",
  filters: { instrumentId: dryv.field(sharedProperties.Id).optional() },
});
const changes = readSurface(legal, {
  singular: "LegalAmendmentChange", plural: "LegalAmendmentChanges", itemKey: "change", listKey: "changes",
  path: "/legal/amendment-changes", idParam: "changeId", entity: entities.LegalAmendmentChange, description: "legal amendment changes",
  filters: { amendmentId: dryv.field(sharedProperties.Id).optional(), provisionId: dryv.field(sharedProperties.Id).optional() },
});
const links = readSurface(legal, {
  singular: "LegalAuthorityLink", plural: "LegalAuthorityLinks", itemKey: "link", listKey: "links",
  path: "/legal/authority-links", idParam: "linkId", entity: entities.LegalAuthorityLink, description: "legal authority links",
  filters: {
    provisionId: dryv.field(sharedProperties.Id).optional(),
    targetKind: dryv.field(sharedProperties.TargetKind).optional(),
    targetId: dryv.field(sharedProperties.Id).optional(),
  },
});

export const legalReadOperations = legalRead.operations({
  ...instruments.operations,
  ...provisions.operations,
  ...amendments.operations,
  ...changes.operations,
  ...links.operations,
});
