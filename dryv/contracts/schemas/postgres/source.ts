/**
 * Schema: source | Database: mzizi
 * Implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns publication channels (websites, APIs), their domains and paths, content documents, captures, datasets and their lineage, record provenance, evidence and manifest releases.
 * Design: .docs/_plan/schema-redesign/mzizi-db/phase-01/source.md
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { FileVersions } from "./filesystem.ts";
import { Entities } from "./official.ts";
import { Country, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const source = dryv
  .group({ name: "source" })
  .description("Accepted sources, evidence and publication receipts.")
  .facets({ storage: { namespace: "source", store: "main" } });
export const sourceEnums = source.properties({
  ReleaseStatus: dryv.property.enum(["approved", "retired", "withdrawn"]),
  VerificationOutcome: dryv.property.enum([
    "supported",
    "contradicted",
    "insufficient",
    "disputed",
  ]),
  /** A real website (pages and files), a real API (endpoints), or a dataset: files or data obtained from somewhere that is neither. */
  SourceKind: dryv.property.enum(["website", "api", "dataset"]),
  PathKind: dryv.property.enum(["page", "listing", "file", "endpoint"]),
  HttpMethod: dryv.property.enum(["GET", "HEAD", "POST"]),
  /** A dataset is taken as downloaded, assembled from other inputs, or authored by hand. */
  DatasetAssembly: dryv.property.enum([
    "as-downloaded",
    "assembled",
    "authored",
  ]),
  LineageRole: dryv.property.enum(["raw", "derived", "lookup"]),
});

export const Publishers = source
  .schema("Publishers", {
    name: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    officialEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Accepted publisher; an optional official identity distinguishes organization from publication channel.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("publishers").index("kindId").index("countryId"),
  });

export const Sources = source
  .schema("Sources", {
    publisherId: belongsTo(() => Publishers),
    kind: dryv.field(sourceEnums.SourceKind),
    officialEntityId: belongsTo(() => Entities).maybe(),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description).maybe(),
    /** For an API: the named credential binding only; request behavior is pinned in manifest releases. */
    credentialBinding: dryv.field(sharedProperties.NonEmptyString255).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A publication channel, named by anything but its domain: a real website, a real API, or a dataset (files or data obtained from somewhere that is neither). Only websites and APIs have domains and paths; the dataset tables record what we prepared from sources.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("sources").index("publisherId").index("kind"),
  });

export const Domains = source
  .schema("Domains", {
    sourceId: belongsTo(() => Sources),
    host: dryv.field(sharedProperties.NonEmptyString255),
  })
  .extends(baseSchemas.CodedValidityEntity)
  .description(
    "A host name a source is served from. A source can have several over time, and a domain keeps its own validity period.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("domains").unique("host").index("sourceId"),
  });

export const Paths = source
  .schema("Paths", {
    domainId: belongsTo(() => Domains),
    /** The path and query exactly as requested, starting with a slash. */
    path: dryv.field(sharedProperties.NonEmptyString1000),
    kind: dryv.field(sourceEnums.PathKind),
    /** For an API endpoint. */
    method: dryv.field(sourceEnums.HttpMethod).maybe(),
    /** What was obtained at this path and anything worth knowing about it. */
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A page, listing, file or API endpoint on a domain; captures hang off it.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("paths").unique("domainId", "path").index("domainId"),
  });

export const Documents = source
  .schema("Documents", {
    /** One row per distinct content, whoever served it; many captures can point here. */
    sha256: dryv.field(sharedProperties.Sha256),
    publisherId: belongsTo(() => Publishers).maybe(),
    kindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    contentType: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    sizeBytes: dryv.field(sharedProperties.PositiveInteger).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** The stored bytes in the filesystem; empty until the file is preserved. */
    fileVersionId: belongsTo(() => FileVersions).maybe(),
    /** The archive this document came out of, when it is a member of a zip or tar. */
    parentId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A distinct piece of content identified by its sha256. The same file fetched from many sources is one document with many captures.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("documents")
      .unique("sha256")
      .index("publisherId")
      .index("kindId")
      .index("fileVersionId")
      .index("parentId"),
  });

export const Manifests = source
  .schema("Manifests", {
    title: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Stable API, website or extraction configuration identity; contents remain versioned artifacts.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("manifests").index("kindId"),
  });

