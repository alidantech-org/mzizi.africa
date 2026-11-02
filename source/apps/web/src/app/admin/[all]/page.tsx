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
  UserCheck,
  Building2,
  Landmark,
  Vote,
  Map,
  MapPin,
  Globe,
  PieChart,
  Settings,
  LifeBuoy,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Search,
} from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

interface PageConfig {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
}

const pageConfigs: Record<string, PageConfig> = {
  politicians: {
    title: 'Politicians',
    description: 'Manage and view information about political figures',
    icon: UserCheck,
    color: 'bg-blue-500',
    features: ['View politician profiles', 'Track voting records', 'Monitor financial disclosures', 'Analyze campaign contributions'],
  },
  parties: {
    title: 'Political Parties',
    description: 'Manage political party information and data',
    icon: Building2,
    color: 'bg-purple-500',
    features: ['Party registration details', 'Membership statistics', 'Financial reports', 'Electoral performance'],
  },
  leaders: {
    title: 'Leaders',
    description: 'Track political leadership and positions',
    icon: Landmark,
    color: 'bg-indigo-500',
    features: ['Leadership positions', 'Term history', 'Policy initiatives', 'Public statements'],
  },
  elections: {
    title: 'Elections',
    description: 'Manage election data and results',
    icon: Vote,
    color: 'bg-green-500',
    features: ['Election schedules', 'Candidate information', 'Results tracking', 'Voter statistics'],
  },
  regions: {
    title: 'Regions',
    description: 'Geographic region management',
    icon: Map,
    color: 'bg-teal-500',
    features: ['Regional boundaries', 'Administrative divisions', 'Population data', 'Economic indicators'],
  },
  counties: {
    title: 'Counties',
    description: 'County-level data management',
    icon: MapPin,
    color: 'bg-orange-500',
    features: ['County profiles', 'Local governance', 'Infrastructure data', 'Development projects'],
  },
  constituencies: {
    title: 'Constituencies',
    description: 'Electoral constituency management',
    icon: Globe,
    color: 'bg-cyan-500',
    features: ['Boundary definitions', 'Representative information', 'Voter registration', 'Electoral history'],
  },
  demographics: {
    title: 'Demographics',
    description: 'Population and demographic data',
    icon: PieChart,
    color: 'bg-pink-500',
    features: ['Population statistics', 'Age distribution', 'Gender ratios', 'Education levels'],
  },
  statistics: {
    title: 'Statistics',
    description: 'Statistical analysis and reporting',
    icon: TrendingUp,
    color: 'bg-amber-500',
    features: ['Data visualization', 'Trend analysis', 'Comparative reports', 'Export capabilities'],
  },
  population: {
    title: 'Population Data',
    description: 'Detailed population information',
    icon: Users,
    color: 'bg-lime-500',
    features: ['Census data', 'Migration patterns', 'Urban/rural distribution', 'Growth projections'],
  },
  analytics: {
    title: 'Analytics',
    description: 'Advanced analytics and insights',
    icon: BarChart3,
    color: 'bg-violet-500',
    features: ['Custom dashboards', 'Data mining', 'Predictive analytics', 'Report generation'],
  },
  datahub: {
    title: 'Data Hub',
    description: 'Central data management platform',
    icon: Database,
    color: 'bg-slate-500',
    features: ['Data import/export', 'API integrations', 'Data validation', 'Backup management'],
  },
  reports: {
    title: 'Reports',
    description: 'Report management and generation',
    icon: FileText,
    color: 'bg-blue-600',
    features: ['Report templates', 'Scheduled reports', 'Custom reports', 'Distribution lists'],
  },
  security: {
    title: 'Security',
    description: 'Security settings and access control',
    icon: Shield,
    color: 'bg-red-500',
    features: ['Access management', 'Audit logs', 'Security policies', 'Threat monitoring'],
  },
  settings: {
    title: 'Settings',
    description: 'System configuration and preferences',
    icon: Settings,
    color: 'bg-gray-500',
    features: ['General settings', 'Notification preferences', 'Integration settings', 'System maintenance'],
  },
  users: {
    title: 'Users',
    description: 'User management and administration',
    icon: Users,
    color: 'bg-emerald-500',
    features: ['User accounts', 'Role management', 'Permissions', 'Activity tracking'],
  },
  support: {
    title: 'Support',
    description: 'Customer support and assistance',
    icon: LifeBuoy,
    color: 'bg-rose-500',
    features: ['Ticket management', 'Live chat', 'Knowledge base', 'FAQ management'],
  },
  help: {
    title: 'Help Center',
    description: 'Help documentation and guides',
    icon: HelpCircle,
    color: 'bg-sky-500',
    features: ['User guides', 'Video tutorials', 'Troubleshooting', 'Best practices'],
  },
  docs: {
    title: 'Documentation',
    description: 'Technical documentation and API reference',
    icon: BookOpen,
    color: 'bg-fuchsia-500',
    features: ['API documentation', 'Developer guides', 'Integration guides', 'Release notes'],
  },
  feedback: {
    title: 'Feedback',
    description: 'User feedback and suggestions',
    icon: MessageSquare,
    color: 'bg-yellow-500',
    features: ['Submit feedback', 'Feature requests', 'Bug reports', 'User surveys'],
  },
  scraper: {
    title: 'Web Scraper',
    description: 'Web scraping and data extraction tools',
    icon: Search,
    color: 'bg-neutral-600',
    features: ['URL management', 'Scraping schedules', 'Data extraction', 'Export options'],
  },
  files: {
    title: 'Files',
    description: 'File management and storage',
    icon: FileText,
    color: 'bg-stone-500',
    features: ['File upload', 'Document management', 'Version control', 'Sharing options'],
  },
};

export default function DynamicAdminPage({ params }: { params: Promise<{ all: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.all;
  const config = pageConfigs[slug];

  if (!config) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto h-16 w-16 rounded-lg bg-gray-200 flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-gray-500" />
            </div>
            <CardTitle className="text-2xl">Page Not Found</CardTitle>
            <CardDescription>The page &quot;{slug}&quot; does not exist or is not configured.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link href="/admin">
              <Button>Return to Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const IconComponent = config.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className={`h-14 w-14 rounded-lg ${config.color} flex items-center justify-center`}>
              <IconComponent className="h-7 w-7 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">{config.title}</CardTitle>
              <CardDescription className="text-base">{config.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {config.features.map((feature, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <CardTitle className="text-sm font-medium">{feature}</CardTitle>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Content Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {config.title} Management
          </CardTitle>
          <CardDescription>This section is under development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className={`h-20 w-20 rounded-full ${config.color} bg-opacity-10 flex items-center justify-center mb-4`}>
              <IconComponent className={`h-10 w-10 ${config.color.replace('bg-', 'text-')}`} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              The {config.title.toLowerCase()} management interface is currently being developed. Check back soon for updates.
            </p>
            <div className="flex gap-2 mt-6">
              <Link href="/admin">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Button>
                <Clock className="mr-2 h-4 w-4" />
                Get Notified
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground">Data not available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground">No recent updates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge className="bg-yellow-100 text-yellow-800">In Development</Badge>
            <p className="text-xs text-muted-foreground mt-2">Feature coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
