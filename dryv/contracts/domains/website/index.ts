import * as dryv from "@dryvcode/author";

import { optionalId, plainId, relationTo, searchable, systemRecord } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Known sites and their versioned structures (.docs/design/acquisition/WEBSITE_DESIGN.md).
 *
 * A site has its own stable id: a domain is a dated attribute, never an identifier, and a site is
 * not a publisher (they relate many-to-many). A structure is a set of files in the filesystem
 * schema, one folder per immutable version, mostly authored by agents. References to other schemas
 * are plain ids checked by the database engine's integrity jobs.
 */
export const website = dryv
  .group({ name: "website" })
  .description("Known sites, their domains, publisher links, structure versions and checks.")
  .tags("public", "website")
  .facets({ storage: { namespace: "website" } });

export const websiteProperties = website.properties({
  SiteKind: dryv.property.enum({
    portal: "portal",
    publication: "publication",
    api: "api",
    datasetCatalogue: "dataset_catalogue",
    archive: "archive",
    other: "other",
  }),
  SiteStatus: dryv.property.enum({
    expected: "expected",
    discovered: "discovered",
    profiled: "profiled",
    active: "active",
    degraded: "degraded",
    paused: "paused",
    rejected: "rejected",
    retired: "retired",
  }),
  DomainRole: dryv.property.enum({ primary: "primary", alias: "alias", redirect: "redirect", legacy: "legacy", mirror: "mirror" }),
  DomainStatus: dryv.property.enum({
    candidate: "candidate",
    reachable: "reachable",
    redirects: "redirects",
    moved: "moved",
    unreachable: "unreachable",
    refused: "refused",
    retired: "retired",
  }),
  DomainOrigin: dryv.property.enum({
    pattern: "pattern",
    seed_research: "seed_research",
    page_link: "page_link",
    redirect: "redirect",
    manual: "manual",
  }),
  UrlScheme: dryv.property.enum({ http: "http", https: "https" }),
  SitePublisherRole: dryv.property.enum({ owner: "owner", operator: "operator", hosted: "hosted" }),
  StructureOwnerKind: dryv.property.enum({ site: "site", family: "family" }),
  StructureStatus: dryv.property.enum({ active: "active", retired: "retired" }),
  VersionStatus: dryv.property.enum({
    draft: "draft",
    validated: "validated",
    active: "active",
    superseded: "superseded",
    rejected: "rejected",
  }),
  StructureFileRole: dryv.property.enum({
    manifest: "manifest",
    module: "module",
    mapping: "mapping",
    tags: "tags",
    notes: "notes",
    example: "example",
  }),
  CheckKind: dryv.property.enum({ reachability: "reachability", fit: "fit", drift: "drift" }),
  CheckOutcome: dryv.property.enum({ ok: "ok", degraded: "degraded", failed: "failed" }),
  HttpStatus: dryv.property.number.integer({ range: { min: 100, max: 599 } }),
  /** Semantic label of a content section (publications, tenders, gazettes ...); the allowed labels are validated in the data engine. */
  SectionLabel: dryv.property.string().length({ min: 2, max: 60 }),
  Hostname: dryv.property.string().length({ min: 1, max: 253 }),
  BundlePath: dryv.property.string().length({ min: 1, max: 500 }),
  SchemaVersion: dryv.property.string().length({ min: 1, max: 60 }),
  Purpose: dryv.property.string().length({ min: 1, max: 100 }),
  FamilyKind: dryv.property.enum({
    geographicUnit: "geographic_unit",
    institutionType: "institution_type",
    independentBody: "independent_body",
    platform: "platform",
    purpose: "purpose",
  }),
  FamilyStatus: dryv.property.enum({ proposed: "proposed", active: "active", retired: "retired" }),
  PatternStatus: dryv.property.enum({ proposed: "proposed", verified: "verified", retired: "retired" }),
  MembershipRole: dryv.property.enum({ member: "member", templateSource: "template_source" }),
  MembershipBasis: dryv.property.enum({ pattern: "pattern", agent: "agent", fingerprint: "fingerprint" }),
  SubjectRelation: dryv.property.enum({ serves: "serves", operatedBy: "operated_by", about: "about", publishes: "publishes" }),
  RelationOwnerKind: dryv.property.enum({ site: "site", family: "family" }),
  SiteRelationKind: dryv.property.enum({
    similarTo: "similar_to",
    derivedFrom: "derived_from",
    sharesPlatform: "shares_platform",
    sharesModule: "shares_module",
  }),
  FingerprintKind: dryv.property.enum({ markup: "markup", navigation: "navigation", assets: "assets", documentTypes: "document_types" }),
  /** Namespaced trait such as platform:wordpress or section:downloads. */
  TraitTag: dryv.property.string().length({ min: 3, max: 200 }),
  /** Domain template with named slots, such as {county}.go.ke. */
  DomainTemplate: dryv.property.string().length({ min: 3, max: 300 }),
  LegalReviewStatus: dryv.property.enum({
    notReviewed: "not_reviewed",
    inReview: "in_review",
    approved: "approved",
    approvedWithConditions: "approved_with_conditions",
    restricted: "restricted",
    rejected: "rejected",
    expired: "expired",
  }),
  AssessmentSourceType: dryv.property.enum({
    api: "api",
    openDataPortal: "open_data_portal",
    officialWebsite: "official_website",
    documentRepository: "document_repository",
    thirdPartyRepository: "third_party_repository",
    other: "other",
  }),
  AccessBasis: dryv.property.enum({
    openEndpoint: "open_endpoint",
    publishedTerms: "published_terms",
    openLicence: "open_licence",
    writtenPermission: "written_permission",
    accessToInformationResponse: "access_to_information_response",
    other: "other",
  }),
  LaunchStage: dryv.property.enum({ research: "research", pilot: "pilot", production: "production", paused: "paused" }),
  /** Serialised JSON text: arrays and objects whose shape the compliance engine validates. */
  JsonText: dryv.property.string().length({ min: 2 }),
  Score: dryv.property.number.decimal({ precision: 7, scale: 4 }),
});

