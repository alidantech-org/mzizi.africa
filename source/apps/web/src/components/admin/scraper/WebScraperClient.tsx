'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import QueryTable from './QueryTable';
import EventTable from './EventTable';
import CreateQueryDialog from './CreateQueryDialog';
import EditQueryDialog from './EditQueryDialog';
import DeleteQueryDialog from './DeleteQueryDialog';
import RunQueryDialog from './RunQueryDialog';
import {
  createScrapingQuery,
  updateScrapingQuery,
  deleteScrapingQuery,
  runScrapingQuery,
  pauseScrapingQuery,
  resumeScrapingQuery,
} from '@/app/admin/scraper/actions';
import type { Query, Event } from '@/app/admin/scraper/types';

interface WebScraperClientProps {
  initialQueries: Query[];
  initialEvents: Event[];
}

export default function WebScraperClient({ initialQueries, initialEvents }: WebScraperClientProps) {
  const [queries, setQueries] = useState(initialQueries);
  const [events] = useState(initialEvents);
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRunDialogOpen, setIsRunDialogOpen] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const handleCreateQuery = async (query: { name: string; url: string; frequency: string; selectors: string }) => {
    setIsLoading(true);
    try {
      const response = await createScrapingQuery({
        name: query.name,
        url: query.url,
        frequency: query.frequency as 'hourly' | 'daily' | 'weekly' | 'monthly',
        selectors: query.selectors,
      });

      if (response.success && response.body && response.body.query) {
        setQueries([...queries, response.body.query]);
        toast.success('Query created successfully!');
      } else {
        toast.error(response.message || 'Failed to create query');
      }
    } catch (error) {
      toast.error('Error creating query');
      console.error('Create query error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditQuery = async (query: Query) => {
    setIsLoading(true);
    try {
      const response = await updateScrapingQuery(query.id.toString(), {
        name: query.name,
        url: query.url,
        frequency: query.frequency,
        status: query.status,
      });

      if (response.success && response.body && response.body.query) {
        setQueries(queries.map((q) => (q.id === query.id ? response.body!.query : q)));
        toast.success('Query updated successfully!');
      } else {
        toast.error(response.message || 'Failed to update query');
      }
    } catch (error) {
      toast.error('Error updating query');
      console.error('Update query error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuery = async (query: Query) => {
    setIsLoading(true);
    try {
      const response = await deleteScrapingQuery(query.id.toString());

      if (response.success) {
        setQueries(queries.filter((q) => q.id !== query.id));
        toast.success('Query deleted successfully!');
      } else {
        toast.error(response.message || 'Failed to delete query');
      }
    } catch (error) {
      toast.error('Error deleting query');
      console.error('Delete query error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunQuery = async (query: Query) => {
    setIsLoading(true);
    try {
      const response = await runScrapingQuery(query.id.toString());

      if (response.success) {
        toast.success('Query execution started!');
        // In a real app, you might want to refresh the runs data
      } else {
        toast.error(response.message || 'Failed to run query');
      }
    } catch (error) {
      toast.error('Error running query');
      console.error('Run query error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (query: Query) => {
    try {
      let response;
      if (query.status === 'active') {
        response = await pauseScrapingQuery(query.id.toString());
      } else {
        response = await resumeScrapingQuery(query.id.toString());
      }

      if (response.success) {
        setQueries(queries.map((q) => (q.id === query.id ? { ...q, status: q.status === 'active' ? 'paused' : 'active' } : q)));
        toast.success(`Query ${query.status === 'active' ? 'paused' : 'resumed'} successfully!`);
      } else {
        toast.error(response.message || 'Failed to toggle query status');
      }
    } catch (error) {
      toast.error('Error toggling query status');
      console.error('Toggle status error:', error);
    }
  };

  const openEditDialog = (query: Query) => {
    setSelectedQuery(query);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (query: Query) => {
    setSelectedQuery(query);
    setIsDeleteDialogOpen(true);
  };

  const openRunDialog = (query: Query) => {
    setSelectedQuery(query);
    setIsRunDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <Tabs defaultValue="queries" className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="queries">Scraping Queries</TabsTrigger>
            <TabsTrigger value="events">Execution Events</TabsTrigger>
          </TabsList>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Scraping Query
          </Button>
        </div>

        <TabsContent value="queries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Queries</CardTitle>
              <CardDescription>Manage your web scraping queries and their execution schedules.</CardDescription>
            </CardHeader>
            <CardContent>
              <QueryTable
                queries={queries}
                onEdit={openEditDialog}
                onDelete={openDeleteDialog}
                onRun={openRunDialog}
                onToggleStatus={handleToggleStatus}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution History</CardTitle>
              <CardDescription>View the history of scraping task executions and their results.</CardDescription>
            </CardHeader>
            <CardContent>
              <EventTable events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <CreateQueryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateQuery={handleCreateQuery}
        isLoading={isLoading}
      />

      <EditQueryDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        query={selectedQuery}
        onUpdateQuery={handleEditQuery}
        isLoading={isLoading}
      />

      <DeleteQueryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        query={selectedQuery}
        onDeleteQuery={handleDeleteQuery}
        isLoading={isLoading}
      />

      <RunQueryDialog
        open={isRunDialogOpen}
        onOpenChange={setIsRunDialogOpen}
        query={selectedQuery}
        onRunQuery={handleRunQuery}
        isLoading={isLoading}
      />
    </div>
  );
}
