import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChartComponent, LineChartComponent } from './ChartComponents';

interface PartyAnalysis {
  name: string;
  totalFunds: number;
  donors: number;
  growth: number;
  compliance: number;
}

interface ChartsSectionProps {
  partyAnalysis: PartyAnalysis[];
}

export function ChartsSection({ partyAnalysis }: ChartsSectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Party Funds Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Party Funds Distribution</CardTitle>
          <CardDescription>Total funds by political party</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChartComponent
            data={partyAnalysis.map((p) => p.totalFunds)}
            labels={partyAnalysis.map((p) => p.name.split(' ')[0])}
            color="bg-blue-500"
          />
        </CardContent>
      </Card>

      {/* Donation Trend Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Trends</CardTitle>
          <CardDescription>Monthly donation patterns over time</CardDescription>
        </CardHeader>
        <CardContent>
          <LineChartComponent
            data={[3200000, 3800000, 3500000, 4200000, 4800000, 5200000]}
            labels={['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
          />
        </CardContent>
      </Card>
    </div>
  );
}
