import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Shield, FileText, AlertTriangle, TrendingUp } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      time: '2 hours ago',
      type: 'risk',
      user: 'John Kamau',
      action: 'High risk alert triggered',
      details: 'Unusual spending pattern detected - KES 2.5M in single transaction',
      icon: AlertTriangle,
      color: 'text-red-600',
      severity: 'high',
    },
    {
      time: '4 hours ago',
      type: 'compliance',
      user: 'Mary Wanjiru',
      action: 'Compliance report submitted',
      details: 'Monthly financial disclosure for Nairobi Constituency',
      icon: FileText,
      color: 'text-blue-600',
      severity: 'medium',
    },
    {
      time: '6 hours ago',
      type: 'candidate',
      user: 'System',
      action: 'New candidate registered',
      details: 'David Mutua - Kiambu County, Governor Seat',
      icon: User,
      color: 'text-green-600',
      severity: 'low',
    },
    {
      time: '8 hours ago',
      type: 'risk',
      user: 'James Muriuki',
      action: 'Risk assessment completed',
      details: 'Campaign efficiency analysis shows 23% improvement',
      icon: TrendingUp,
      color: 'text-purple-600',
      severity: 'low',
    },
    {
      time: '12 hours ago',
      type: 'compliance',
      user: 'Grace Kariuki',
      action: 'Blockchain verification completed',
      details: 'Financial records hash verified and stored on blockchain',
      icon: Shield,
      color: 'text-orange-600',
      severity: 'medium',
    },
    {
      time: '1 day ago',
      type: 'risk',
      user: 'System',
      action: 'Anomaly detected in donor funding',
      details: 'Foreign funding source requires additional verification',
      icon: AlertTriangle,
      color: 'text-red-600',
      severity: 'high',
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'high':
        return <Badge variant="destructive">High</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">Info</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest political finance monitoring activities and alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, i) => (
            <div key={i} className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  {getSeverityBadge(activity.severity)}
                </div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    {activity.user} • {activity.time}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{activity.details}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