const sites = website.schemas({
  /** A known site. Its identity is this row, not any domain it has had. */
  Site: systemRecord(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      kind: dryv.field(websiteProperties.SiteKind).query({ filter: ["equal", "in"] }),
      status: dryv.field(websiteProperties.SiteStatus).query({ filter: ["equal", "in"] }),
      jurisdictionId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      firstSeenAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      lastSeenAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "sites",
    [
      { name: "idx_site_code", fields: ["code"], unique: true },
      { name: "idx_site_status", fields: ["status"] },
    ],
  ),
});

const domains = website.schemas({
  /** A hostname a site has used, with the period it was valid. The same hostname may belong to different sites over time. */
  SiteDomain: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      hostname: dryv.field(websiteProperties.Hostname).query({ filter: ["equal", "startsWith"] }),
      scheme: dryv.field(websiteProperties.UrlScheme),
      role: dryv.field(websiteProperties.DomainRole).query({ filter: ["equal", "in"] }),
      validFrom: dryv.field(sharedProperties.Date).query({ filter: ["between"], sort: true }),
      validFromPrecision: dryv.field(sharedProperties.DatePrecision),
      validTo: dryv.field(sharedProperties.Date).optional().nullable(),
      validToPrecision: dryv.field(sharedProperties.DatePrecision).optional().nullable(),
      observedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      status: dryv.field(websiteProperties.DomainStatus).query({ filter: ["equal", "in"] }),
      statusReason: dryv.field(sharedProperties.LongText).optional().nullable(),
      /** How the hostname was found (classification, not provenance). */
      origin: dryv.field(websiteProperties.DomainOrigin).optional().nullable(),
      isApex: dryv.field(sharedProperties.Flag).optional().nullable(),
      parentDomainId: optionalId(),
      zoneId: optionalId(),
      lastProbeAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      lastHttpStatus: dryv.field(websiteProperties.HttpStatus).optional().nullable(),
      redirectTo: dryv.field(sharedProperties.LongText).optional().nullable(),
    },
    "domains",
    [
      { name: "idx_domain_site_host", fields: ["siteId", "hostname", "validFrom"], unique: true },
      { name: "idx_domain_hostname", fields: ["hostname"] },
      { name: "idx_domain_status", fields: ["status"] },
      { name: "idx_domain_zone", fields: ["zoneId"] },
    ],
  ),

  /** A registry zone in use (.go.ke, .or.ke, ...) with its operator, purpose and whether second-level names are open. */
  DomainZone: systemRecord(
    {
      suffix: dryv.field(websiteProperties.Hostname).query({ filter: ["equal"] }),
      parentSuffix: dryv.field(websiteProperties.Hostname).optional().nullable(),
      operator: dryv.field(sharedProperties.LongText).optional().nullable(),
      purpose: dryv.field(sharedProperties.LongText).optional().nullable(),
      secondLevelOpen: dryv.field(sharedProperties.Flag).optional().nullable(),
    },
    "domain_zones",
  ),

  /** A dated DNS lookup for a domain or a zone. Appended, never overwritten. */
  DnsSnapshot: systemRecord(
    {
      domainId: optionalId(),
      zoneId: optionalId(),
      recordType: dryv.field(sharedProperties.LongText),
      values: dryv.field(websiteProperties.JsonText),
      resolver: dryv.field(sharedProperties.LongText).optional().nullable(),
      rcode: dryv.field(sharedProperties.LongText).optional().nullable(),
      observedAt: dryv.field(sharedProperties.DateTime),
    },
    "dns_snapshots",
    [
      { name: "idx_dns_snapshot_domain", fields: ["domainId", "recordType", "observedAt"] },
      { name: "idx_dns_snapshot_zone", fields: ["zoneId", "recordType", "observedAt"] },
    ],
  ),

  /** Many-to-many between sites and source publishers, with a role and validity period. */
  SitePublisher: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      publisherId: plainId(),
      role: dryv.field(websiteProperties.SitePublisherRole).query({ filter: ["equal", "in"] }),
      validFrom: dryv.field(sharedProperties.Date).optional().nullable(),
      validTo: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "site_publishers",
    [
      { name: "idx_sitepublisher_site", fields: ["siteId"] },
      { name: "idx_sitepublisher_publisher", fields: ["publisherId"] },
    ],
  ),
});

