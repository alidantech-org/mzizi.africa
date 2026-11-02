import WebScraperClient from '@/components/admin/scraper/WebScraperClient';
import { getScrapingQueries, getScrapingRuns } from './actions';
import type { Query, QueryRun } from './types';

// Transform query runs into events format for the frontend
function transformRunsToEvents(runs: QueryRun[]) {
  return runs.map((run) => ({
    id: parseInt(run.id, 10), // Convert string ID to number for frontend compatibility
    queryName: `Query ${run.query_id}`, // In real app, you'd fetch the query name
    status: (run.status === 'completed'
      ? 'success'
      : run.status === 'failed'
        ? 'failed'
        : run.status === 'running'
          ? 'warning'
          : 'pending') as 'success' | 'failed' | 'warning' | 'pending',
    startTime: run.started_at || run.created_at,
    endTime: run.completed_at || run.started_at || run.created_at,
    recordsFound: run.records_found,
    errors: run.errors,
  }));
}

// Metadata for the page
export const metadata = {
  title: 'Web Scraper Management | Admin',
  description: 'Configure and monitor web scraping tasks for political finance data',
};

export default async function WebScraperPage() {
  // Fetch data server-side using real API
  const { body: queriesData } = await getScrapingQueries({ limit: 100 });
  const { body: runsData } = await getScrapingRuns({ limit: 100 });

  // Convert string IDs to numbers for frontend compatibility
  const queries =
    queriesData?.queries?.map((q) => ({
      ...q,
      id: parseInt(q?.id as any, 10),
      lastRun: q.last_run || q.lastRun || '-',
      nextRun: q.next_run || q.nextRun || '-',
    })) || [];

  const events = transformRunsToEvents(runsData?.runs || []);

  return <WebScraperClient initialQueries={queries} initialEvents={events} />;
}
