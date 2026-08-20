'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  Calendar,
  Download,
  Filter,
  RefreshCw,
  Eye,
  Activity,
  Target,
  Zap,
  Clock,
  MapPin,
  Building,
} from 'lucide-react';

export default function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Sample analytics data
  const financialMetrics = {
    totalFunds: 2400000000,
    fundsGrowth: 18.2,
    avgDonation: 15420,
    topDonor: 'Kenya Holdings Ltd',
    complianceRate: 87.3,
    riskScore: 42.1,
  };

  const trendData = [
    { month: 'Jan', funds: 1800000000, donations: 1200, risk: 38 },
    { month: 'Feb', funds: 1950000000, donations: 1350, risk: 41 },
    { month: 'Mar', funds: 2100000000, donations: 1420, risk: 39 },
    { month: 'Apr', funds: 2250000000, donations: 1510, risk: 43 },
    { month: 'May', funds: 2400000000, donations: 1620, risk: 42 },
  ];

  const countyAnalytics = [
    { name: 'Nairobi', funds: 450000000, donations: 320, risk: 'high', compliance: 92 },
    { name: 'Mombasa', funds: 280000000, donations: 180, risk: 'medium', compliance: 88 },
    { name: 'Kisumu', funds: 220000000, donations: 150, risk: 'low', compliance: 94 },
    { name: 'Nakuru', funds: 190000000, donations: 140, risk: 'medium', compliance: 85 },
    { name: 'Eldoret', funds: 160000000, donations: 120, risk: 'low', compliance: 90 },
  ];

  const partyAnalytics = [
    { name: 'Jubilee Party', funds: 850000000, donations: 480, compliance: 92, risk: 'low' },
    { name: 'ODM', funds: 720000000, donations: 420, compliance: 88, risk: 'medium' },
    { name: 'UDA', funds: 580000000, donations: 380, compliance: 76, risk: 'high' },
    { name: 'Wiper', funds: 250000000, donations: 180, compliance: 68, risk: 'high' },
  ];

  const riskFactors = [
    { factor: 'Late Reporting', count: 23, severity: 'high', trend: 'up' },
    { factor: 'Unverified Sources', count: 18, severity: 'medium', trend: 'down' },
    { factor: 'Overspending', count: 12, severity: 'high', trend: 'stable' },
    { factor: 'Missing Documentation', count: 8, severity: 'low', trend: 'down' },
  ];

  const periods = [
    { id: '7d', name: '7 Days' },
    { id: '30d', name: '30 Days' },
    { id: '90d', name: '90 Days' },
    { id: '1y', name: '1 Year' },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-orange-600 bg-orange-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-green-500" />;
      default:
        return <div className="w-4 h-4 bg-gray-300 rounded-full" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return `KES ${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6 py-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          {periods.map((period) => (
            <Button
              key={period.id}
              variant={selectedPeriod === period.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period.id)}
            >
              {period.name}
            </Button>
          ))}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Funds</p>
                <p className="text-2xl font-bold">{formatCurrency(financialMetrics.totalFunds)}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+{financialMetrics.fundsGrowth}%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Compliance Rate</p>
                <p className="text-2xl font-bold">{financialMetrics.complianceRate}%</p>
                <div className="flex items-center mt-2">
                  <Target className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">On target</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Score</p>
                <p className="text-2xl font-bold">{financialMetrics.riskScore}</p>
                <div className="flex items-center mt-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500 mr-1" />
                  <span className="text-sm text-orange-600">Moderate</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Donation</p>
                <p className="text-2xl font-bold">{formatCurrency(financialMetrics.avgDonation)}</p>
                <div className="flex items-center mt-2">
                  <Users className="w-4 h-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600">Per donor</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funds Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <LineChart className="w-5 h-5 mr-2" />
              Funds Trend Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <LineChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive line chart showing funds over time</p>
                <p className="text-sm text-gray-500">Based on selected period: {selectedPeriod}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="w-5 h-5 mr-2" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <PieChart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Risk levels across all entities</p>
                <div className="flex justify-center space-x-4 mt-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm">High (23)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-sm">Medium (18)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm">Low (8)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* County Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            County Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">County</th>
                  <th className="text-left p-3">Total Funds</th>
                  <th className="text-left p-3">Donations</th>
                  <th className="text-left p-3">Risk Level</th>
                  <th className="text-left p-3">Compliance</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {countyAnalytics.map((county, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{county.name}</td>
                    <td className="p-3">{formatCurrency(county.funds)}</td>
                    <td className="p-3">{county.donations}</td>
                    <td className="p-3">
                      <Badge className={getRiskColor(county.risk)}>{county.risk}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className={`h-2 rounded-full ${
                              county.compliance >= 90 ? 'bg-green-500' : county.compliance >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${county.compliance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{county.compliance}%</span>
                      </div>
                    </td>
                    <td className="p-3">
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

      {/* Party Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Party Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partyAnalytics.map((party, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{party.name}</p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(party.funds)} • {party.donations} donations
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(party.risk)}>{party.risk}</Badge>
                    <div className="text-sm">
                      <span className="font-medium">{party.compliance}%</span>
                      <span className="text-gray-500"> compliant</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Risk Factors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Risk Factors Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((factor, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{factor.factor}</p>
                    <p className="text-sm text-gray-600">{factor.count} occurrences</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getRiskColor(factor.severity)}>{factor.severity}</Badge>
                    {getTrendIcon(factor.trend)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
