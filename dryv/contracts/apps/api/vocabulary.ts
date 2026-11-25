/**
 * Module `vocabulary`: schemes and their terms with labels in every language, for legends, chips and filters.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Languages } from "#/schemas/postgres/reference.ts";
import { Labels, Schemes, Terms, vocabulary } from "#/schemas/postgres/vocabulary.ts";
import { apiHttp, CACHE, PageWindow } from "./_shared.ts";

const terms = vocabulary.feature("Terms").failureDefaults(apiHttp);
const scheme = Schemes.asRef();
const term = Terms.asRef();
const label = Labels.asRef();
const language = Languages.asRef();

const SchemeKey = vocabulary.schema("SchemeKey", { code: dryv.field(p.IdentityCode) }).asRef();
const TermWindow = vocabulary
  .schema("TermWindow", { schemeId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const labelsOf = <R extends { reverse: dryv.QueryRow<typeof term extends dryv.SchemaRef<infer F> ? F : never>["reverse"] }>(
  row: R,
) =>
  row.reverse(label.fields.termId, label).select(
    (l) => ({
      text: l.fields.text,
      kind: l.fields.kind,
      countryId: l.fields.countryId,
      languageCode: l.follow(label.fields.languageId, language).fields.code,
    }),
    (l) => [l.fields.kind.order("asc"), l.fields.id.order("asc")],
  );

const q = terms.queries({
  FindScheme: dryv.readQuery
    .from(scheme)
    .input(SchemeKey)
    .where((row, args) => [row.fields.code.eq(args.code)])
    .select((row) => ({
      schemeId: row.fields.id,
      code: row.fields.code,
      shape: row.fields.shape,
      answers: row.fields.answers,
      isOpen: row.fields.isOpen,
      labels: row.reverse(label.fields.schemeId, label).select(
        (l) => ({
          text: l.fields.text,
          kind: l.fields.kind,
          languageCode: l.follow(label.fields.languageId, language).fields.code,
        }),
        (l) => [l.fields.kind.order("asc"), l.fields.id.order("asc")],
      ),
    }))
    .orderBy((row) => [row.fields.id.order("asc")])
    .zeroOrOne(),
  ScanTerms: dryv.readQuery
    .from(term)
    .input(TermWindow)
    .where((row, args) => [row.fields.schemeId.eq(args.schemeId)])
    .select((row) => ({
      termId: row.fields.id,
      code: row.fields.code,
      parentId: row.fields.parentId,
      status: row.fields.status,
      position: row.fields.position,
      iconCode: row.fields.iconCode,
      colorToken: row.fields.colorToken,
      lower: row.fields.lower,
      upper: row.fields.upper,
      labels: labelsOf(row),
    }))
    .orderBy((row) => [row.fields.position.order("asc"), row.fields.code.order("asc"), row.fields.id.order("asc")])
    .page(({ limit, offset }) => ({ limit, offset, maxLimit: 1000 })),
});
export const vocabularyQueries = q;
const rows = vocabulary.schemas({
  SchemeDetail: dryv.schema.fromQuery(q.FindScheme),
  TermEntry: dryv.schema.fromQuery(q.ScanTerms),
});
export const vocabularyRows = rows;
const io = vocabulary.schemas({ TermCollection: dryv.schema({ terms: dryv.field(rows.TermEntry).array() }) });

export const vocabularyOperations = terms.operations({
  GetScheme: dryv
    .operation()
    .role("detail")
    .description("One scheme by code with its labels.")
    .input(SchemeKey)
    .output(rows.SchemeDetail)
    .queryFromInput(q.FindScheme, { missing: f.NotFound })
    .cache(CACHE.reference)
    .facets(({ inputField, output }) => ({
      http: dryv.http("GET", "/v1/vocabulary/schemes/{code}").input(inputField("code"), dryv.path()).output(output),
    })),
  ListTerms: dryv
    .operation()
    .role("list")
    .description("The terms of a scheme in display order, with display hints, bands and all labels.")
    .input(TermWindow)
    .output(io.TermCollection)
    .queryFromInput(q.ScanTerms, { envelope: { terms: "rows" } })
    .cache(CACHE.reference)
    .facets(({ input, output }) => ({
      http: dryv.http("GET", "/v1/vocabulary/terms").input(input, dryv.queryObject()).output(output),
    })),
});
