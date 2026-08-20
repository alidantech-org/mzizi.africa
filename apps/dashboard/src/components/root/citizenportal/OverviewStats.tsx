import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, AlertTriangle, CheckCircle, DollarSign, Shield, Activity } from 'lucide-react';

interface OverviewStatsProps {
  stats: {
    totalDonations: number;
    donors: number;
    suspiciousTransactions: number;
    complianceRate: number;
    growthRate: number;
  };
  formatCurrency: (amount: number) => string;
}

export function OverviewStats({ stats, formatCurrency }: OverviewStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalDonations)}</p>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">{stats.growthRate}%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.donors.toLocaleString()}</p>
              <div className="flex items-center mt-2 text-green-600">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm">+8.3%</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Suspicious</p>
              <p className="text-2xl font-bold text-gray-900">{stats.suspiciousTransactions}</p>
              <div className="flex items-center mt-2 text-red-600">
                <AlertTriangle className="w-4 h-4 mr-1" />
                <span className="text-sm">Requires review</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Compliance</p>
              <p className="text-2xl font-bold text-gray-900">{stats.complianceRate}%</p>
              <div className="flex items-center mt-2 text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm">Good</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.growthRate}%</p>
              <div className="flex items-center mt-2 text-blue-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span className="text-sm">Positive</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
