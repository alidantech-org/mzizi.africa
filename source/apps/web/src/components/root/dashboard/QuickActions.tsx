import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, FileText, Search, Download, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
  const actions = [
    {
      title: 'Candidate Monitoring',
      description: 'Monitor and analyze candidate financial activities and spending patterns',
      icon: User,
      href: '/dashboard/candidates',
      color: 'text-blue-600',
    },
    {
      title: 'Risk Assessment',
      description: 'View and manage risk assessments and compliance violations',
      icon: Shield,
      href: '/dashboard/risk',
      color: 'text-orange-600',
    },
    {
      title: 'Generate Reports',
      description: 'Create detailed financial compliance and risk analysis reports',
      icon: FileText,
      href: '/dashboard/reports',
      color: 'text-purple-600',
    },
    {
      title: 'Blockchain Verification',
      description: 'Verify financial data integrity using blockchain hash verification',
      icon: Search,
      href: '/dashboard/analytics',
      color: 'text-green-600',
    },
    {
      title: 'Export Data',
      description: 'Download political finance data for offline analysis and research',
      icon: Download,
      href: '/dashboard/analytics',
      color: 'text-indigo-600',
    },
    {
      title: 'Alert Management',
      description: 'Review and manage financial anomaly alerts and notifications',
      icon: AlertTriangle,
      href: '/dashboard/activity',
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {actions.map((action, i) => (
        <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer group">
          <CardHeader>
            <CardTitle className="flex items-center">
              <action.icon className={`h-5 w-5 mr-2 ${action.color} group-hover:scale-110 transition-transform`} />
              {action.title}
            </CardTitle>
            <CardDescription>{action.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href={action.href}>Access {action.title}</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
