import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, TrendingUp, Activity } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

export default function RiskAnalytics() {
  // Sample data for political finance risk analysis
  const riskDistribution = [
    { name: 'High Risk', value: 15, color: '#dc2626' },
    { name: 'Medium Risk', value: 28, color: '#f97316' },
    { name: 'Low Risk', value: 35, color: '#eab308' },
    { name: 'Minimal Risk', value: 22, color: '#22c55e' },
  ];

  const candidateRiskData = [
    { candidate: 'John Kamau', risk: 85, spending: 4500000, violations: 3 },
    { candidate: 'Mary Wanjiru', risk: 72, spending: 3200000, violations: 2 },
    { candidate: 'David Mutua', risk: 68, spending: 2800000, violations: 2 },
    { candidate: 'Sarah Njoroge', risk: 45, spending: 1500000, violations: 1 },
    { candidate: 'James Muriuki', risk: 38, spending: 1200000, violations: 0 },
    { candidate: 'Grace Kariuki', risk: 25, spending: 800000, violations: 0 },
  ];

  const monthlyTrends = [
    { month: 'Jan', incidents: 12, spending: 45000000, reports: 23 },
    { month: 'Feb', incidents: 8, spending: 38000000, reports: 18 },
    { month: 'Mar', incidents: 15, spending: 52000000, reports: 31 },
    { month: 'Apr', incidents: 22, spending: 67000000, reports: 45 },
    { month: 'May', incidents: 28, spending: 89000000, reports: 52 },
    { month: 'Jun', incidents: 18, spending: 62000000, reports: 38 },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Risk Distribution Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Risk Distribution
          </CardTitle>
          <CardDescription>Candidate risk level breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Candidate Risk Levels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Candidate Risk Levels
          </CardTitle>
          <CardDescription>Risk scores and spending analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={candidateRiskData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="candidate" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="risk" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Financial Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Financial Trends
          </CardTitle>
          <CardDescription>Campaign spending and incident patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="spending" stroke="#3b82f6" name="Spending (KES)" />
              <Line yAxisId="right" type="monotone" dataKey="incidents" stroke="#f97316" name="Incidents" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Compliance Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Compliance Reports
          </CardTitle>
          <CardDescription>Monthly compliance and reporting activity</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="reports" fill="#22c55e" name="Reports Generated" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