export const ManifestReleases = source
  .schema("ManifestReleases", {
    manifestId: belongsTo(() => Manifests),
    releaseLabel: dryv.field(sharedProperties.NonEmptyString100),
    fileVersionId: belongsTo(() => FileVersions),
    contentHash: dryv.field(sharedProperties.Sha256),
    inputSchemaCode: dryv.field(sharedProperties.IdentityCode),
    inputSchemaVersion: dryv.field(sharedProperties.NonEmptyString100),
    requiredCapabilities: dryv.field(sharedProperties.JsonText),
    approvedBySnapshot: dryv.field(sharedProperties.JsonText),
    approvedAt: dryv.field(sharedProperties.Instant),
    effectiveFrom: dryv.field(sharedProperties.Instant),
    effectiveUntil: dryv.field(sharedProperties.Instant).maybe(),
    status: dryv.field(sourceEnums.ReleaseStatus),
  })
  .extends(baseSchemas.Entity)
  .rule(
    "EffectiveWindowIsOrdered",
    rule.ordered("effectiveFrom", "effectiveUntil"),
  )
  .description(
    "Pinned approved manifest content; schema and capabilities are immutable release inputs.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("manifest_releases")
      .noOverlap("NoOverlappingReleases", {
        scope: ["manifestId"],
        from: "effectiveFrom",
        until: "effectiveUntil",
      })
      .unique("manifestId", "releaseLabel")
      .index("fileVersionId"),
  });

export const ManifestBindings = source
  .schema("ManifestBindings", {
    sourceId: belongsTo(() => Sources),
    manifestReleaseId: belongsTo(() => ManifestReleases),
    activatedAt: dryv.field(sharedProperties.Instant),
    deactivatedAt: dryv.field(sharedProperties.Instant).maybe(),
    effectiveFrom: dryv.field(sharedProperties.Instant),
    effectiveUntil: dryv.field(sharedProperties.Instant).maybe(),
  })
  .extends(baseSchemas.Entity)
  .rule(
    "EffectiveWindowIsOrdered",
    rule.ordered("effectiveFrom", "effectiveUntil"),
  )
  .description(
    "Dated release binding; activation never changes releases already pinned by running jobs.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("manifest_bindings")
      .noOverlap("NoOverlappingBindings", {
        scope: ["sourceId"],
        from: "effectiveFrom",
        until: "effectiveUntil",
      })
      .unique("sourceId", "manifestReleaseId", "effectiveFrom")
      .index("manifestReleaseId"),
  });

export const Captures = source
  .schema("Captures", {
    sourceId: belongsTo(() => Sources),
    pathId: belongsTo(() => Paths).maybe(),
    /** The content obtained; empty until the bytes are downloaded and hashed. */
    documentId: belongsTo(() => Documents).maybe(),
    manifestReleaseId: belongsTo(() => ManifestReleases).maybe(),
    /** The link exactly as found. */
    originalUrl: dryv.field(sharedProperties.Url),
    /** The address finally fetched after redirects. */
    retrievedUrl: dryv.field(sharedProperties.Url).maybe(),
    retrievedAt: dryv.field(sharedProperties.Instant),
    responseMetadata: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One retrieval of a path by a source: when, from which link, with what response. The content is a document, shared by every capture of the same bytes; failed requests remain in Operations.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("captures")
      .index("sourceId")
      .index("pathId")
      .index("documentId")
      .index("manifestReleaseId"),
  });

export const Datasets = source
  .schema("Datasets", {
    title: dryv.field(sharedProperties.Name),
    /** csv, geojson, xlsx, json and so on. */
    format: dryv.field(sharedProperties.NonEmptyString100),
    categoryId: belongsTo(() => Value).maybe(),
    assembly: dryv.field(sourceEnums.DatasetAssembly),
    /** Where the dataset lives in the repository (a seed CSV) or the store. */
    location: dryv.field(sharedProperties.NonEmptyString1000).maybe(),
    sha256: dryv.field(sharedProperties.Sha256).maybe(),
    fileVersionId: belongsTo(() => FileVersions).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("datasets")
      .index("categoryId")
      .index("fileVersionId"),
  });

export const DatasetLineage = source
  .schema("DatasetLineage", {
    datasetId: belongsTo(() => Datasets),
    /** Exactly one of the three inputs is set. */
    inputDatasetId: belongsTo(() => Datasets).maybe(),
    inputDocumentId: belongsTo(() => Documents).maybe(),
    inputCaptureId: belongsTo(() => Captures).maybe(),
    role: dryv.field(sourceEnums.LineageRole),
    /** How the input was used to prepare the dataset. */
    method: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "What a dataset was prepared from: a capture, a document or another dataset, with the role and method.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("dataset_lineage")
      .unique(
        "datasetId",
        "inputDatasetId",
        "inputDocumentId",
        "inputCaptureId",
      )
      .index("datasetId")
      .index("inputDatasetId")
      .index("inputDocumentId")
      .index("inputCaptureId"),
  });

