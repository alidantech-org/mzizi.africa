/**
 * Module `source`: where a row came from (evidence with its citation, artifact and publisher) and the sources list.
 */
import * as dryv from "@dryvcode/author";
import { sharedProperties as p } from "#/schemas/_shared.ts";
import { subjectProperties } from "#/schemas/_subjects.ts";
import {
  Artifacts,
  Citations,
  Editions,
  Evidence,
  Products,
  Publishers,
  source,
  Sources,
} from "#/schemas/postgres/source.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const provenance = source.feature("Provenance").failureDefaults(apiHttp);
const evidence = Evidence.asRef();
const citation = Citations.asRef();
const artifact = Artifacts.asRef();
const edition = Editions.asRef();
const productRef = Products.asRef();
const publisher = Publishers.asRef();
const sourceRef = Sources.asRef();

const RowEvidence = source
  .schema("RowEvidence", { subjectTable: dryv.field(subjectProperties.SubjectTable), subjectId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();
const SourceWindow = source.schema("SourceWindow", {}).extends(PageWindow).asRef();

const q = provenance.queries({
  ScanEvidence: dryv.readQuery
    .from(evidence)
    .input(RowEvidence)
    .where((row, args) => [row.fields.subjectTable.eq(args.subjectTable), row.fields.subjectId.eq(args.subjectId)])
    .select((row) => ({
      evidenceId: row.fields.id,
      role: row.fields.role,
      method: row.fields.method,
      confidence: row.fields.confidence,
      observedAt: row.fields.observedAt,
      locatorTerm: row.follow(evidence.fields.citationId, citation).fields.locatorTerm,
      locator: row.follow(evidence.fields.citationId, citation).fields.locator,
      artifactId: row.follow(evidence.fields.citationId, citation).fields.artifactId,
      editionDesignation: row
        .follow(evidence.fields.citationId, citation)
        .follow(citation.fields.artifactId, artifact)
        .follow(artifact.fields.editionId, edition).fields.designation,
      productCode: row
        .follow(evidence.fields.citationId, citation)
        .follow(citation.fields.artifactId, artifact)
        .follow(artifact.fields.editionId, edition)
        .follow(edition.fields.productId, productRef).fields.code,
      publisherCode: row
        .follow(evidence.fields.citationId, citation)
        .follow(citation.fields.artifactId, artifact)
        .follow(artifact.fields.editionId, edition)
        .follow(edition.fields.productId, productRef)
        .follow(productRef.fields.publisherId, publisher).fields.code,
    }))
    .orderBy((row) => [
      row.fields.recordedAt.order("asc"),
      row.fields.id.order("asc"),
      row.fields.subjectTable.order("asc"),
      row.fields.subjectId.order("asc"),
    ])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  ScanSources: dryv.readQuery
    .from(sourceRef)
    .input(SourceWindow)
    .select((row) => ({
      sourceId: row.fields.id,
      code: row.fields.code,
      label: row.fields.label,
      kind: row.fields.kind,
      credibilityTerm: row.fields.credibilityTerm,
      publisherId: row.fields.publisherId,
      publisherCode: row.follow(sourceRef.fields.publisherId, publisher).fields.code,
      publisherNames: namesOf(row.follow(sourceRef.fields.publisherId, publisher).follow(publisher.fields.id, identityRef)),
    }))
    .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
});
export const sourceQueries = q;
const rows = source.schemas({
  EvidenceEntry: dryv.schema.fromQuery(q.ScanEvidence),
  SourceEntry: dryv.schema.fromQuery(q.ScanSources),
});
export const sourceRows = rows;
const io = source.schemas({
  EvidenceCollection: dryv.schema({ evidence: dryv.field(rows.EvidenceEntry).array() }),
  SourceCollection: dryv.schema({ sources: dryv.field(rows.SourceEntry).array() }),
});

export const sourceOperations = provenance.operations({
  ListEvidence: dryv
    .operation()
    .role("list")
    .description("Where one row came from: each citation with its artifact, edition, product and publisher.")
    .input(RowEvidence)
    .output(io.EvidenceCollection)
    .queryFromInput(q.ScanEvidence, { envelope: { evidence: "rows" } })
    .cache(CACHE.structure)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/source/evidence").input(input, dryv.queryObject()).output(output),
    })),
  ListSources: dryv
    .operation()
    .role("list")
    .description("The publication channels Mzizi reads, with their publishers.")
    .input(SourceWindow)
    .output(io.SourceCollection)
    .queryFromInput(q.ScanSources, { envelope: { sources: "rows" } })
    .cache(CACHE.reference)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/source/sources").input(input, dryv.queryObject()).output(output),
    })),
});