const structures = website.schemas({
  /** The logical structure of an owner (a site or a site family) for a purpose; its versions are immutable file sets. */
  Structure: systemRecord(
    {
      ownerKind: dryv.field(websiteProperties.StructureOwnerKind).query({ filter: ["equal"] }),
      ownerId: plainId(),
      purpose: dryv.field(websiteProperties.Purpose).query({ filter: ["equal"] }),
      currentVersionId: optionalId(),
      status: dryv.field(websiteProperties.StructureStatus).query({ filter: ["equal"] }),
    },
    "structures",
    [{ name: "idx_structure_owner", fields: ["ownerKind", "ownerId", "purpose"], unique: true }],
  ),
});

const versions = website.schemas({
  /** One immutable version of a structure: a folder of files in the filesystem schema. A change is a new version. */
  StructureVersion: systemRecord(
    {
      structureId: relationTo(() => structures.Structure.field("id")),
      number: dryv.field(sharedProperties.Version).query({ filter: ["equal"], sort: true }),
      status: dryv.field(websiteProperties.VersionStatus).query({ filter: ["equal", "in"] }),
      folderId: optionalId(),
      manifestHash: dryv.field(sharedProperties.Checksum),
      schemaVersion: dryv.field(websiteProperties.SchemaVersion),
      methodId: optionalId(),
      createdBy: optionalId(),
      /** Validation report as serialised JSON. */
      validationReport: dryv.field(sharedProperties.LongText).optional().nullable(),
      notesSummary: dryv.field(sharedProperties.Description).optional().nullable(),
      supersedesId: optionalId(),
    },
    "structure_versions",
    [{ name: "idx_structureversion_structure", fields: ["structureId", "number"], unique: true }],
  ),
});

const files = website.schemas({
  /** A file of a structure version, with its path inside the bundle and the filesystem file version holding its bytes. */
  StructureFile: systemRecord(
    {
      /** A plain id: a generated relation would be named `version` and collide with the record version column. */
      versionId: plainId(),
      path: dryv.field(websiteProperties.BundlePath).query({ filter: ["equal", "startsWith"] }),
      role: dryv.field(websiteProperties.StructureFileRole).query({ filter: ["equal", "in"] }),
      fileVersionId: plainId(),
    },
    "structure_files",
    [{ name: "idx_structurefile_version_path", fields: ["versionId", "path"], unique: true }],
  ),
});

const checks = website.schemas({
  /** Append-only observation about a site: it was reachable, a structure still fits, or it drifted. */
  SiteCheck: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      structureVersionId: optionalId(),
      kind: dryv.field(websiteProperties.CheckKind).query({ filter: ["equal", "in"] }),
      outcome: dryv.field(websiteProperties.CheckOutcome).query({ filter: ["equal", "in"] }),
      /** Detail as serialised JSON. */
      detail: dryv.field(sharedProperties.LongText).optional().nullable(),
      checkedAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
    },
    "checks",
    [{ name: "idx_check_site", fields: ["siteId", "checkedAt"] }],
  ),
});