export const Provenance = source
  .schema("Provenance", {
    /** The table of the record, such as geography.features. A plain name: the target varies, so this is not a foreign key. */
    tableName: dryv.field(sharedProperties.NonEmptyString100),
    recordId: dryv.field(sharedProperties.Id),
    /** The dataset (usually the seed CSV) the record was loaded from. */
    datasetId: belongsTo(() => Datasets),
    /** The line of the CSV, counting the header as line 1. */
    line: dryv.field(sharedProperties.PositiveInteger).maybe(),
    /** One column when only that value is sourced here. */
    columnName: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    /** A finer link to where the record was found. */
    captureId: belongsTo(() => Captures).maybe(),
    documentId: belongsTo(() => Documents).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description(
    "Where a record in any table came from. The loader writes one row for every seeded record, so a record's origin is a query: its dataset, the lines of the CSV and the inputs the dataset came from.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("provenance")
      .unique("tableName", "recordId", "datasetId", "line")
      .index("tableName", "recordId")
      .index("datasetId")
      .index("captureId")
      .index("documentId"),
  });

export const Evidence = source
  .schema("Evidence", {
    kindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description).maybe(),
    assembledAt: dryv.field(sharedProperties.Instant),
    assembledBySnapshot: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Durable evidence bundle whose exact supporting items are normalized citations.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("evidence").index("kindId"),
  });

export const Citations = source
  .schema("Citations", {
    evidenceId: belongsTo(() => Evidence),
    documentId: belongsTo(() => Documents).maybe(),
    captureId: belongsTo(() => Captures).maybe(),
    fileVersionId: belongsTo(() => FileVersions),
    locatorKindId: belongsTo(() => Value),
    locator: dryv.field(sharedProperties.JsonText),
    quotedHash: dryv.field(sharedProperties.Sha256).maybe(),
    recordedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("citations")
      .index("evidenceId")
      .index("documentId")
      .index("captureId")
      .index("fileVersionId")
      .index("locatorKindId"),
  });

export const Verifications = source
  .schema("Verifications", {
    evidenceId: belongsTo(() => Evidence),
    methodId: belongsTo(() => Value),
    outcome: dryv.field(sourceEnums.VerificationOutcome),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    explanation: dryv.field(sharedProperties.Description),
    reviewerSnapshot: dryv.field(sharedProperties.JsonText),
    assessedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("verifications")
      .index("evidenceId")
      .index("methodId")
      .index("supersedesId"),
  });

export const Attributions = source
  .schema("Attributions", {
    publisherId: belongsTo(() => Publishers),
    fileVersionId: belongsTo(() => FileVersions),
    licenseValueId: belongsTo(() => Value).maybe(),
    credit: dryv.field(sharedProperties.NonEmptyString1000),
    rightsStatement: dryv.field(sharedProperties.Description),
    assessedAt: dryv.field(sharedProperties.Instant),
    assessorSnapshot: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Accepted rights and credit statement tied to exact content and publisher.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("attributions")
      .index("publisherId")
      .index("fileVersionId")
      .index("licenseValueId"),
  });

export const PublicationReceipts = source
  .schema("PublicationReceipts", {
    publicationRefId: dryv.field(sharedProperties.Id),
    idempotencyKey: dryv.field(sharedProperties.NonEmptyString255),
    requestHash: dryv.field(sharedProperties.Sha256),
    payloadHash: dryv.field(sharedProperties.Sha256),
    contractVersion: dryv.field(sharedProperties.NonEmptyString255),
    publishedAt: dryv.field(sharedProperties.Instant),
    actorSnapshot: dryv.field(sharedProperties.JsonText),
    resultManifest: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("publication_receipts")
      .unique("idempotencyKey")
      .unique("publicationRefId"),
  });

/** Open: scheme-aware value membership; immutable releases, captures and assessments; same-key/hash replay and
 * atomic receipt/provenance writes; provenance rows are checked by the loader, not a foreign key.
 * publicationRefId refers to Operations and must never become a PostgreSQL cross-database FK.
 */
