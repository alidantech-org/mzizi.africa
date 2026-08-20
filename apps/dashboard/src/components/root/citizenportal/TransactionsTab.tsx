import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

interface Transaction {
  id: number;
  donor: string;
  amount: number;
  recipient: string;
  date: string;
  status: string;
  risk: string;
}

interface TransactionsTabProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
  getRiskColor: (risk: string) => string;
}

export function TransactionsTab({ transactions, formatCurrency, getStatusColor, getRiskColor }: TransactionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Transactions</CardTitle>
        <CardDescription>Complete list of political finance transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Donor</th>
                <th className="text-left p-2">Recipient</th>
                <th className="text-left p-2">Amount</th>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Risk</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 font-medium">{transaction.donor}</td>
                  <td className="p-2">{transaction.recipient}</td>
                  <td className="p-2 font-medium">{formatCurrency(transaction.amount)}</td>
                  <td className="p-2">{transaction.date}</td>
                  <td className="p-2">
                    <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                  </td>
                  <td className="p-2">
                    <Badge className={getRiskColor(transaction.risk)}>{transaction.risk}</Badge>
                  </td>
                  <td className="p-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
