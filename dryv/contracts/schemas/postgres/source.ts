/**
 * Schema: source | Database: mzizi
 * Design: .docs/design/data/FOUNDATION_REDESIGN.md sections 23 and 34 (approved 2026-11-25).
 * Contract authors: no domain table has a provenance column; `source.evidence` links citations to any row by subject
 * columns, with no foreign key by design (Mzizi's write code checks the row exists; a sweep finds orphans).
 * `captures` and `discoveries` are range-partitioned by month and `evidence` list-partitioned by subject table, so links
 * into them carry their partition key.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { periodFields } from "#/schemas/_periods.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { subjectFields } from "#/schemas/_subjects.ts";
import { belongsTo, byMonth, identity, identityKindField, identityReference, term } from "./_links.ts";
import { Accounts } from "./auth.ts";
import { Versions } from "./filesystem.ts";
import { Features } from "./geography.ts";
import { Templates } from "./governance.ts";
import { Contacts } from "./official.ts";
import { Countries, Languages, Levels } from "./reference.ts";

export const source = dryv
  .group({ name: "source" })
  .description(
    "Where everything came from: publishers, sources, domains, paths, discoveries, products, editions, artifacts, captures, derivations, citations, evidence, verifications, attributions, coverage and disputes.",
  )
  .facets({ storage: { namespace: "source", store: "main" } });

export const sourceEnums = source.properties({
  SourceKind: dryv.property.enum(["website", "api", "portal", "feed"]),
  PathKind: dryv.property.enum(["page", "listing", "file", "feed", "api"]),
  HttpMethod: dryv.property.enum(["GET", "HEAD", "POST"]),
  VerificationOutcome: dryv.property.enum(["supported", "contradicted", "insufficient", "disputed"]),
  EvidenceRole: dryv.property.enum(["origin", "supports", "contradicts"]),
  EvidenceMethod: dryv.property.enum(["manual", "extracted", "matched", "modelled"]),
  Label: dryv.property.string().length({ min: 1, max: 255 }),
  Note: dryv.property.string().length({ min: 1, max: 4000 }),
  ColumnName: dryv.property.string().length({ min: 1, max: 63 }),
  Locator: dryv.property.string().length({ min: 1, max: 4000 }),
  Etag: dryv.property.string().length({ min: 1, max: 1000 }),
});

const note = {
  note: dryv.field(sourceEnums.Note).maybe().description("Optional note, written in `note_language_id`."),
  noteLanguageId: belongsTo(() => Languages).maybe(),
};

/*---------------- source.publishers ----------------*/
export const Publishers = source
  .schema("Publishers", {
    identityKind: identityKindField("entity"),
    kindTerm: term("src.publisher.kind", "government, statistics office, news organisation, international body."),
    classTerm: term("src.publisher.class", "official, independent, commercial.").maybe(),
    countryId: belongsTo(() => Countries).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("PublisherKind", (v) => v.identityKind.eq("entity"))
  .description("Who publishes; a publisher shares its organisation's identity (`official.entities`).")
  .role("entity")
  .facets({ storage: dryv.storage("publishers").index("countryId").references("PublisherIsIdentity", identityReference) });

/*---------------- source.sources ----------------*/
export const Sources = source
  .schema("Sources", {
    publisherId: belongsTo(() => Publishers),
    label: dryv.field(sourceEnums.Label).description("Internal English technical name; sources are not identities."),
    kind: dryv.field(sourceEnums.SourceKind).description("website, api, portal or feed."),
    classTerm: term("src.source.class", "Kind of channel (gazette, statistics portal).").maybe(),
    credibilityTerm: term("src.credibility", "How far the channel is trusted.").maybe(),
    licenceTerm: term("src.licence", "Default licence of the channel's material.").maybe(),
    termsUrl: dryv.field(sharedProperties.Url).maybe(),
    credentialBinding: dryv
      .field(sharedProperties.NonEmptyString255)
      .maybe()
      .description("The name of a secret setting for authenticated access; never the secret itself."),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A publication channel of a publisher.")
  .role("entity")
  .facets({ storage: dryv.storage("sources").index("publisherId") });

/*---------------- source.domains ----------------*/
export const Domains = source
  .schema("Domains", {
    sourceId: belongsTo(() => Sources).maybe(),
    host: dryv.field(sharedProperties.NonEmptyString255),
    statusTerm: term("src.domain.status", "live, moved, unreachable, retired."),
    ownerId: identity("Who owns the domain.").maybe(),
    contactId: belongsTo(() => Contacts).maybe(),
    templateId: belongsTo(() => Templates)
      .maybe()
      .description("The governance template that expected this domain."),
    lastCheckedAt: dryv.field(sharedProperties.Instant).maybe(),
    ...periodFields,
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A host name a source publishes on.")
  .role("entity")
  .facets({ storage: dryv.storage("domains").unique("host").index("sourceId").index("ownerId") });

/*---------------- source.paths ----------------*/
export const Paths = source
  .schema("Paths", {
    domainId: belongsTo(() => Domains, { onDelete: "cascade" }),
    kind: dryv.field(sourceEnums.PathKind).description("page, listing, file, feed or api."),
    path: dryv.field(sharedProperties.NonEmptyString1000).description("Location on the domain (/path1/path2)."),
    query: dryv.field(sharedProperties.NonEmptyString1000).maybe(),
    method: dryv.field(sourceEnums.HttpMethod).description("HTTP method; pages are fetched with GET."),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .description("Any location on a domain: a page, listing, file, feed or API endpoint.")
  .role("entity")
  .facets({ storage: dryv.storage("paths").index("domainId", "path") });

/*---------------- source.discoveries ----------------*/
export const Discoveries = source
  .schema("Discoveries", {
    pathId: belongsTo(() => Paths).maybe(),
    observedUrl: dryv.field(sharedProperties.Url),
    foundOnId: belongsTo(() => Paths)
      .maybe()
      .description("The path the link was found on."),
    sourceId: belongsTo(() => Sources).maybe(),
    anchorText: dryv.field(sharedProperties.NullableString1000).maybe(),
    context: dryv.field(sharedProperties.Description).maybe(),
    discoveredAt: dryv.field(sharedProperties.Instant).description("Partition key."),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description("A link found while crawling.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("discoveries")
      .partitioning(byMonth("discoveries", "discoveredAt"))
      .primaryKey("id", "discoveredAt")
      .index("pathId")
      .index("sourceId"),
  });

/*---------------- source.products ----------------*/
export const Products = source
  .schema("Products", {
    identityKind: identityKindField("product"),
    kindTerm: term("src.product.kind", "report series, dataset, gazette, bulletin."),
    publisherId: belongsTo(() => Publishers).maybe(),
  })
  .extends(baseSchemas.IdentityEntity)
  .rule("ProductKind", (v) => v.identityKind.eq("product"))
  .description("A publisher's series (the Economic Survey). Its titles are `identity.names`.")
  .role("entity")
  .facets({ storage: dryv.storage("products").index("publisherId").references("ProductIsIdentity", identityReference) });

/*---------------- source.editions ----------------*/
export const Editions = source
  .schema("Editions", {
    productId: belongsTo(() => Products),
    designation: dryv.field(sharedProperties.NonEmptyString255).description("The issue's label (2024)."),
    languageId: belongsTo(() => Languages).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("One issue of a product.")
  .role("entity")
  .facets({ storage: dryv.storage("editions").unique("productId", "designation", "languageId") });

/*---------------- source.artifacts ----------------*/
export const Artifacts = source
  .schema("Artifacts", {
    editionId: belongsTo(() => Editions).maybe(),
    versionId: belongsTo(() => Versions).description("The bytes as obtained; hash, format and size are on the version."),
    parentId: belongsTo(dryv.self).maybe().description("The artifact this one was unpacked from."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("ArtifactIsNotItsOwnParent", rule.differs("id", "parentId"))
  .description("The bytes as obtained, through a filesystem version.")
  .role("entity")
  .facets({ storage: dryv.storage("artifacts").index("editionId").index("versionId").index("parentId") });

/*---------------- source.captures ----------------*/
export const Captures = source
  .schema("Captures", {
    sourceId: belongsTo(() => Sources).maybe(),
    pathId: belongsTo(() => Paths).maybe(),
    discoveryId: dryv.field(sharedProperties.Id).maybe(),
    discoveredAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .description("With `discovery_id`, the discovery's partition key."),
    artifactId: belongsTo(() => Artifacts).maybe(),
    originalUrl: dryv.field(sharedProperties.Url),
    retrievedUrl: dryv.field(sharedProperties.Url).maybe(),
    retrievedAt: dryv.field(sharedProperties.Instant).description("Partition key: when the fetch happened."),
    statusCode: dryv.field(sharedProperties.HttpStatus).maybe(),
    etag: dryv.field(sourceEnums.Etag).maybe(),
    lastModified: dryv.field(sharedProperties.Instant).maybe(),
    contentType: dryv.field(sharedProperties.NonEmptyString255).maybe(),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description("One fetch of a path.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("captures")
      .partitioning(byMonth("captures", "retrievedAt"))
      .primaryKey("id", "retrievedAt")
      .index("pathId")
      .index("sourceId")
      .index("artifactId")
      .references("CaptureOfDiscovery", {
        fields: ["discoveryId", "discoveredAt"],
        target: () => Discoveries,
        targetFields: ["id", "discoveredAt"],
      }),
  });

/*---------------- source.derivations ----------------*/
export const Derivations = source
  .schema("Derivations", {
    kindTerm: term("src.derivation.kind", "extracted, converted, unpacked, cleaned."),
    outputArtifactId: belongsTo(() => Artifacts).maybe(),
    outputEditionId: belongsTo(() => Editions).maybe(),
    outputVersionId: belongsTo(() => Versions).maybe(),
    inputArtifactId: belongsTo(() => Artifacts).maybe(),
    inputEditionId: belongsTo(() => Editions).maybe(),
    inputVersionId: belongsTo(() => Versions).maybe(),
    method: dryv.field(sharedProperties.Description).maybe().description("How the output was made (tool and settings)."),
    run: dryv.field(sharedProperties.NonEmptyString255).maybe().description("The engine run that made it."),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("DerivationHasOneOutput", rule.exactlyOne("outputArtifactId", "outputEditionId", "outputVersionId"))
  .rule("DerivationHasOneInput", rule.exactlyOne("inputArtifactId", "inputEditionId", "inputVersionId"))
  .description("Lineage: which artifact, edition or file version was made from which.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("derivations")
      .index("outputArtifactId")
      .index("inputArtifactId")
      .index("outputVersionId")
      .index("inputVersionId"),
  });

/*---------------- source.citations ----------------*/
export const Citations = source
  .schema("Citations", {
    artifactId: belongsTo(() => Artifacts).maybe(),
    captureId: dryv.field(sharedProperties.Id).maybe(),
    retrievedAt: dryv.field(sharedProperties.Instant).maybe().description("With `capture_id`, the capture's partition key."),
    pathId: belongsTo(() => Paths).maybe(),
    locatorTerm: term("src.locator", "page, paragraph, JSON path, CSV cell, region, timestamp."),
    locator: dryv.field(sourceEnums.Locator).description("Exactly where, in the locator's own form (page 12, $.data[3])."),
    quotedHash: dryv
      .field(sharedProperties.Sha256)
      .maybe()
      .description("Hash of the quoted text, to detect changed sources."),
    recordedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("CitationHasOneOrigin", rule.exactlyOne("artifactId", "captureId"))
  .description("Exactly where in an artifact or capture a fact is.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("citations")
      .index("artifactId")
      .index("captureId")
      .references("CitationOfCapture", {
        fields: ["captureId", "retrievedAt"],
        target: () => Captures,
        targetFields: ["id", "retrievedAt"],
      }),
  });

/** Subject-table partitions of `evidence`: the largest subjects alone and hash-split on `subject_id`. */
const evidenceHash = (table: string) => ({
  strategy: "hash" as const,
  keys: ["subjectId"] as const,
  partitions: Array.from({ length: 8 }, (_, remainder) => ({
    name: `${table}_h${remainder}`,
    bound: { kind: "hash" as const, modulus: 8, remainder },
  })),
});

/*---------------- source.evidence ----------------*/
export const Evidence = source
  .schema("Evidence", {
    ...subjectFields,
    citationId: belongsTo(() => Citations).description("Exactly where in which artifact."),
    role: dryv.field(sourceEnums.EvidenceRole).description("origin, supports or contradicts."),
    method: dryv.field(sourceEnums.EvidenceMethod).description("manual, extracted, matched or modelled."),
    fields: dryv.field(sourceEnums.ColumnName).array().maybe().description("Which columns of the row it supports."),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    observedAt: dryv
      .field(sharedProperties.Instant)
      .maybe()
      .description("When the information was observed or retrieved (not when it was valid)."),
    recordedAt: dryv.field(sharedProperties.Instant).description("When the link was written."),
  })
  .extends(baseSchemas.PartitionedRecord)
  .description(
    "The provenance linking table: which citation supports, or contradicts, which row. No foreign key on the subject by design; soft-deleted rows keep their evidence.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("evidence")
      .partitioning({
        strategy: "list",
        keys: ["subjectTable"],
        partitions: [
          {
            name: "evidence_observations",
            bound: { kind: "list", values: ["statistics.observations"] },
            partitioning: evidenceHash("evidence_observations"),
          },
          {
            name: "evidence_results",
            bound: { kind: "list", values: ["election.results"] },
            partitioning: evidenceHash("evidence_results"),
          },
          {
            name: "evidence_votes",
            bound: { kind: "list", values: ["legislature.votes"] },
            partitioning: evidenceHash("evidence_votes"),
          },
          { name: "evidence_other", bound: { kind: "default" } },
        ],
      })
      .primaryKey("id", "subjectTable", "subjectId")
      .index("subjectTable", "subjectId")
      .index("citationId"),
  });

/*---------------- source.verifications ----------------*/
export const Verifications = source
  .schema("Verifications", {
    ...subjectFields,
    methodTerm: term("src.verification.method", "document check, second source, field visit."),
    outcome: dryv.field(sourceEnums.VerificationOutcome),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    reviewerId: belongsTo(() => Accounts).maybe(),
    assessedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .description("A review decision about one row, against what and when.")
  .role("entity")
  .facets({ storage: dryv.storage("verifications").index("subjectTable", "subjectId").index("reviewerId") });

/*---------------- source.attributions ----------------*/
export const Attributions = source
  .schema("Attributions", {
    publisherId: belongsTo(() => Publishers),
    artifactId: belongsTo(() => Artifacts),
    licenceTerm: term("src.licence", "The licence the artifact is used under.").maybe(),
    credit: dryv.field(sharedProperties.NonEmptyString1000).description("The credit line to show."),
    rights: dryv.field(sharedProperties.Description).description("The rights statement."),
    assessedAt: dryv.field(sharedProperties.Instant),
    assessorId: belongsTo(() => Accounts).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Credit and rights of an artifact.")
  .role("entity")
  .facets({ storage: dryv.storage("attributions").index("artifactId").index("publisherId") });

/*---------------- source.coverage ----------------*/
export const Coverage = source
  .schema("Coverage", {
    countryId: belongsTo(() => Countries),
    sourceId: belongsTo(() => Sources).maybe(),
    productId: belongsTo(() => Products).maybe(),
    featureId: belongsTo(() => Features).maybe(),
    subjectTerm: term("src.coverage.subject", "What is expected (budgets, gazette notices, census tables)."),
    ...periodFields,
    levelId: belongsTo(() => Levels).maybe(),
    checkedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    expectedUrl: dryv.field(sharedProperties.Url).maybe(),
    publisherId: belongsTo(() => Publishers).maybe(),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .description("Expected coverage, for acquisition planning.")
  .role("entity")
  .facets({ storage: dryv.storage("coverage").index("countryId", "subjectTerm").index("sourceId").index("productId") });

/*---------------- source.disputes ----------------*/
export const Disputes = source
  .schema("Disputes", {
    ...subjectFields,
    kindTerm: term("src.dispute.kind", "conflicting figure, conflicting date, conflicting identity."),
    statusTerm: term("src.dispute.status", "open, resolved, unresolvable."),
    resolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    resolutionId: dryv.field(sharedProperties.Id).maybe().description("The evidence row chosen, when resolved."),
    ...note,
  })
  .extends(baseSchemas.CodedEntity)
  .description("Conflicting claims about one row.")
  .role("entity")
  .facets({ storage: dryv.storage("disputes").index("subjectTable", "subjectId") });

/*---------------- source.contenders ----------------*/
export const Contenders = source
  .schema("Contenders", {
    disputeId: belongsTo(() => Disputes, { onDelete: "cascade" }),
    evidenceId: dryv.field(sharedProperties.Id).description("The evidence row behind this side."),
    claim: dryv.field(sourceEnums.Note).description("The claim, in `language_id`."),
    languageId: belongsTo(() => Languages),
    isPreferred: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .description("One side of a dispute.")
  .role("entity")
  .facets({ storage: dryv.storage("contenders").index("disputeId").index("evidenceId") });