const crawling = website.schemas({
  /** Append-only record that a content section of a site was expanded: which section, by which rule, and how many files it led to. */
  SectionVisit: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      structureVersionId: optionalId(),
      sectionLabel: dryv.field(websiteProperties.SectionLabel).query({ filter: ["equal", "in"] }),
      /** Position of the matching rule inside the section's rules; absent when the section was reached by a link, not a rule. */
      ruleIndex: dryv.field(sharedProperties.Count).optional().nullable(),
      /** The page that was fetched for this visit. */
      pageUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      depth: dryv.field(sharedProperties.Count),
      visitedAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
      itemsFound: dryv.field(sharedProperties.Count),
    },
    "section_visits",
    [{ name: "idx_sectionvisit_site_section", fields: ["siteId", "sectionLabel", "visitedAt"] }],
  ),

  /** One URL at which a file was seen, with the response that delivered it. A document seen at several URLs has several sightings. */
  DocumentSighting: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      /** The source.documents row, one per distinct content hash (a plain id: no cross-schema relation). */
      documentId: plainId(),
      captureId: optionalId(),
      structureVersionId: optionalId(),
      url: dryv.field(sharedProperties.Url).query({ filter: ["equal"] }),
      pageUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      contentHash: dryv.field(sharedProperties.Checksum).query({ filter: ["equal"] }),
      sizeBytes: dryv.field(sharedProperties.ByteCount),
      httpStatus: dryv.field(websiteProperties.HttpStatus),
      /** Response headers as serialised JSON. */
      headers: dryv.field(sharedProperties.LongText).optional().nullable(),
      /** The section whose expansion led here first (the leading section). */
      sectionLabel: dryv
        .field(websiteProperties.SectionLabel)
        .optional()
        .nullable()
        .query({ filter: ["equal", "in"] }),
      ruleIndex: dryv.field(sharedProperties.Count).optional().nullable(),
      depth: dryv.field(sharedProperties.Count),
      seenAt: dryv.field(sharedProperties.DateTime).query({ filter: ["between"], sort: true }),
    },
    "document_sightings",
    [
      { name: "idx_sighting_url_hash", fields: ["url", "contentHash"], unique: true },
      { name: "idx_sighting_document", fields: ["documentId"] },
    ],
  ),
});

const families = website.schemas({
  /** A group of sites that share structure, such as county government sites; members inherit the family's base structure. */
  SiteFamily: systemRecord(
    {
      code: dryv.field(sharedProperties.BusinessCode).query(searchable),
      name: dryv.field(sharedProperties.Name).query(searchable),
      kind: dryv.field(websiteProperties.FamilyKind).query({ filter: ["equal", "in"] }),
      /** Classification record describing what members are about (county, ministry, commission). */
      subjectKindId: optionalId(),
      jurisdictionId: optionalId(),
      description: dryv.field(sharedProperties.Description).optional().nullable(),
      status: dryv.field(websiteProperties.FamilyStatus).query({ filter: ["equal", "in"] }),
    },
    "families",
    [{ name: "idx_family_code", fields: ["code"], unique: true }],
  ),
});

const patterns = website.schemas({
  /** A hostname template for a family. It yields candidate domains for expected sites; it never identifies a site. */
  DomainPattern: systemRecord(
    {
      familyId: relationTo(() => families.SiteFamily.field("id")),
      template: dryv.field(websiteProperties.DomainTemplate).query({ filter: ["equal", "contains"] }),
      scheme: dryv.field(websiteProperties.UrlScheme),
      domainRole: dryv.field(websiteProperties.DomainRole),
      /** Slot bindings as serialised JSON: slot name to subject source and slug rule. */
      variables: dryv.field(sharedProperties.LongText),
      status: dryv.field(websiteProperties.PatternStatus).query({ filter: ["equal", "in"] }),
      notes: dryv.field(sharedProperties.Description).optional().nullable(),
    },
    "domain_patterns",
    [{ name: "idx_pattern_family", fields: ["familyId"] }],
  ),
});

