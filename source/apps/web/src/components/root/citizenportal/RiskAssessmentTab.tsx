import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';

interface RiskTransaction {
  name: string;
  recipient: string;
  amount: number;
  status: string;
}

interface RiskAssessmentTabProps {
  highRiskTransactions: RiskTransaction[];
  mediumRiskTransactions: RiskTransaction[];
  lowRiskTransactions: RiskTransaction[];
  formatCurrency: (amount: number) => string;
}

export function RiskAssessmentTab({
  highRiskTransactions,
  mediumRiskTransactions,
  lowRiskTransactions,
  formatCurrency,
}: RiskAssessmentTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center text-red-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            High Risk Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {highRiskTransactions.map((transaction, index) => (
              <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(transaction.amount)}</p>
                    <Badge className="bg-red-100 text-red-700">{transaction.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center text-yellow-600">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Medium Risk Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mediumRiskTransactions.map((transaction, index) => (
              <div key={index} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-yellow-600">{formatCurrency(transaction.amount)}</p>
                    <Badge className="bg-yellow-100 text-yellow-700">{transaction.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="w-5 h-5 mr-2" />
            Low Risk Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {lowRiskTransactions.map((transaction, index) => (
              <div key={index} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.name}</p>
                    <p className="text-sm text-gray-600">{transaction.recipient}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatCurrency(transaction.amount)}</p>
                    <Badge className="bg-green-100 text-green-700">{transaction.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
