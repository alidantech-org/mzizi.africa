'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import { WeekLabels } from '@/app/admin/storage/utils/weekLabels';
import { getYAxisProps } from '@/app/admin/storage/utils/yAxisConfig';

interface UploadTrendsChartProps {
  data: {
    monthly: Array<{
      period: string;
      upload_count: number;
      total_size: number;
      file_count: number;
    }>;
    weekly: Array<{
      period: string;
      upload_count: number;
      total_size: number;
      file_count: number;
    }>;
    daily: Array<{
      period: string;
      upload_count: number;
      total_size: number;
      file_count: number;
    }>;
    yearly: Array<{
      period: string;
      upload_count: number;
      total_size: number;
      file_count: number;
    }>;
  };
  loading?: boolean;
  growthType?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

interface ChartDataItem {
  date: string;
  uploads: number;
  size: number;
  weekInfo?: import('@/app/admin/storage/utils/weekLabels').WeekInfo;
}

export default function UploadTrendsChart({ data, loading = false, growthType = 'monthly' }: UploadTrendsChartProps) {
  const [currentView, setCurrentView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(growthType);

  // Get data based on current view
  const getCurrentData = () => {
    switch (currentView) {
      case 'daily':
        return data.daily || [];
      case 'weekly':
        return data.weekly || [];
      case 'yearly':
        return data.yearly || [];
      default:
        return data.monthly || [];
    }
  };

  // Generate complete timeline based on view
  const generateTimelineData = () => {
    const currentYear = new Date().getFullYear();

    if (currentView === 'yearly') {
      // Past 4 years + current year
      return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 4 + i;
        return {
          date: year.toString(),
          uploads: 0,
          size: 0,
        };
      });
    } else if (currentView === 'monthly') {
      // All months of current year
      return Array.from({ length: 12 }, (_, i) => {
        const date = new Date(currentYear, i, 1);
        return {
          date: date.toISOString().slice(0, 7),
          uploads: 0,
          size: 0,
        };
      });
    } else if (currentView === 'weekly') {
      // Current month weeks
      return WeekLabels.getCurrentMonthWeeks().map((weekInfo) => ({
        date: `${weekInfo.year}-W${String(weekInfo.weekNumber).padStart(2, '0')}`,
        uploads: 0,
        size: 0,
        weekInfo: weekInfo,
      }));
    } else {
      // Daily - last 7 days
      return Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().slice(0, 10),
          uploads: 0,
          size: 0,
        };
      });
    }
  };

  // Merge actual data with timeline
  const timelineData = generateTimelineData();
  const actualData = getCurrentData();

  const chartData = timelineData.map((timelineItem) => {
    const match = actualData.find((d: any) => d.period === timelineItem.date);
    if (match) {
      return {
        ...timelineItem,
        uploads: match.upload_count,
        size: match.total_size / (1024 * 1024), // Convert to MB
      };
    }
    return timelineItem;
  });

  // Format data for Recharts
  const formattedData = chartData.map((item: ChartDataItem) => ({
    ...item,
    parsedDate:
      currentView === 'yearly'
        ? new Date(item.date + '-01-01')
        : currentView === 'monthly'
          ? new Date(item.date + '-01')
          : currentView === 'weekly'
            ? item.weekInfo?.startDate || new Date(item.date)
            : new Date(item.date),
    displayName:
      currentView === 'yearly'
        ? item.date
        : currentView === 'monthly'
          ? new Date(item.date + '-01').toLocaleDateString('en-US', { month: 'short' })
          : currentView === 'weekly'
            ? item.weekInfo?.weekLabel || item.date
            : item.date,
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Trends</CardTitle>
          <CardDescription>File uploads over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between flex-col gap-4 md:flex-row items-center">
          <div>
            <CardTitle className="">Upload Trends</CardTitle>
            {/* <CardDescription className="text-muted">File uploads over time</CardDescription> */}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentView('daily')}
              className={`px-3 py-1 rounded text-sm ${currentView === 'daily' ? 'bg-primary text-white' : 'bg-muted'}`}
            >
              Daily
            </button>
            <button
              onClick={() => setCurrentView('weekly')}
              className={`px-3 py-1 rounded text-sm ${currentView === 'weekly' ? 'bg-primary text-white' : 'bg-muted'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setCurrentView('monthly')}
              className={`px-3 py-1 rounded text-sm ${currentView === 'monthly' ? 'bg-primary text-white' : 'bg-muted'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setCurrentView('yearly')}
              className={`px-3 py-1 rounded text-sm ${currentView === 'yearly' ? 'bg-primary text-white' : 'bg-muted'}`}
            >
              Yearly
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer className="p-0 -ml-10 min-w-[110%]" width="" height="100%">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="uploadsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="sizeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity={0.1} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="displayName"
                stroke="rgb(107, 114, 128)"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 10 }}
                tickFormatter={(value, index) => {
                  if (currentView === 'monthly') {
                    // Show every other month for monthly view
                    return index % 2 === 0 ? value : '';
                  } else if (currentView === 'yearly') {
                    return value;
                  } else if (currentView === 'daily') {
                    // Show week days for daily view
                    const date = new Date(value);
                    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    return dayNames[date.getDay()];
                  }
                  return value; // Show all weeks
                }}
                label={{ value: 'Time Period', position: 'insideBottom', offset: -5, fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <YAxis
                {...getYAxisProps(formattedData, 'uploads')}
                stroke="transparent"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 8 }}
                label={{ value: 'Upload Count', offset: 25, angle: -90, position: 'insideLeft', fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border border-gray-300 rounded shadow-sm">
                        <p className="font-semibold text-primary">{data.date}</p>
                        <p className="text-accent">Uploads: {data.uploads.toLocaleString()}</p>
                        <p className="text-foreground">Size: {data.size.toFixed(2)} MB</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Area type="monotone" dataKey="uploads" stroke="rgb(59, 130, 246)" strokeWidth={2} fill="url(#uploadsGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