const membership = website.schemas({
  SiteMember: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      familyId: plainId(),
      role: dryv.field(websiteProperties.MembershipRole),
      basis: dryv.field(websiteProperties.MembershipBasis).query({ filter: ["equal", "in"] }),
      /** How strongly the assignment holds (0 to 1), not a provenance confidence; claims about the world are attributed in the source schema. */
      score: dryv.field(sharedProperties.Confidence).optional().nullable(),
      methodId: optionalId(),
      validFrom: dryv.field(sharedProperties.Date).optional().nullable(),
      validTo: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "members",
    [
      { name: "idx_member_site", fields: ["siteId"] },
      { name: "idx_member_family", fields: ["familyId"] },
    ],
  ),

  /** What a site is about or serves: a geography unit, governance institution, organization or kind of material. */
  SiteSubject: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      targetKind: dryv.field(sharedProperties.TargetKind).query({ filter: ["equal"] }),
      targetId: plainId(),
      relation: dryv.field(websiteProperties.SubjectRelation).query({ filter: ["equal", "in"] }),
      validFrom: dryv.field(sharedProperties.Date).optional().nullable(),
      validTo: dryv.field(sharedProperties.Date).optional().nullable(),
    },
    "subjects",
    [
      { name: "idx_subject_site", fields: ["siteId"] },
      { name: "idx_subject_target", fields: ["targetKind", "targetId"] },
    ],
  ),
});

const similarity = website.schemas({
  /** A namespaced label for a site or family, assigned by an agent or the engine. */
  SiteTrait: systemRecord(
    {
      ownerKind: dryv.field(websiteProperties.RelationOwnerKind).query({ filter: ["equal"] }),
      ownerId: plainId(),
      tag: dryv.field(websiteProperties.TraitTag).query({ filter: ["equal", "startsWith"] }),
      methodId: optionalId(),
      /** How strongly the assignment holds (0 to 1), not a provenance confidence; claims about the world are attributed in the source schema. */
      score: dryv.field(sharedProperties.Confidence).optional().nullable(),
      observedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
    },
    "traits",
    [
      { name: "idx_trait_owner", fields: ["ownerKind", "ownerId"] },
      { name: "idx_trait_tag", fields: ["tag"] },
    ],
  ),

  /** A similarity or reuse edge between two sites or families. */
  SiteRelation: systemRecord(
    {
      fromKind: dryv.field(websiteProperties.RelationOwnerKind),
      fromId: plainId(),
      toKind: dryv.field(websiteProperties.RelationOwnerKind),
      toId: plainId(),
      relation: dryv.field(websiteProperties.SiteRelationKind).query({ filter: ["equal", "in"] }),
      score: dryv.field(websiteProperties.Score).optional().nullable(),
      basis: dryv.field(websiteProperties.MembershipBasis),
      /** Evidence as serialised JSON. */
      evidence: dryv.field(sharedProperties.LongText).optional().nullable(),
    },
    "relations",
    [
      { name: "idx_relation_from", fields: ["fromKind", "fromId"] },
      { name: "idx_relation_to", fields: ["toKind", "toId"] },
    ],
  ),

  /** A computed signature of how a site is built, used to suggest families and similar sites. */
  SiteFingerprint: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      kind: dryv.field(websiteProperties.FingerprintKind).query({ filter: ["equal", "in"] }),
      digest: dryv.field(sharedProperties.Checksum),
      /** Feature vector as serialised JSON. */
      features: dryv.field(sharedProperties.LongText),
      checkId: optionalId(),
      computedAt: dryv.field(sharedProperties.DateTime).query({ sort: true }),
    },
    "fingerprints",
    [{ name: "idx_fingerprint_site", fields: ["siteId", "kind", "computedAt"] }],
  ),
});

