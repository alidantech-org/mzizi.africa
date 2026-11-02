export interface GetQueriesQuery {
  status?: 'active' | 'paused' | 'archived';
  limit?: number;
  offset?: number;
}

export interface CreateQueryRequest {
  name: string;
  url: string;
  frequency: 'hourly' | 'daily' | 'weekly' | 'monthly';
  selectors?: string;
  source_id?: string;
  schedule?: {
    enabled: boolean;
    timezone?: string;
  };
}

export interface UpdateQueryRequest {
  name?: string;
  url?: string;
  frequency?: 'hourly' | 'daily' | 'weekly' | 'monthly';
  selectors?: string;
  status?: 'active' | 'paused' | 'archived';
  schedule?: {
    enabled: boolean;
    timezone?: string;
  };
}

export interface GetSourcesQuery {
  source_type?: string;
  limit?: number;
  offset?: number;
}

export interface CreateSourceRequest {
  name: string;
  url: string;
  source_type: string;
  config?: Record<string, any>;
  enabled: boolean;
}

export interface GetQueryRunsQuery {
  query_id?: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  limit?: number;
  offset?: number;
}

export interface RunQueryRequest {
  query_id: string;
  force?: boolean;
}

export interface GetQueryResultsQuery {
  run_id?: string;
  query_id?: string;
  limit?: number;
  offset?: number;
}

export interface GetStatsQuery {
  query_id?: string;
  source_id?: string;
  date_from?: string;
  date_to?: string;
}
