export interface Query {
  id: number; // Changed from string to number for frontend compatibility
  name: string;
  url: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'paused' | 'archived';
  last_run?: string;
  next_run?: string;
  created_at: string;
  updated_at: string;
  source_id?: string;
  selectors?: string;
  schedule?: {
    enabled: boolean;
    timezone?: string;
  };
  // Frontend compatibility fields (required for components)
  lastRun: string; // Required for frontend components
  nextRun: string; // Required for frontend components
}

export interface Source {
  id: string;
  name: string;
  url: string;
  source_type: string;
  config?: Record<string, any>;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface QueryRun {
  id: string;
  query_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  duration?: number;
  records_found: number;
  errors: number;
  error_message?: string;
  created_at: string;
}

export interface QueryResult {
  id: string;
  run_id: string;
  query_id: string;
  data: Record<string, any>;
  metadata?: Record<string, any>;
  created_at: string;
}

// Event type for frontend display (transformed from QueryRun)
export interface Event {
  id: number; // Changed from string to number for frontend compatibility
  queryName: string;
  status: 'success' | 'failed' | 'warning' | 'pending';
  startTime: string;
  endTime: string;
  recordsFound: number;
  errors: number;
}

export interface ScraperStats {
  total_queries: number;
  active_queries: number;
  total_runs: number;
  successful_runs: number;
  failed_runs: number;
  total_records: number;
  avg_duration: number;
  last_run?: string;
}

export interface ListQueriesResponse {
  queries: Query[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListSourcesResponse {
  sources: Source[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListQueryRunsResponse {
  runs: QueryRun[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListQueryResultsResponse {
  results: QueryResult[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateQueryResponse {
  query: Query;
  message: string;
}

export interface UpdateQueryResponse {
  query: Query;
  message: string;
}

export interface DeleteQueryResponse {
  success: boolean;
  message: string;
}

export interface RunQueryResponse {
  run: QueryRun;
  message: string;
}

export interface CreateSourceResponse {
  source: Source;
  message: string;
}

export interface UpdateSourceResponse {
  source: Source;
  message: string;
}

export interface DeleteSourceResponse {
  success: boolean;
  message: string;
}