const assessments = website.schemas({
  /**
   * Append-only legal and source assessment of a site (LEGALITY_SAFETY_AND_COMPLIANCE.md section 9).
   * Agents may draft one; approval names a human reviewer. The row with isCurrent is the governing
   * assessment; a change is a new row that supersedes the old one. Not exposed by the public API.
   */
  Assessment: systemRecord(
    {
      siteId: relationTo(() => sites.Site.field("id")),
      jurisdictionId: optionalId(),
      status: dryv.field(websiteProperties.LegalReviewStatus).query({ filter: ["equal", "in"] }),
      sourceType: dryv.field(websiteProperties.AssessmentSourceType),
      accessBasis: dryv.field(websiteProperties.AccessBasis),
      accessConditions: dryv.field(sharedProperties.LongText).optional().nullable(),
      licenceName: dryv.field(sharedProperties.Name).optional().nullable(),
      licenceUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      licenceVersion: dryv.field(sharedProperties.Label).optional().nullable(),
      /** The rights holder, or the explicit word "unknown". */
      rightsHolder: dryv.field(sharedProperties.Name),
      /** JSON array of data categories, including "none_known". */
      personalDataCategories: dryv.field(websiteProperties.JsonText),
      processingPurpose: dryv.field(sharedProperties.Description).optional().nullable(),
      lawfulBasis: dryv.field(sharedProperties.Description).optional().nullable(),
      /** JSON object: hosts, schemes, paths, fetch modes, maximum requests per second, publication scope. */
      approvedScope: dryv.field(websiteProperties.JsonText),
      conditions: dryv.field(websiteProperties.JsonText).optional().nullable(),
      rationale: dryv.field(sharedProperties.LongText).optional().nullable(),
      /** JSON array of evidence references (saved terms, permissions, advice, regulator guidance). */
      evidence: dryv.field(websiteProperties.JsonText).optional().nullable(),
      reviewedBy: optionalId(),
      reviewedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      reviewDueAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      isCurrent: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      supersedesId: optionalId(),
    },
    "assessments",
    [{ name: "idx_assessment_site_current", fields: ["siteId", "isCurrent"] }],
  ),

  /** Per-jurisdiction legal review record; no country moves to production collection without a current one. */
  Dossier: systemRecord(
    {
      jurisdictionId: plainId(),
      regulator: dryv.field(sharedProperties.Name).optional().nullable(),
      legislationRepositoryUrl: dryv.field(sharedProperties.Url).optional().nullable(),
      /** JSON array: law, official text URL, date checked. */
      applicableLaws: dryv.field(websiteProperties.JsonText),
      /** JSON array: instrument, status, date checked. */
      treatyStatus: dryv.field(websiteProperties.JsonText).optional().nullable(),
      launchStage: dryv.field(websiteProperties.LaunchStage).query({ filter: ["equal", "in"] }),
      reviewerId: optionalId(),
      reviewedAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      reviewDueAt: dryv.field(sharedProperties.DateTime).optional().nullable(),
      openQuestions: dryv.field(sharedProperties.LongText).optional().nullable(),
      isCurrent: dryv.field(sharedProperties.Flag).query({ filter: ["equal"] }),
      supersedesId: optionalId(),
    },
    "dossiers",
    [{ name: "idx_dossier_jurisdiction_current", fields: ["jurisdictionId", "isCurrent"] }],
  ),
});

