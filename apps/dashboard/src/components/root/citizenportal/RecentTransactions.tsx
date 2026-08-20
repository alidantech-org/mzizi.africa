import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserCheck } from 'lucide-react';

interface Transaction {
  id: number;
  donor: string;
  amount: number;
  recipient: string;
  date: string;
  status: string;
  risk: string;
}

interface RecentTransactionsProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
  getRiskColor: (risk: string) => string;
}

export function RecentTransactions({ transactions, formatCurrency, getStatusColor, getRiskColor }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Recent Transactions
          <Button variant="outline" size="sm">
            View All
          </Button>
        </CardTitle>
        <CardDescription>Latest political finance activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.slice(0, 4).map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-gray-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{transaction.donor}</p>
                  <p className="text-sm text-gray-500">{transaction.recipient}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{formatCurrency(transaction.amount)}</p>
                <div className="flex items-center space-x-2">
                  <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  <Badge className={getRiskColor(transaction.risk)}>{transaction.risk}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
