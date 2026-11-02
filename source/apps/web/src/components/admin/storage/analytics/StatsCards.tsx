'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, HardDrive, TrendingUp } from 'lucide-react';

interface StatsCardsProps {
  totalFiles: number;
  totalSize: number;
  totalFolders: number;
  avgFileSize: string;
  loading?: boolean;
}

export default function StatsCards({ 
  totalFiles, 
  totalSize, 
  totalFolders, 
  avgFileSize, 
  loading = false 
}: StatsCardsProps) {
  const formatSize = (sizeInMB: number) => {
    if (sizeInMB >= 1024) {
      return `${(sizeInMB / 1024).toFixed(2)} GB`;
    }
    return `${sizeInMB.toFixed(2)} MB`;
  };

  const stats = [
    {
      title: 'Total Files',
      value: totalFiles.toLocaleString(),
      description: 'Files in storage',
      icon: FileText,
      color: 'text-blue-600',
    },
    {
      title: 'Total Storage',
      value: formatSize(totalSize),
      description: 'Used storage',
      icon: HardDrive,
      color: 'text-green-600',
    },
    {
      title: 'Total Folders',
      value: totalFolders.toLocaleString(),
      description: 'Active folders',
      icon: FolderOpen,
      color: 'text-purple-600',
    },
    {
      title: 'Avg File Size',
      value: avgFileSize,
      description: 'Average file size',
      icon: TrendingUp,
      color: 'text-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className={loading ? 'animate-pulse' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
