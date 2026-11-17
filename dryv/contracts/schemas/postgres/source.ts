/**
 * Schema: source | Database: mzizi
 * Owns publishers, acquisition channels, domains and addresses, discoveries and captures, logical products with their
 * editions and exact artifacts, classified input/output relationships, citations, verifications and attributions.
 * Design: .docs/design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md, .docs/design/data/SUBJECT_REFERENCES.md
 * Thirteen tables. Removed on 2026-11-17: paths, documents, datasets, dataset_lineage, provenance, evidence,
 * manifests, manifest_releases, manifest_bindings, publication_receipts.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { subjectProperties } from "#/schemas/_subjects.ts";
import { FileVersions } from "./filesystem.ts";
import { Entities } from "./official.ts";
import { Country, Language, Value } from "./reference.ts";

const belongsTo = dryv.belongsToUsing(sharedProperties.Id);

export const source = dryv
  .group({ name: "source" })
  .description("Where information came from: channels, addresses, captures, products, relationships and exact citations.")
  .facets({ storage: { namespace: "source", store: "main" } });

export const sourceEnums = source.properties({
  VerificationOutcome: dryv.property.enum(["supported", "contradicted", "insufficient", "disputed"]),
  /** A real website (pages and files) or a real API (endpoints). A dataset is a product, never a channel. */
  SourceKind: dryv.property.enum(["website", "api"]),
  AddressKind: dryv.property.enum(["page", "listing", "file", "endpoint"]),
  HttpMethod: dryv.property.enum(["GET", "HEAD", "POST"]),
});

export const Publishers = source
  .schema("Publishers", {
    name: dryv.field(sharedProperties.Name),
    kindId: belongsTo(() => Value),
    /** Scheme src.classification: official, research, community and so on. Absent while unassessed. */
    classificationId: belongsTo(() => Value).maybe(),
    officialEntityId: belongsTo(() => Entities).maybe(),
    countryId: belongsTo(() => Country).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "Accepted publisher; an optional official identity distinguishes the organization from its publication channels.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("publishers").index("kindId").index("classificationId").index("countryId"),
  });

