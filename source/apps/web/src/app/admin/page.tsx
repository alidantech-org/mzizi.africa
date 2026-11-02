'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  FileText,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Download,
  BarChart3,
  Shield,
  Database,
  Activity,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  // Mock data for demonstration
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      description: 'Active registered users',
    },
    {
      title: 'Reports Filed',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: FileText,
      description: 'Total reports submitted',
    },
    {
      title: 'Data Records',
      value: '45.2K',
      change: '+23.1%',
      trend: 'up',
      icon: Database,
      description: 'Political finance records',
    },
    {
      title: 'Active Alerts',
      value: '23',
      change: '-5.3%',
      trend: 'down',
      icon: AlertTriangle,
      description: 'Suspicious activity alerts',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'New suspicious donation report',
      description: 'User reported unusual donation pattern from XYZ Corporation',
      time: '2 minutes ago',
      status: 'pending',
      priority: 'high',
    },
    {
      id: 2,
      type: 'user',
      title: 'New user registration',
      description: 'John Doe registered as analyst user',
      time: '15 minutes ago',
      status: 'completed',
      priority: 'low',
    },
    {
      id: 3,
      type: 'data',
      title: 'Data import completed',
      description: 'Successfully imported 1,234 political finance records',
      time: '1 hour ago',
      status: 'completed',
      priority: 'medium',
    },
    {
      id: 4,
      type: 'alert',
      title: 'System security alert',
      description: 'Multiple failed login attempts detected',
      time: '2 hours ago',
      status: 'resolved',
      priority: 'high',
    },
  ];

  const quickActions = [
    {
      title: 'View All Reports',
      description: 'Review and manage submitted reports',
      icon: FileText,
      href: '/admin/reports',
      color: 'bg-blue-500',
    },
    {
      title: 'Manage Users',
      description: 'Add, edit, or remove user accounts',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500',
    },
    {
      title: 'Data Analytics',
      description: 'View detailed analytics and insights',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-purple-500',
    },
    {
      title: 'Security Settings',
      description: 'Configure security and access controls',
      icon: Shield,
      href: '/admin/security',
      color: 'bg-red-500',
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return <FileText className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'data':
        return <Database className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      {/* <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your political finance transparency platform</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Activity className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div> */}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={`inline-flex items-center ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                  {stat.change}
                </span>{' '}
                from last month
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href={action.href}>
              <CardHeader className="text-center">
                <div className={`mx-auto h-12 w-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest system activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                  <div className="mt-1">{getActivityIcon(activity.type)}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
                      <Badge className={getPriorityColor(activity.priority)} variant="outline">
                        {activity.priority}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              System Status
            </CardTitle>
            <CardDescription>Current platform health and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">API Server</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">Operational</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Database</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">Healthy</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">File Storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-yellow-600">Warning</span>
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-foreground">Email Service</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-green-600">Active</span>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">System Uptime</span>
                <span className="text-foreground font-medium">99.9%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Response Time</span>
                <span className="text-foreground font-medium">142ms</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Error Rate</span>
                <span className="text-foreground font-medium">0.12%</span>
              </div>
            </div>

            <div className="mt-4">
              <Button variant="outline" className="w-full">
                <Eye className="mr-2 h-4 w-4" />
                View Detailed Metrics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
