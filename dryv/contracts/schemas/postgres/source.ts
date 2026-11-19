/**
 * Schema: source | Database: mzizi
 * Owns publishers, acquisition channels, domains and addresses, discoveries and captures, logical products with their
 * editions and exact artifacts, classified input/output relationships, citations, verifications and attributions.
 * Design: .docs/design/data/SOURCE_FILESYSTEM_GEOGRAPHY.md, .docs/design/data/SUBJECT_REFERENCES.md
 * Sixteen tables (slugs, slug_relations and coverage added 2026-11-19). Removed on 2026-11-17: paths, documents, datasets, dataset_lineage, provenance, evidence,
 * manifests, manifest_releases, manifest_bindings, publication_receipts.
 */
import * as dryv from "@dryvcode/author";
import { rule } from "@dryvcode/author";
import { baseSchemas } from "#/schemas/_base.ts";
import { sharedProperties } from "#/schemas/_shared.ts";
import { subjectFields, subjectProperties } from "#/schemas/_subjects.ts";
import { FileVersions } from "./filesystem.ts";
import { Contacts, Entities } from "./official.ts";
import { Features } from "./geography.ts";
import { Country, Language, Template, Value } from "./reference.ts";

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
    /** Scheme src.licence: the terms under which the source's content may be reused. Absent while unassessed. */
    licenceId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.src.licence"),
    termsUrl: dryv.field(sharedProperties.Url).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description("A publication channel: a real website or a real API, with its classification and credibility.")
  .role("entity")
  .facets({
    storage: dryv
      .storage("sources")
      .index("publisherId")
      .index("kind")
      .index("classificationId")
      .index("credibilityId")
      .index("licenceId"),
  });

