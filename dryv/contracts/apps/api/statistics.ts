/**
 * Module `statistics`: indicators, their dimensions and the prepared figures screens read (never raw observations,
 * except for "other sources" and revision history). Every figures read filters by country first.
 */
import * as dryv from "@dryvcode/author";
import { sharedFailures as f, sharedProperties as p } from "#/schemas/_shared.ts";
import { Breakdowns, Dimensions, Figures, Indicators, Observations, statistics } from "#/schemas/postgres/statistics.ts";
import { periodProperties } from "#/schemas/_periods.ts";
import { Units } from "#/schemas/postgres/reference.ts";
import { Terms } from "#/schemas/postgres/vocabulary.ts";
import { apiHttp, CACHE, identityRef, MAX_PAGE, namesOf, PageWindow } from "./_shared.ts";

const indicatorsFeature = statistics.feature("Indicators").failureDefaults(apiHttp);
const figuresFeature = statistics.feature("Figures").failureDefaults(apiHttp);
const indicator = Indicators.asRef();
const dimension = Dimensions.asRef();
const figure = Figures.asRef();
const observation = Observations.asRef();
const breakdown = Breakdowns.asRef();
const unit = Units.asRef();
const termRef = Terms.asRef();

const IndicatorKey = statistics.schema("IndicatorKey", { code: dryv.field(p.IdentityCode) }).asRef();
const IndicatorWindow = statistics
  .schema("IndicatorWindow", { topicTerm: dryv.field(p.Id).optional() })
  .extends(PageWindow)
  .asRef();
const PlaceFigures = statistics
  .schema("PlaceFigures", {
    countryId: dryv.field(p.Id),
    featureId: dryv.field(p.Id),
    indicatorId: dryv.field(p.Id).optional(),
  })
  .extends(PageWindow)
  .asRef();
const IndicatorFigures = statistics
  .schema("IndicatorFigures", {
    countryId: dryv.field(p.Id),
    indicatorId: dryv.field(p.Id),
    fromYear: dryv.field(periodProperties.Year).optional(),
  })
  .extends(PageWindow)
  .asRef();
const ObservationScope = statistics
  .schema("ObservationScope", { countryId: dryv.field(p.Id), indicatorId: dryv.field(p.Id), featureId: dryv.field(p.Id) })
  .extends(PageWindow)
  .asRef();

const figureColumns = (row: dryv.QueryRow<typeof figure extends dryv.SchemaRef<infer F> ? F : never>) => ({
  figureId: row.fields.id,
  indicatorId: row.fields.indicatorId,
  indicatorCode: row.follow(figure.fields.indicatorId, indicator).fields.code,
  metricId: row.fields.metricId,
  featureId: row.fields.featureId,
  subjectId: row.fields.subjectId,
  fromYear: row.fields.fromYear,
  toYear: row.fields.toYear,
  startsOn: row.fields.startsOn,
  endsOn: row.fields.endsOn,
  value: row.fields.value,
  lower: row.fields.lower,
  upper: row.fields.upper,
  status: row.fields.status,
  basis: row.fields.basis,
  cell: row.fields.cell,
  observationId: row.fields.observationId,
  refreshedAt: row.fields.refreshedAt,
});

const q = {
  ...indicatorsFeature.queries({
    ScanIndicators: dryv.readQuery
      .from(indicator)
      .input(IndicatorWindow)
      .where((row, args) => [row.fields.topicTerm.eq(args.topicTerm)])
      .select((row) => ({
        indicatorId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        topicTerm: row.fields.topicTerm,
        roleTerm: row.fields.roleTerm,
        unitSymbol: row.follow(indicator.fields.unitId, unit).fields.symbol,
        decimals: row.fields.decimals,
        frequency: row.fields.frequency,
        aggregation: row.fields.aggregation,
        higherIsBetter: row.fields.higherIsBetter,
        names: namesOf(row.follow(indicator.fields.id, identityRef)),
      }))
      .orderBy((row) => [row.fields.code.order("asc"), row.fields.id.order("asc")])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
    FindIndicator: dryv.readQuery
      .from(indicator)
      .input(IndicatorKey)
      .where((row, args) => [row.fields.code.eq(args.code)])
      .select((row) => ({
        indicatorId: row.fields.id,
        code: row.fields.code,
        kindTerm: row.fields.kindTerm,
        topicTerm: row.fields.topicTerm,
        unitId: row.fields.unitId,
        unitSymbol: row.follow(indicator.fields.unitId, unit).fields.symbol,
        decimals: row.fields.decimals,
        frequency: row.fields.frequency,
        aggregation: row.fields.aggregation,
        higherIsBetter: row.fields.higherIsBetter,
        isDerived: row.fields.isDerived,
        names: namesOf(row.follow(indicator.fields.id, identityRef)),
        dimensions: row.reverse(dimension.fields.indicatorId, dimension).select(
          (d) => ({ schemeId: d.fields.schemeId, position: d.fields.position, isRequired: d.fields.isRequired }),
          (d) => [d.fields.position.order("asc"), d.fields.id.order("asc")],
        ),
      }))
      .orderBy((row) => [row.fields.id.order("asc")])
      .zeroOrOne(),
  }),
  ...figuresFeature.queries({
    ScanPlaceFigures: dryv.readQuery
      .from(figure)
      .input(PlaceFigures)
      .where((row, args) => [
        row.fields.countryId.eq(args.countryId),
        row.fields.featureId.eq(args.featureId),
        row.fields.indicatorId.eq(args.indicatorId),
      ])
      .select((row) => figureColumns(row))
      .orderBy((row) => [
        row.fields.indicatorId.order("asc"),
        row.fields.fromYear.order("desc"),
        row.fields.cell.order("asc"),
        row.fields.id.order("asc"),
        row.fields.countryId.order("asc"),
      ])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: 1000 })),
    ScanIndicatorFigures: dryv.readQuery
      .from(figure)
      .input(IndicatorFigures)
      .where((row, args) => [
        row.fields.countryId.eq(args.countryId),
        row.fields.indicatorId.eq(args.indicatorId),
        row.fields.fromYear.eq(args.fromYear),
      ])
      .select((row) => figureColumns(row))
      .orderBy((row) => [
        row.fields.featureId.order("asc"),
        row.fields.fromYear.order("desc"),
        row.fields.id.order("asc"),
        row.fields.countryId.order("asc"),
      ])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: 5000 })),
    ScanObservations: dryv.readQuery
      .from(observation)
      .input(ObservationScope)
      .where((row, args) => [
        row.fields.countryId.eq(args.countryId),
        row.fields.indicatorId.eq(args.indicatorId),
        row.fields.featureId.eq(args.featureId),
      ])
      .select((row) => ({
        observationId: row.fields.id,
        fromYear: row.fields.fromYear,
        toYear: row.fields.toYear,
        value: row.fields.value,
        lower: row.fields.lower,
        upper: row.fields.upper,
        status: row.fields.status,
        basis: row.fields.basis,
        cell: row.fields.cell,
        collectionId: row.fields.collectionId,
        revision: row.fields.revision,
        supersedesId: row.fields.supersedesId,
        breakdowns: row.reverse(breakdown.fields.observationId, breakdown).select(
          (b) => ({
            termId: b.fields.termId,
            termCode: b.follow(breakdown.fields.termId, termRef).fields.code,
            schemeId: b.fields.schemeId,
          }),
          (b) => [b.fields.schemeId.order("asc"), b.fields.id.order("asc"), b.fields.countryId.order("asc")],
        ),
      }))
      .orderBy((row) => [
        row.fields.fromYear.order("desc"),
        row.fields.revision.order("desc"),
        row.fields.id.order("asc"),
        row.fields.countryId.order("asc"),
      ])
      .page(({ limit, offset }) => ({ limit, offset, maxLimit: MAX_PAGE })),
  }),
};
export const statisticsQueries = q;

