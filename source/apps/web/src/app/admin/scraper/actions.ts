'use server';

import { revalidatePath } from 'next/cache';
import AppServer from '@/server';
import { ENDPOINTS } from '@/lib/endpoints';
import {
  GetQueriesQuery,
  CreateQueryRequest,
  UpdateQueryRequest,
  GetSourcesQuery,
  CreateSourceRequest,
  GetQueryRunsQuery,
  RunQueryRequest,
  GetQueryResultsQuery,
  GetStatsQuery,
  Query,
  Source,
  QueryRun,
} from './types';
import {
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
  ScraperStats,
} from './types';

/**
 * @description List all scraping queries with optional filtering
 * @param query - Query filters and options
 * @returns List of queries with pagination
 */
export async function getScrapingQueries(query: GetQueriesQuery = {}) {
  const queryParams: Record<string, string> = {};

  if (query.limit !== undefined) {
    queryParams.limit = query.limit.toString();
  }
  if (query.offset !== undefined) {
    queryParams.offset = query.offset.toString();
  }

  return await AppServer.get<ListQueriesResponse>(ENDPOINTS.SCRAPER.QUERIES.GET.list, {
    query: queryParams,
  });
}

/**
 * @description Get detailed information about a specific query
 * @param id - Query ID
 * @returns Query details
 */
export async function getScrapingQuery(id: string) {
  return await AppServer.get<Query>(ENDPOINTS.SCRAPER.QUERIES.GET.byId(id));
}

/**
 * @description Create a new scraping query
 * @param queryData - Query configuration
 * @returns Created query details
 */
export async function createScrapingQuery(queryData: CreateQueryRequest) {
  const response = await AppServer.post<CreateQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.POST.create, queryData);
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Update an existing scraping query
 * @param id - Query ID
 * @param queryData - Updated query configuration
 * @returns Updated query details
 */
export async function updateScrapingQuery(id: string, queryData: UpdateQueryRequest) {
  const response = await AppServer.put<UpdateQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.PUT.update(id), queryData);
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Delete a scraping query
 * @param id - Query ID
 * @returns Deletion status
 */
export async function deleteScrapingQuery(id: string) {
  const response = await AppServer.delete<DeleteQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.DELETE.delete(id));
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Run a scraping query immediately
 * @param id - Query ID
 * @param options - Run options
 * @returns Run details
 */
export async function runScrapingQuery(id: string, options: RunQueryRequest = { query_id: id }) {
  const response = await AppServer.post<RunQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.ACTION.run(id), options);
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Pause a scraping query
 * @param id - Query ID
 * @returns Update status
 */
export async function pauseScrapingQuery(id: string) {
  const response = await AppServer.post<UpdateQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.ACTION.pause(id), {});
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Resume a paused scraping query
 * @param id - Query ID
 * @returns Update status
 */
export async function resumeScrapingQuery(id: string) {
  const response = await AppServer.post<UpdateQueryResponse>(ENDPOINTS.SCRAPER.QUERIES.ACTION.resume(id), {});
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description List all scraping sources
 * @param query - Source filters and options
 * @returns List of sources with pagination
 */
export async function getScrapingSources(query: GetSourcesQuery = {}) {
  return await AppServer.get<ListSourcesResponse>(ENDPOINTS.SCRAPER.SOURCES.GET.list, {
    query: query as Record<string, string>,
  });
}

/**
 * @description Get detailed information about a specific source
 * @param id - Source ID
 * @returns Source details
 */
export async function getScrapingSource(id: string) {
  return await AppServer.get<Source>(ENDPOINTS.SCRAPER.SOURCES.GET.byId(id));
}

/**
 * @description Create a new scraping source
 * @param sourceData - Source configuration
 * @returns Created source details
 */
export async function createScrapingSource(sourceData: CreateSourceRequest) {
  const response = await AppServer.post<CreateSourceResponse>(ENDPOINTS.SCRAPER.SOURCES.POST.create, sourceData);
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Update an existing scraping source
 * @param id - Source ID
 * @param sourceData - Updated source configuration
 * @returns Updated source details
 */
export async function updateScrapingSource(id: string, sourceData: Partial<CreateSourceRequest>) {
  const response = await AppServer.put<UpdateSourceResponse>(ENDPOINTS.SCRAPER.SOURCES.PUT.update(id), sourceData);
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description Delete a scraping source
 * @param id - Source ID
 * @returns Deletion status
 */
export async function deleteScrapingSource(id: string) {
  const response = await AppServer.delete<DeleteSourceResponse>(ENDPOINTS.SCRAPER.SOURCES.DELETE.delete(id));
  if (response.success) {
    revalidatePath('/admin/scraper');
  }
  return response;
}

/**
 * @description List query execution runs
 * @param query - Run filters and options
 * @returns List of runs with pagination
 */
export async function getScrapingRuns(query: GetQueryRunsQuery = {}) {
  const queryParams: Record<string, string> = {};

  if (query.limit !== undefined) {
    queryParams.limit = query.limit.toString();
  }
  if (query.offset !== undefined) {
    queryParams.offset = query.offset.toString();
  }

  return await AppServer.get<ListQueryRunsResponse>(ENDPOINTS.SCRAPER.RUNS.GET.list, {
    query: queryParams,
  });
}

/**
 * @description Get detailed information about a specific run
 * @param id - Run ID
 * @returns Run details
 */
export async function getScrapingRun(id: string) {
  return await AppServer.get<QueryRun>(ENDPOINTS.SCRAPER.RUNS.GET.byId(id));
}

/**
 * @description List query results
 * @param query - Result filters and options
 * @returns List of results with pagination
 */
export async function getScrapingResults(query: GetQueryResultsQuery = {}) {
  return await AppServer.get<ListQueryResultsResponse>(ENDPOINTS.SCRAPER.RESULTS.GET.list, {
    query: query as Record<string, string>,
  });
}

/**
 * @description Get comprehensive scraper statistics
 * @param query - Stats filters and options
 * @returns Scraper statistics
 */
export async function getScrapingStats(query: GetStatsQuery = {}) {
  return await AppServer.get<ScraperStats>(ENDPOINTS.SCRAPER.STATS.GET.overview, {
    query: query as Record<string, string>,
  });
}
