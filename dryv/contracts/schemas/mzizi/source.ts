/**
 * Schema: source | Database: mzizi
 * Implementation authorized by the Main/Operations handoff, 12 November 2026.
 * Owns accepted publication channels, immutable captures, evidence and manifest releases.
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
  ReleaseStatus: dryv.property.enum({ Approved: "approved", Retired: "retired", Withdrawn: "withdrawn" }),
  VerificationOutcome: dryv.property.enum({
    Supported: "supported",
    Contradicted: "contradicted",
    Insufficient: "insufficient",
    Disputed: "disputed",
  }),
});

export const Publishers = source
  .schema("Publishers", {
    name: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    officialEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Accepted publisher; an optional official identity distinguishes organization from publication channel.")
  .role("entity")
  .facets({
    storage: dryv.storage("publishers").index("kindId").index("countryId"),
  });

export const Sources = source
  .schema("Sources", {
    publisherId: belongsTo(() => Publishers),
    kindId: belongsTo(() => Value),
    officialEntityId: belongsTo(() => Entities).maybe(),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable publication-channel identity independent of any public website.")
  .role("entity")
  .facets({
    storage: dryv.storage("sources").index("publisherId").index("kindId"),
  });

export const Websites = source
  .schema("Websites", {
    sourceId: belongsTo(() => Sources),
    canonicalUrl: dryv.field(sharedProperties.Url),
    title: dryv.field(sharedProperties.Name),
  })
  .extends(baseSchemas.Entity)
  .description("Website-specific identity attached to a source channel.")
  .role("entity")
  .facets({
    storage: dryv.storage("websites").unique("sourceId").unique("canonicalUrl"),
  });

export const Apis = source
  .schema("Apis", {
    sourceId: belongsTo(() => Sources),
    baseUrl: dryv.field(sharedProperties.Url),
    credentialBinding: dryv.field(sharedProperties.NonEmptyString255).maybe(),
  })
  .extends(baseSchemas.Entity)
  .description("API channel with named credential binding only; request behavior is pinned in manifest releases.")
  .role("entity")
  .facets({
    storage: dryv.storage("apis").unique("sourceId"),
  });

export const Documents = source
  .schema("Documents", {
    sourceId: belongsTo(() => Sources),
    publisherId: belongsTo(() => Publishers),
    kindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    canonicalUrl: dryv.field(sharedProperties.Url).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable published document identity; repeated captures retain independent retrieval history.")
  .role("entity")
  .facets({
    storage: dryv.storage("documents").index("sourceId").index("publisherId").index("kindId"),
  });

export const Manifests = source
  .schema("Manifests", {
    title: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Stable API, website or extraction configuration identity; contents remain versioned artifacts.")
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
  .rule("EffectiveWindowIsOrdered", rule.ordered("effectiveFrom", "effectiveUntil"))
  .description("Pinned approved manifest content; schema and capabilities are immutable release inputs.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("manifest_releases")
      .noOverlap("NoOverlappingReleases", { scope: ["manifestId"], from: "effectiveFrom", until: "effectiveUntil" })
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
  .rule("EffectiveWindowIsOrdered", rule.ordered("effectiveFrom", "effectiveUntil"))
  .description("Dated release binding; activation never changes releases already pinned by running jobs.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("manifest_bindings")
      .noOverlap("NoOverlappingBindings", { scope: ["sourceId"], from: "effectiveFrom", until: "effectiveUntil" })
      .unique("sourceId", "manifestReleaseId", "effectiveFrom")
      .index("manifestReleaseId"),
  });

export const Captures = source
  .schema("Captures", {
    sourceId: belongsTo(() => Sources),
    documentId: belongsTo(() => Documents).maybe(),
    fileVersionId: belongsTo(() => FileVersions),
    manifestReleaseId: belongsTo(() => ManifestReleases).maybe(),
    retrievedUrl: dryv.field(sharedProperties.Url),
    retrievedAt: dryv.field(sharedProperties.Instant),
    contentHash: dryv.field(sharedProperties.Sha256),
    responseMetadata: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.Entity)
  .description("Immutable accepted retrieval snapshot with exact bytes; failed requests remain in Operations.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("captures")
      .references("DocumentBelongsToSource", {
        fields: ["documentId", "sourceId"],
        target: () => Documents,
        targetFields: ["id", "sourceId"],
      })
      .index("sourceId")
      .index("documentId")
      .index("fileVersionId")
      .index("manifestReleaseId"),
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
  .description("Durable evidence bundle whose exact supporting items are normalized citations.")
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
  .extends(baseSchemas.Entity)
  .description("Exact locator in immutable bytes: PDF page/paragraph, JSON path, CSV row/column, region, timestamp or dataset record.")
  .role("entity")
  .facets({
    storage: dryv.storage("citations").index("evidenceId").index("documentId").index("captureId").index("fileVersionId").index("locatorKindId"),
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
  .extends(baseSchemas.Entity)
  .description("Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes.")
  .role("entity")
  .facets({
    storage: dryv.storage("verifications").index("evidenceId").index("methodId").index("supersedesId"),
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
  .extends(baseSchemas.Entity)
  .description("Accepted rights and credit statement tied to exact content and publisher.")
  .role("entity")
  .facets({
    storage: dryv.storage("attributions").index("publisherId").index("fileVersionId").index("licenseValueId"),
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
  .extends(baseSchemas.Entity)
  .description(
    "Immutable Main acknowledgement committed atomically with accepted records and provenance. Same-key different-hash retries must conflict.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("publication_receipts").unique("idempotencyKey").unique("publicationRefId"),
  });

/** Open: scheme-aware value membership; immutable releases, captures and assessments; capture/file
 * ownership (documents carry no file link); same-key/hash replay and atomic receipt/provenance writes.
 * publicationRefId refers to Operations and must never become a PostgreSQL cross-database FK.
 */
