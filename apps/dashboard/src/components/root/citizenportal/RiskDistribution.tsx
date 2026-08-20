import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChartComponent } from './ChartComponents';

interface RiskAnalysis {
  high: number;
  medium: number;
  low: number;
  total: number;
}

interface RiskDistributionProps {
  riskAnalysis: RiskAnalysis;
}

export function RiskDistribution({ riskAnalysis }: RiskDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Distribution</CardTitle>
        <CardDescription>Transaction risk levels breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <PieChartComponent
            data={[riskAnalysis.high, riskAnalysis.medium, riskAnalysis.low]}
            colors={['#ef4444', '#eab308', '#22c55e']}
            labels={['High Risk', 'Medium Risk', 'Low Risk']}
          />
          <div className="flex justify-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>High ({riskAnalysis.high})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Medium ({riskAnalysis.medium})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span>Low ({riskAnalysis.low})</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
