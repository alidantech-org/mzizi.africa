import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

interface PartyAnalysis {
  name: string;
  totalFunds: number;
  donors: number;
  growth: number;
  compliance: number;
}

interface PartyAnalysisTabProps {
  partyAnalysis: PartyAnalysis[];
  formatCurrency: (amount: number) => string;
}

export function PartyAnalysisTab({ partyAnalysis, formatCurrency }: PartyAnalysisTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {partyAnalysis.map((party) => (
        <Card key={party.name}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {party.name}
              <Badge variant="outline">{party.compliance}% compliant</Badge>
            </CardTitle>
            <CardDescription>Financial analysis and compliance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total Funds</p>
                <p className="text-lg font-bold text-gray-900">{formatCurrency(party.totalFunds)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Donors</p>
                <p className="text-lg font-bold text-gray-900">{party.donors.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-lg font-bold text-green-600">{party.growth}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliance</p>
                <p className="text-lg font-bold text-blue-600">{party.compliance}%</p>
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" size="sm" className="w-full">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Detailed Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
