export * from './request';
export * from './response';

// Re-export for easier imports
export type {
  GetQueriesQuery,
  CreateQueryRequest,
  UpdateQueryRequest,
  GetSourcesQuery,
  CreateSourceRequest,
  GetQueryRunsQuery,
  RunQueryRequest,
  GetQueryResultsQuery,
  GetStatsQuery,
} from './request';

export type {
  Query,
  Source,
  QueryRun,
  QueryResult,
  Event,
  ScraperStats,
  ListQueriesResponse,
  ListSourcesResponse,
  ListQueryRunsResponse,
  ListQueryResultsResponse,
  CreateQueryResponse,
  UpdateQueryResponse,
  DeleteQueryResponse,
  RunQueryResponse,
  CreateSourceResponse,
  UpdateSourceResponse,
  DeleteSourceResponse,
} from './response';