const id = () => dryv.field(sharedProperties.Id).optional();
const websiteRead = website.feature("WebsiteRead").description("Public read access to known sites and their structures.").tags("public");
const surfaces = [
  readSurface(website, {
    singular: "Site",
    plural: "Sites",
    itemKey: "site",
    listKey: "sites",
    path: "/website/sites",
    idParam: "siteId",
    entity: sites.Site,
    description: "known sites",
    filters: {
      jurisdictionId: id(),
      kind: dryv.field(websiteProperties.SiteKind).optional(),
      status: dryv.field(websiteProperties.SiteStatus).optional(),
      q: dryv.field(sharedProperties.Name).optional(),
    },
  }),
  readSurface(website, {
    singular: "SiteDomain",
    plural: "SiteDomains",
    itemKey: "domain",
    listKey: "domains",
    path: "/website/domains",
    idParam: "domainId",
    entity: domains.SiteDomain,
    description: "site domains",
    filters: {
      siteId: id(),
      hostname: dryv.field(websiteProperties.Hostname).optional(),
      role: dryv.field(websiteProperties.DomainRole).optional(),
    },
  }),
  readSurface(website, {
    singular: "SitePublisher",
    plural: "SitePublishers",
    itemKey: "sitePublisher",
    listKey: "sitePublishers",
    path: "/website/site-publishers",
    idParam: "sitePublisherId",
    entity: domains.SitePublisher,
    description: "site and publisher links",
    filters: { siteId: id(), publisherId: id() },
  }),
  readSurface(website, {
    singular: "Structure",
    plural: "Structures",
    itemKey: "structure",
    listKey: "structures",
    path: "/website/structures",
    idParam: "structureId",
    entity: structures.Structure,
    description: "site structures",
    filters: { ownerKind: dryv.field(websiteProperties.StructureOwnerKind).optional(), ownerId: id() },
  }),
  readSurface(website, {
    singular: "StructureVersion",
    plural: "StructureVersions",
    itemKey: "structureVersion",
    listKey: "structureVersions",
    path: "/website/structure-versions",
    idParam: "structureVersionId",
    entity: versions.StructureVersion,
    description: "structure versions",
    filters: { structureId: id(), status: dryv.field(websiteProperties.VersionStatus).optional() },
  }),
  readSurface(website, {
    singular: "StructureFile",
    plural: "StructureFiles",
    itemKey: "structureFile",
    listKey: "structureFiles",
    path: "/website/structure-files",
    idParam: "structureFileId",
    entity: files.StructureFile,
    description: "files of structure versions",
    filters: { versionId: id(), role: dryv.field(websiteProperties.StructureFileRole).optional() },
  }),
  readSurface(website, {
    singular: "SiteFamily",
    plural: "SiteFamilies",
    itemKey: "family",
    listKey: "families",
    path: "/website/families",
    idParam: "familyId",
    entity: families.SiteFamily,
    description: "site families",
    filters: {
      jurisdictionId: id(),
      kind: dryv.field(websiteProperties.FamilyKind).optional(),
      q: dryv.field(sharedProperties.Name).optional(),
    },
  }),
  readSurface(website, {
    singular: "DomainPattern",
    plural: "DomainPatterns",
    itemKey: "domainPattern",
    listKey: "domainPatterns",
    path: "/website/domain-patterns",
    idParam: "domainPatternId",
    entity: patterns.DomainPattern,
    description: "domain patterns",
    filters: { familyId: id(), status: dryv.field(websiteProperties.PatternStatus).optional() },
  }),
  readSurface(website, {
    singular: "SiteMember",
    plural: "SiteMembers",
    itemKey: "siteMember",
    listKey: "siteMembers",
    path: "/website/members",
    idParam: "siteMemberId",
    entity: membership.SiteMember,
    description: "family memberships",
    filters: { siteId: id(), familyId: id() },
  }),
  readSurface(website, {
    singular: "SiteSubject",
    plural: "SiteSubjects",
    itemKey: "siteSubject",
    listKey: "siteSubjects",
    path: "/website/subjects",
    idParam: "siteSubjectId",
    entity: membership.SiteSubject,
    description: "site subjects",
    filters: { siteId: id(), targetKind: dryv.field(sharedProperties.TargetKind).optional(), targetId: id() },
  }),
  readSurface(website, {
    singular: "SiteTrait",
    plural: "SiteTraits",
    itemKey: "siteTrait",
    listKey: "siteTraits",
    path: "/website/traits",
    idParam: "siteTraitId",
    entity: similarity.SiteTrait,
    description: "site and family traits",
    filters: {
      ownerKind: dryv.field(websiteProperties.RelationOwnerKind).optional(),
      ownerId: id(),
      tag: dryv.field(websiteProperties.TraitTag).optional(),
    },
  }),
  readSurface(website, {
    singular: "SiteRelation",
    plural: "SiteRelations",
    itemKey: "siteRelation",
    listKey: "siteRelations",
    path: "/website/relations",
    idParam: "siteRelationId",
    entity: similarity.SiteRelation,
    description: "site and family relations",
    filters: { fromId: id(), toId: id(), relation: dryv.field(websiteProperties.SiteRelationKind).optional() },
  }),
  readSurface(website, {
    singular: "SiteFingerprint",
    plural: "SiteFingerprints",
    itemKey: "siteFingerprint",
    listKey: "siteFingerprints",
    path: "/website/fingerprints",
    idParam: "siteFingerprintId",
    entity: similarity.SiteFingerprint,
    description: "site fingerprints",
    filters: { siteId: id(), kind: dryv.field(websiteProperties.FingerprintKind).optional() },
  }),
  readSurface(website, {
    singular: "SiteCheck",
    plural: "SiteChecks",
    itemKey: "siteCheck",
    listKey: "siteChecks",
    path: "/website/checks",
    idParam: "siteCheckId",
    entity: checks.SiteCheck,
    description: "site checks",
    filters: {
      siteId: id(),
      kind: dryv.field(websiteProperties.CheckKind).optional(),
      outcome: dryv.field(websiteProperties.CheckOutcome).optional(),
    },
  }),
];
export const websiteReadOperations = websiteRead.operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