export const Domains = source
  .schema("Domains", {
    /** The source served from this host. Empty while the host is only a candidate generated from a pattern. */
    sourceId: belongsTo(() => Sources).maybe(),
    host: dryv.field(sharedProperties.NonEmptyString255),
    /** Scheme src.domain.status: candidate, resolves, verified official, redirects, dead, rejected. Absent while unassessed (domains seeded before this status existed). */
    statusId: belongsTo(() => Value)
      .maybe()
      .tags("scheme:ref.sch.src.domain.status"),
    /** The entity this host is the site of, once matched. */
    entityId: belongsTo(() => Entities).maybe(),
    /** The website contact of that entity that records this host. */
    officialContactId: belongsTo(() => Contacts).maybe(),
    /** The pattern template that produced this candidate host. */
    templateId: belongsTo(() => Template).maybe(),
    lastCheckedAt: dryv.field(sharedProperties.Instant).maybe(),
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
    storage: dryv
      .storage("domains")
      .unique("host")
      .index("sourceId")
      .index("statusId")
      .index("entityId")
      .index("officialContactId")
      .index("templateId"),
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

/*---------------- source.slugs ----------------*/
export const Slugs = source
  .schema("Slugs", {
    countryId: belongsTo(() => Country),
    /** Scheme src.slug.namespace: place, leader, party, election, law, project, tender, institution, facility, event, indicator. A slug is unique only inside its namespace and parent. */
    namespaceId: belongsTo(() => Value).tags("scheme:ref.sch.src.slug.namespace"),
    /** The address segment: lowercase words joined by hyphens, no kind word unless a collision needs it. Never an id. */
    slug: dryv.field(sharedProperties.NonEmptyString255),
    /** The slug row of the place this one lives under in the country's canonical routing hierarchy; absent for a first-level or standalone slug. */
    parentSlugId: belongsTo(() => Slugs).maybe(),
    /** Absent for a language-neutral slug; set for a slug that exists only in one language (a translated section or law). */
    languageId: belongsTo(() => Language).maybe(),
    /** The canonical slug this one redirects or translates to; absent on the canonical row itself. One level only. */
    canonicalSlugId: belongsTo(() => Slugs).maybe(),
  })
  .extends(baseSchemas.CodedPeriodSubjectEntity)
  .description(
    "One public address segment for one subject row. Identifies a thing by a clean name under its parent; closed rows keep history so a renamed or re-parented thing redirects instead of breaking. Carries no title: titles come from the name tables.",
  )
  .role("entity");

const activeSlug = source.expression(
  "ActiveSlug",
  Slugs.check((v) => v.toYear.isNull()),
);

Slugs.facets({
  storage: dryv
    .storage("slugs")
    .unique("countryId", "namespaceId", "parentSlugId", "slug", "languageId")
    .where(activeSlug)
    .index("subjectTable", "subjectId")
    .index("parentSlugId")
    .index("canonicalSlugId")
    .index("namespaceId"),
});

/*---------------- source.slug_relations ----------------*/
export const Links = source
  .schema("Links", {
    fromSlugId: belongsTo(() => Slugs),
    toSlugId: belongsTo(() => Slugs),
    /** Scheme src.slug.relation: same-as, translation-of, alias-of, supersedes, covers-same-area, contains. */
    relationKindId: belongsTo(() => Value).tags("scheme:ref.sch.src.slug.relation"),
  })
  .extends(baseSchemas.PeriodEntity)
  .rule("SlugRelationEndsDiffer", rule.differs("fromSlugId", "toSlugId"))
  .description(
    "A dated relation between two slugs that name the same thing or the same area: translations, aliases, a constituency and a sub-county covering the same land. Must not form cycles.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("links")
      .unique("fromSlugId", "toSlugId", "relationKindId")
      .index("toSlugId")
      .index("relationKindId"),
  });

/*---------------- source.coverage ----------------*/
export const Coverage = source
  .schema("Coverage", {
    countryId: belongsTo(() => Country),
    /** The source or the product that was checked. At least one is named. */
    sourceId: belongsTo(() => Sources).maybe(),
    productId: belongsTo(() => Products).maybe(),
    /** The place the check covers; absent for the whole country. */
    scopeUnitFeatureId: belongsTo(() => Features).maybe(),
    /** Scheme src.coverage.subject: what kind of records the source should hold (projects, tenders, facilities, results, budgets, reports, statistics). */
    coverageSubjectId: belongsTo(() => Value).tags("scheme:ref.sch.src.coverage.subject"),
    periodFrom: dryv.field(sharedProperties.CalendarDate).maybe(),
    periodUntil: dryv.field(sharedProperties.CalendarDate).maybe(),
    /** Scheme src.coverage.level: complete, partial, sample, none published, unknown. */
    levelId: belongsTo(() => Value).tags("scheme:ref.sch.src.coverage.level"),
    checkedOn: dryv.field(sharedProperties.CalendarDate),
    /** Where the real data should be published, for the "no data" help to link to. */
    expectedPublicationUrl: dryv.field(sharedProperties.Url).maybe(),
    /** The institution responsible for publishing it; visitors can ask this office to publish. */
    publisherEntityId: belongsTo(() => Entities).maybe(),
    note: dryv.field(sharedProperties.Description).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .rule("SourceOrProductNamed", rule.atLeastOne("sourceId", "productId"))
  .rule("CoveragePeriodIsOrdered", rule.ordered("periodFrom", "periodUntil", { allowEqual: true }))
  .description(
    "What a source or product covers, for which place, years and kind of record, how completely, and when that was checked. It makes every 'none recorded' honest: the page says which sources were checked, and a gap is never read as zero.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("coverage")
      .index("countryId", "coverageSubjectId")
      .index("sourceId")
      .index("productId")
      .index("scopeUnitFeatureId")
      .index("levelId")
      .index("publisherEntityId"),
  });

/*---------------- source.disputes ----------------*/
export const Disputes = source
  .schema("Disputes", {
    /** The contested record: any table, so the subject reference is the right link. */
    ...subjectFields,
    /** Scheme src.dispute.kind: value, date, identity, existence, interpretation. */
    kindId: belongsTo(() => Value).tags("scheme:ref.sch.src.dispute.kind"),
    /** Scheme src.dispute.status: open, resolved, both kept. */
    statusId: belongsTo(() => Value).tags("scheme:ref.sch.src.dispute.status"),
    summary: dryv.field(sharedProperties.Description),
    resolvedOn: dryv.field(sharedProperties.CalendarDate).maybe(),
    resolutionCitationId: belongsTo(() => Citations).maybe(),
  })
  .extends(baseSchemas.CodedEntity)
  .description(
    "A recorded disagreement between sources about one record. Both claims are kept with their citations and shown side by side; nothing is overwritten.",
  )
  .role("entity")
  .facets({
    storage: dryv
      .storage("disputes")
      .index("subjectTable", "subjectId")
      .index("kindId")
      .index("statusId")
      .index("resolutionCitationId"),
  });

/*---------------- source.contenders ----------------*/
export const Contenders = source
  .schema("Contenders", {
    disputeId: belongsTo(() => Disputes),
    citationId: belongsTo(() => Citations),
    /** What this source says, in words. */
    claim: dryv.field(sharedProperties.Description),
    position: dryv.field(sharedProperties.NonNegativeInteger).maybe(),
    /** True for the claim the project currently shows first, with the others beside it. */
    isPreferred: dryv.field(sharedProperties.Flag),
  })
  .extends(baseSchemas.Entity)
  .description("One side of a dispute: a citation and the claim it supports.")
  .role("entity")
  .facets({
    storage: dryv.storage("contenders").unique("disputeId", "citationId").index("disputeId").index("citationId"),
  });
