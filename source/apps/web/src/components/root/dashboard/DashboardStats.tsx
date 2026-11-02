import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, TrendingUp, Shield, FileText } from 'lucide-react';

interface DashboardStatsProps {
  initialStatistics?: {
    counties: number;
    parties: number;
    candidates: number;
    total_population: number;
  } | null;
}

export default function DashboardStats({ initialStatistics }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Counties</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialStatistics?.counties || 47}</div>
          <p className="text-xs text-muted-foreground">All Kenyan counties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Political Parties</CardTitle>
          <Shield className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialStatistics?.parties || 0}</div>
          <p className="text-xs text-muted-foreground">Registered parties</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Candidates</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{initialStatistics?.candidates || 0}</div>
          <p className="text-xs text-muted-foreground">Active candidates</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Population</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {initialStatistics?.total_population ? (initialStatistics.total_population / 1000000).toFixed(1) + 'M' : 'N/A'}
          </div>
          <p className="text-xs text-muted-foreground">Total population</p>
        </CardContent>
      </Card>
    </div>
  );
}
