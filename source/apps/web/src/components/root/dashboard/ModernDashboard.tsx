'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Users,
  FileText,
  MapPin,
  AlertTriangle,
  Shield,
  Download,
  Upload,
  Search,
  Filter,
  Activity,
  DollarSign,
  Eye,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  Database,
  PieChart,
  LineChart,
  Globe,
  UserCheck,
  Building,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import KenyaMap from './KenyaMap';

import * as Types from '@/types/action.interfaces';
import DataHub from './DataHub';
import Analytics from './Analytics';
import Profiles from './Profiles';

interface ModernDashboardProps {
  initialUser?: Types.User | null;
  initialError?: string | null;
  initialStatistics?: {
    counties: number;
    parties: number;
    candidates: number;
    total_population: number;
  } | null;
}

export default function ModernDashboard({ initialUser, initialError, initialStatistics }: ModernDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  // Sample data for dashboard
  const stats = {
    totalCampaigns: 247,
    complianceRate: 87.3,
    redFlags: 23,
    totalFunds: 'KES 2.4B',
    activeUsers: 1247,
    dataPoints: 15420,
    reportsGenerated: 892,
    riskScore: 42.1,
  };

  const recentActivity = [
    {
      id: 1,
      type: 'report',
      title: 'New campaign report submitted',
      location: 'Nairobi County',
      time: '2 hours ago',
      severity: 'low',
    },
    {
      id: 2,
      type: 'alert',
      title: 'Spending limit exceeded',
      location: 'Mombasa County',
      time: '5 hours ago',
      severity: 'high',
    },
    {
      id: 3,
      type: 'compliance',
      title: 'Compliance verification completed',
      location: 'Kisumu County',
      time: '1 day ago',
      severity: 'low',
    },
    {
      id: 4,
      type: 'data',
      title: 'New financial data uploaded',
      location: 'Nakuru County',
      time: '2 days ago',
      severity: 'low',
    },
  ];

  const quickActions = [
    {
      title: 'Generate Report',
      icon: FileText,
      color: 'bg-primary',
      description: 'Create comprehensive financial reports',
    },
    {
      title: 'Upload Data',
      icon: Upload,
      color: 'bg-primary',
      description: 'Import new campaign finance data',
    },
    {
      title: 'Risk Analysis',
      icon: AlertTriangle,
      color: 'bg-primary',
      description: 'Analyze potential financial risks',
    },
    {
      title: 'View Analytics',
      icon: BarChart3,
      color: 'bg-primary',
      description: 'Explore detailed analytics',
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'alert':
        return AlertTriangle;
      case 'compliance':
        return Shield;
      case 'data':
        return Database;
      default:
        return Activity;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && <span className="font-bold text-lg">Polifin</span>}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: BarChart3 },
              { id: 'datahub', label: 'Data Hub', icon: Database },
              { id: 'analytics', label: 'Analytics', icon: LineChart },
              { id: 'map', label: 'Interactive Map', icon: MapPin },
              { id: 'profiles', label: 'Profiles', icon: Users },
            ].map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start ${!sidebarOpen && 'px-2'}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {sidebarOpen && item.label}
              </Button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t">
            <div className={`flex items-center space-x-3 ${!sidebarOpen && 'justify-center'}`}>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-gray-600" />
              </div>
              {sidebarOpen && (
                <div className="flex-1">
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">admin@polifin.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'datahub' && 'Data Hub'}
                {activeTab === 'analytics' && 'Analytics'}
                {activeTab === 'map' && 'Interactive Map'}
                {activeTab === 'profiles' && 'Profiles'}
              </h1>
              <p className="text-gray-600">
                {activeTab === 'overview' && 'Real-time political finance monitoring'}
                {activeTab === 'datahub' && 'Centralized data management'}
                {activeTab === 'analytics' && 'Comprehensive data analysis'}
                {activeTab === 'map' && 'Geographic visualization of financial data'}
                {activeTab === 'profiles' && 'User and entity management'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Total Campaigns</p>
                        <p className="text-3xl font-bold text-primary">{stats.totalCampaigns}</p>
                        <p className="text-sm text-primary/80 mt-1">+12% this month</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Compliance Rate</p>
                        <p className="text-3xl font-bold text-primary">{stats.complianceRate}%</p>
                        <p className="text-sm text-primary/80 mt-1">+5.2% improvement</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Red Flags</p>
                        <p className="text-3xl font-bold text-primary">{stats.redFlags}</p>
                        <p className="text-sm text-primary/80 mt-1">8 high priority</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-primary">Total Funds</p>
                        <p className="text-3xl font-bold text-primary">{stats.totalFunds}</p>
                        <p className="text-sm text-primary/80 mt-1">+18% vs last cycle</p>
                      </div>
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className={`w-16 h-16 ${action.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                          <action.icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-semibold mb-2">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => {
                      const Icon = getActivityIcon(activity.type);
                      return (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-gray-600">
                              {activity.location} • {activity.time}
                            </p>
                          </div>
                          <Badge className={getSeverityColor(activity.severity)}>{activity.severity}</Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'datahub' && <DataHub />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'map' && <KenyaMap />}
          {activeTab === 'profiles' && <Profiles />}
        </main>
      </div>
    </div>
  );
}