const rows = statistics.schemas({
  IndicatorEntry: dryv.schema.fromQuery(q.ScanIndicators),
  IndicatorDetail: dryv.schema.fromQuery(q.FindIndicator),
  FigureEntry: dryv.schema.fromQuery(q.ScanPlaceFigures),
  IndicatorFigureEntry: dryv.schema.fromQuery(q.ScanIndicatorFigures),
  ObservationEntry: dryv.schema.fromQuery(q.ScanObservations),
});
export const statisticsRows = rows;
const io = statistics.schemas({
  IndicatorCollection: dryv.schema({ indicators: dryv.field(rows.IndicatorEntry).array() }),
  FigureCollection: dryv.schema({ figures: dryv.field(rows.FigureEntry).array() }),
  IndicatorFigureCollection: dryv.schema({ figures: dryv.field(rows.IndicatorFigureEntry).array() }),
  ObservationCollection: dryv.schema({ observations: dryv.field(rows.ObservationEntry).array() }),
});

export const statisticsOperations = {
  ...indicatorsFeature.operations({
    ListIndicators: dryv
      .operation()
      .role("list")
      .description("Indicators with unit, decimals, frequency and names, optionally of one topic.")
      .input(IndicatorWindow)
      .output(io.IndicatorCollection)
      .queryFromInput(q.ScanIndicators, { envelope: { indicators: "rows" } })
      .cache(CACHE.reference)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/statistics/indicators").input(input, dryv.queryObject()).output(output),
      })),
    GetIndicator: dryv
      .operation()
      .role("detail")
      .description("One indicator with the breakdowns it allows.")
      .input(IndicatorKey)
      .output(rows.IndicatorDetail)
      .queryFromInput(q.FindIndicator, { missing: f.NotFound })
      .cache(CACHE.reference)
      .facets(({ inputField, output }) => ({
        http: dryv.http("GET", "/v1/statistics/indicators/{code}").input(inputField("code"), dryv.path()).output(output),
      })),
  }),
  ...figuresFeature.operations({
    ListPlaceFigures: dryv
      .operation()
      .role("list")
      .description("The figures to show for one place, optionally of one indicator, newest period first.")
      .input(PlaceFigures)
      .output(io.FigureCollection)
      .queryFromInput(q.ScanPlaceFigures, { envelope: { figures: "rows" } })
      .cache(CACHE.figures)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/statistics/figures").input(input, dryv.queryObject()).output(output),
      })),
    ListIndicatorFigures: dryv
      .operation()
      .role("list")
      .description("The figures of one indicator for every place of a country, for maps and rankings.")
      .input(IndicatorFigures)
      .output(io.IndicatorFigureCollection)
      .queryFromInput(q.ScanIndicatorFigures, { envelope: { figures: "rows" } })
      .cache(CACHE.figures)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/statistics/indicator-figures").input(input, dryv.queryObject()).output(output),
      })),
    ListObservations: dryv
      .operation()
      .role("list")
      .description("Every published observation behind a place's figures: other sources and revision history.")
      .input(ObservationScope)
      .output(io.ObservationCollection)
      .queryFromInput(q.ScanObservations, { envelope: { observations: "rows" } })
      .cache(CACHE.figures)
      .facets(({ input, output }) => ({
        http: dryv.http("GET", "/v1/statistics/observations").input(input, dryv.queryObject()).output(output),
      })),
  }),
};
