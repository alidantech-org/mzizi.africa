import * as dryv from "@dryvcode/author";

import { optionalId, plainId, relationTo, searchable, systemRecord } from "../../foundation/shared/builders.ts";
import { readSurface } from "../../foundation/shared/read-surface.ts";
import { sharedProperties } from "../../foundation/shared/index.ts";

/**
 * Known sites and their versioned structures (WEBSITE_DESIGN.md).
 *
 * A site has its own stable id: a domain is a dated attribute, never an identifier, and a site is
 * not a publisher (they relate many-to-many). A structure is a set of files in the filesystem
 * schema, one folder per immutable version, mostly authored by agents. References to other schemas
 * are plain ids checked by the database engine's integrity jobs.
 */
export const website = dryv.group({ name: "website" }).description("Known sites, their domains, publisher links, structure versions and checks.").tags("public", "website").facets({ storage: { namespace: "website" } });

export const websiteProperties = website.properties({
  SiteKind: dryv.property.enum({ portal: "portal", publication: "publication", api: "api", datasetCatalogue: "dataset_catalogue", archive: "archive", other: "other" }),
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
  UrlScheme: dryv.property.enum({ http: "http", https: "https" }),
  SitePublisherRole: dryv.property.enum({ owner: "owner", operator: "operator", hosted: "hosted" }),
  StructureOwnerKind: dryv.property.enum({ site: "site", family: "family" }),
  StructureStatus: dryv.property.enum({ active: "active", retired: "retired" }),
  VersionStatus: dryv.property.enum({ draft: "draft", validated: "validated", active: "active", superseded: "superseded", rejected: "rejected" }),
  StructureFileRole: dryv.property.enum({ manifest: "manifest", module: "module", mapping: "mapping", tags: "tags", notes: "notes", example: "example" }),
  CheckKind: dryv.property.enum({ reachability: "reachability", fit: "fit", drift: "drift" }),
  CheckOutcome: dryv.property.enum({ ok: "ok", degraded: "degraded", failed: "failed" }),
  Hostname: dryv.property.string().length({ min: 1, max: 253 }),
  BundlePath: dryv.property.string().length({ min: 1, max: 500 }),
  SchemaVersion: dryv.property.string().length({ min: 1, max: 60 }),
  Purpose: dryv.property.string().length({ min: 1, max: 100 }),
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
    },
    "domains",
    [
      { name: "idx_domain_site_host", fields: ["siteId", "hostname", "validFrom"], unique: true },
      { name: "idx_domain_hostname", fields: ["hostname"] },
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

const id = () => dryv.field(sharedProperties.Id).optional();
const websiteRead = website.feature("WebsiteRead").description("Public read access to known sites and their structures.").tags("public");
const surfaces = [
  readSurface(website, { singular: "Site", plural: "Sites", itemKey: "site", listKey: "sites", path: "/website/sites", idParam: "siteId", entity: sites.Site, description: "known sites", filters: { jurisdictionId: id(), kind: dryv.field(websiteProperties.SiteKind).optional(), status: dryv.field(websiteProperties.SiteStatus).optional(), q: dryv.field(sharedProperties.Name).optional() } }),
  readSurface(website, { singular: "SiteDomain", plural: "SiteDomains", itemKey: "domain", listKey: "domains", path: "/website/domains", idParam: "domainId", entity: domains.SiteDomain, description: "site domains", filters: { siteId: id(), hostname: dryv.field(websiteProperties.Hostname).optional(), role: dryv.field(websiteProperties.DomainRole).optional() } }),
  readSurface(website, { singular: "SitePublisher", plural: "SitePublishers", itemKey: "sitePublisher", listKey: "sitePublishers", path: "/website/site-publishers", idParam: "sitePublisherId", entity: domains.SitePublisher, description: "site and publisher links", filters: { siteId: id(), publisherId: id() } }),
  readSurface(website, { singular: "Structure", plural: "Structures", itemKey: "structure", listKey: "structures", path: "/website/structures", idParam: "structureId", entity: structures.Structure, description: "site structures", filters: { ownerKind: dryv.field(websiteProperties.StructureOwnerKind).optional(), ownerId: id() } }),
  readSurface(website, { singular: "StructureVersion", plural: "StructureVersions", itemKey: "structureVersion", listKey: "structureVersions", path: "/website/structure-versions", idParam: "structureVersionId", entity: versions.StructureVersion, description: "structure versions", filters: { structureId: id(), status: dryv.field(websiteProperties.VersionStatus).optional() } }),
  readSurface(website, { singular: "StructureFile", plural: "StructureFiles", itemKey: "structureFile", listKey: "structureFiles", path: "/website/structure-files", idParam: "structureFileId", entity: files.StructureFile, description: "files of structure versions", filters: { versionId: id(), role: dryv.field(websiteProperties.StructureFileRole).optional() } }),
  readSurface(website, { singular: "SiteCheck", plural: "SiteChecks", itemKey: "siteCheck", listKey: "siteChecks", path: "/website/checks", idParam: "siteCheckId", entity: checks.SiteCheck, description: "site checks", filters: { siteId: id(), kind: dryv.field(websiteProperties.CheckKind).optional(), outcome: dryv.field(websiteProperties.CheckOutcome).optional() } }),
];
export const websiteReadOperations = websiteRead.operations(Object.assign({}, ...surfaces.map((surface) => surface.operations)));
