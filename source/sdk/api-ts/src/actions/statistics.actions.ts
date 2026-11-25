"use server";
/** Generated HTTP request helpers. Endpoint spelling belongs exclusively to routes.ts. */
import { type ActionInput, requestOptions } from "#sdk/helpers/index.ts";
import { api } from "#sdk/helpers/api.ts";
import { routes } from "#sdk/routes.ts";
import type { StatisticsFigureCollection } from "#sdk/types/statistics/dto/figure-collection.ts";
import type { StatisticsIndicatorCollection } from "#sdk/types/statistics/dto/indicator-collection.ts";
import type { StatisticsIndicatorDetail } from "#sdk/types/statistics/dto/indicator-detail.ts";
import type { StatisticsIndicatorFigureCollection } from "#sdk/types/statistics/dto/indicator-figure-collection.ts";
import type { StatisticsIndicatorFigures } from "#sdk/types/statistics/dto/indicator-figures.ts";
import type { StatisticsIndicatorWindow } from "#sdk/types/statistics/dto/indicator-window.ts";
import type { StatisticsObservationCollection } from "#sdk/types/statistics/dto/observation-collection.ts";
import type { StatisticsObservationScope } from "#sdk/types/statistics/dto/observation-scope.ts";
import type { StatisticsPlaceFigures } from "#sdk/types/statistics/dto/place-figures.ts";
/** GET /v1/statistics/indicators/{code} */
export type StatisticsGetIndicatorActionInput = ActionInput<{ code: string }, never, never>;

export async function statisticsGetIndicator(input: StatisticsGetIndicatorActionInput) {
  const options = requestOptions(input.options, undefined, false);
  const path = routes.statistics.getIndicator(input.params);
  return api.get<StatisticsIndicatorDetail>(path, options);
}
/** GET /v1/statistics/indicator-figures */
export type StatisticsListIndicatorFiguresActionInput = ActionInput<
  never,
  StatisticsIndicatorFigures,
  never
>;

export async function statisticsListIndicatorFigures(
  input: StatisticsListIndicatorFiguresActionInput,
) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.statistics.listIndicatorFigures;
  return api.get<StatisticsIndicatorFigureCollection>(path, options);
}
/** GET /v1/statistics/indicators */
export type StatisticsListIndicatorsActionInput = ActionInput<
  never,
  StatisticsIndicatorWindow,
  never
>;

export async function statisticsListIndicators(input: StatisticsListIndicatorsActionInput = {}) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.statistics.listIndicators;
  return api.get<StatisticsIndicatorCollection>(path, options);
}
/** GET /v1/statistics/observations */
export type StatisticsListObservationsActionInput = ActionInput<
  never,
  StatisticsObservationScope,
  never
>;

export async function statisticsListObservations(input: StatisticsListObservationsActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.statistics.listObservations;
  return api.get<StatisticsObservationCollection>(path, options);
}
/** GET /v1/statistics/figures */
export type StatisticsListPlaceFiguresActionInput = ActionInput<
  never,
  StatisticsPlaceFigures,
  never
>;

export async function statisticsListPlaceFigures(input: StatisticsListPlaceFiguresActionInput) {
  const options = requestOptions(input.options, input.query, false);
  const path = routes.statistics.listPlaceFigures;
  return api.get<StatisticsFigureCollection>(path, options);
}