export const Sources = source
  .schema("Sources", {
    publisherId: belongsTo(() => Publishers),
    kind: dryv.field(sourceEnums.SourceKind),
    /** Scheme src.classification. Absent while unassessed; never coerced to unofficial. */
    classificationId: belongsTo(() => Value).maybe(),
    /** Scheme src.credibility. Absent while unassessed; never coerced to unreliable. */
    credibilityId: belongsTo(() => Value).maybe(),
    officialEntityId: belongsTo(() => Entities).maybe(),
    title: dryv.field(sharedProperties.Name),
    description: dryv.field(sharedProperties.Description).maybe(),
    /** For an API: the named credential binding only. */
    credentialBinding: dryv.field(sharedProperties.NonEmptyString255).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A publication channel: a real website or a real API, with its classification and credibility.")
  .role("entity")
  .facets({
    storage: dryv.storage("sources").index("publisherId").index("kind").index("classificationId").index("credibilityId"),
  });

export const Domains = source
  .schema("Domains", {
    sourceId: belongsTo(() => Sources),
    host: dryv.field(sharedProperties.NonEmptyString255),
    startsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    endsOn: dryv.field(sharedProperties.CalendarDate).maybe(),
  })
  .extends(baseSchemas.CodedPeriodEntity)
  .rule("DomainsDatesAreOrdered", rule.ordered("startsOn", "endsOn", { allowEqual: true }))
  .description(
    "A host name a source is served from. A host belongs to one source at a time; its validity period records moves.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("domains").unique("host").index("sourceId"),
  });

export const Addresses = source
  .schema("Addresses", {
    domainId: belongsTo(() => Domains),
    kind: dryv.field(sourceEnums.AddressKind),
    method: dryv.field(sourceEnums.HttpMethod),
    /** The path exactly as requested, starting with a slash; without the query. */
    path: dryv.field(sharedProperties.NonEmptyString1000),
    /** The query string without the leading question mark; absent when there is none. Fragments and credentials are never stored. */
    query: dryv.field(sharedProperties.NonEmptyString1000).maybe(),
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A page, listing, file or API endpoint on a domain, distinguished by method, path and query.")
  .role("entity");

const withoutQuery = source.expression(
  "AddressWithoutQuery",
  Addresses.check((v) => v.query.isNull()),
);

Addresses.facets({
  storage: dryv
    .storage("addresses")
    .unique("domainId", "method", "path", "query")
    .unique("domainId", "method", "path")
    .where(withoutQuery)
    .index("domainId"),
});

export const Discoveries = source
  .schema("Discoveries", {
    /** The address once it resolves to an accepted domain; absent while the link points somewhere not yet accepted. */
    addressId: belongsTo(() => Addresses).maybe(),
    /** The link exactly as found, kept so an unresolved target is never invented into a source. */
    observedUrl: dryv.field(sharedProperties.Url),
    /** The page it was found on. */
    foundOnAddressId: belongsTo(() => Addresses).maybe(),
    sourceId: belongsTo(() => Sources).maybe(),
    anchorText: dryv.field(sharedProperties.NullableString1000).maybe(),
    context: dryv.field(sharedProperties.Description).maybe(),
    discoveredAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.Entity)
  .description(
    "An observation that an address exists: where it was found, as what text and when. Retrieval is a separate capture.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("discoveries")
      .index("addressId")
      .index("foundOnAddressId")
      .index("sourceId")
      .index("discoveredAt"),
  });

export const Products = source
  .schema("Products", {
    /** Scheme src.product.kind: document, dataset, report, map and so on. */
    kindId: belongsTo(() => Value),
    title: dryv.field(sharedProperties.Name),
    publisherId: belongsTo(() => Publishers).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One logical document or dataset, independent of who served it, in what format or how many times it was downloaded.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("products").index("kindId").index("publisherId"),
  });

export const Editions = source
  .schema("Editions", {
    productId: belongsTo(() => Products),
    /** The edition's own label: a year, a print, a release name. */
    designation: dryv.field(sharedProperties.NonEmptyString255),
    languageId: belongsTo(() => Language).maybe(),
    publishedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A meaningfully distinct release of a product. Another format or scan of the same wording is an artifact, not an edition.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("editions").unique("productId", "designation").index("languageId"),
  });

export const Artifacts = source
  .schema("Artifacts", {
    editionId: belongsTo(() => Editions),
    /** Exact bytes in the filesystem; absent until the file is preserved. */
    fileVersionId: belongsTo(() => FileVersions).maybe(),
    sha256: dryv.field(sharedProperties.Sha256),
    format: dryv.field(sharedProperties.NonEmptyString100).maybe(),
    contentType: dryv.field(sharedProperties.NonEmptyString255).maybe(),
    sizeBytes: dryv.field(sharedProperties.NonNegativeInt64).maybe(),
    /** Where a prepared artifact lives in the repository, such as a seed CSV. */
    location: dryv.field(sharedProperties.NonEmptyString1000).maybe(),
    /** The archive this artifact is a member of. */
    parentId: belongsTo(dryv.self).maybe(),
    description: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("artifacts")
      .unique("editionId", "sha256")
      .index("sha256")
      .index("fileVersionId")
      .index("parentId"),
  });

export const Captures = source
  .schema("Captures", {
    /** The accepted channel; absent when the address belongs to no accepted source yet. A source is never invented to hold a link. */
    sourceId: belongsTo(() => Sources).maybe(),
    addressId: belongsTo(() => Addresses).maybe(),
    discoveryId: belongsTo(() => Discoveries).maybe(),
    /** The content obtained; absent until the bytes are downloaded and hashed. */
    artifactId: belongsTo(() => Artifacts).maybe(),
    originalUrl: dryv.field(sharedProperties.Url),
    retrievedUrl: dryv.field(sharedProperties.Url).maybe(),
    retrievedAt: dryv.field(sharedProperties.Instant),
    responseMetadata: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "One retrieval of an address: when, from which link, with what response. Repeated captures never overwrite each other.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("captures").index("sourceId").index("addressId").index("discoveryId").index("artifactId"),
  });

export const Relationships = source
  .schema("Relationships", {
    /** Scheme src.relationship.kind: extracted-from, prepared-from, built-from, translated-from, supports. */
    kindId: belongsTo(() => Value),
    /**
     * Direction: the output was made from the input. Each end is exactly one of the typed columns, so every end is a real
     * foreign key. A result made from several inputs has one row per input.
     */
    outputCaptureId: belongsTo(() => Captures).maybe(),
    outputArtifactId: belongsTo(() => Artifacts).maybe(),
    outputEditionId: belongsTo(() => Editions).maybe(),
    outputProductId: belongsTo(() => Products).maybe(),
    outputFileVersionId: belongsTo(() => FileVersions).maybe(),
    /** Or the output is a domain record, named by the shared subject keys (both set or both absent). */
    subjectTable: dryv.field(subjectProperties.SubjectTable).maybe(),
    subjectId: dryv.field(sharedProperties.Id).maybe(),
    inputCaptureId: belongsTo(() => Captures).maybe(),
    inputArtifactId: belongsTo(() => Artifacts).maybe(),
    inputEditionId: belongsTo(() => Editions).maybe(),
    inputProductId: belongsTo(() => Products).maybe(),
    inputFileVersionId: belongsTo(() => FileVersions).maybe(),
    /** How the input was used. */
    method: dryv.field(sharedProperties.Description).maybe(),
    /** Optional loose reference to an external execution; never a foreign key and never required. */
    executionRef: dryv.field(sharedProperties.NonEmptyString255).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("SubjectKeysTogether", rule.allOrNone("subjectTable", "subjectId"))
  .rule(
    "ExactlyOneOutput",
    rule.exactlyOne(
      "outputCaptureId",
      "outputArtifactId",
      "outputEditionId",
      "outputProductId",
      "outputFileVersionId",
      "subjectId",
    ),
  )
  .rule(
    "ExactlyOneInput",
    rule.exactlyOne("inputCaptureId", "inputArtifactId", "inputEditionId", "inputProductId", "inputFileVersionId"),
  )
  .description(
    "A classified connection from an input to an output or a domain record: derivation, extraction, translation, support. Exact locations are citations on the relationship.",
  )
  .role("entity")
  .facets({ storage: dryv.storage("relationships").index("kindId").index("subjectTable", "subjectId") });

export const Citations = source
  .schema("Citations", {
    /** The exact representation cited; absent while only the address or capture is known. */
    artifactId: belongsTo(() => Artifacts).maybe(),
    captureId: belongsTo(() => Captures).maybe(),
    /** A cited page known only by its address, before any capture or artifact exists. */
    addressId: belongsTo(() => Addresses).maybe(),
    /** The row this location supports (a relationship, a claim), named by the shared subject keys; both set or both absent. */
    subjectTable: dryv.field(subjectProperties.SubjectTable).maybe(),
    subjectId: dryv.field(sharedProperties.Id).maybe(),
    locatorKindId: belongsTo(() => Value),
    locator: dryv.field(sharedProperties.JsonText),
    quotedHash: dryv.field(sharedProperties.Sha256).maybe(),
    recordedAt: dryv.field(sharedProperties.Instant),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("CitesSomething", rule.atLeastOne("artifactId", "captureId", "addressId"))
  .rule("SubjectKeysTogether", rule.allOrNone("subjectTable", "subjectId"))
  .description("Exact locator in one artifact: PDF page or paragraph, JSON path, CSV line and column, region or timestamp.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("citations")
      .index("artifactId")
      .index("captureId")
      .index("addressId")
      .index("subjectTable", "subjectId")
      .index("locatorKindId"),
  });

export const Verifications = source
  .schema("Verifications", {
    methodId: belongsTo(() => Value),
    outcome: dryv.field(sourceEnums.VerificationOutcome),
    confidence: dryv.field(sharedProperties.Confidence).maybe(),
    explanation: dryv.field(sharedProperties.Description),
    reviewerSnapshot: dryv.field(sharedProperties.JsonText),
    assessedAt: dryv.field(sharedProperties.Instant),
    supersedesId: belongsTo(dryv.self).maybe(),
  })
  .extends(baseSchemas.CodedSubjectEntity)
  .description(
    "Append-only attributable assessment of one reviewed subject (a claim row or a relationship); disagreement stays explicit.",
  )
  .role("entity")
  .facets({
    storage: dryv.storage("verifications").index("subjectTable", "subjectId").index("methodId").index("supersedesId"),
  });

export const Attributions = source
  .schema("Attributions", {
    publisherId: belongsTo(() => Publishers),
    artifactId: belongsTo(() => Artifacts),
    licenseValueId: belongsTo(() => Value).maybe(),
    credit: dryv.field(sharedProperties.NonEmptyString1000),
    rightsStatement: dryv.field(sharedProperties.Description),
    assessedAt: dryv.field(sharedProperties.Instant),
    assessorSnapshot: dryv.field(sharedProperties.JsonText),
  })
  .extends(baseSchemas.CodedEntity)
  .description("Credit and rights for one artifact and publisher; equal bytes from other places never overwrite it.")
  .role("entity")
  .facets({
    storage: dryv.storage("attributions").index("publisherId").index("artifactId").index("licenseValueId"),
  });
