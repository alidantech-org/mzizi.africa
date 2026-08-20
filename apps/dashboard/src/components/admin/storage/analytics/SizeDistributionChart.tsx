'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';
import { getYAxisProps } from '../../../../app/admin/storage/utils/yAxisConfig';

interface SizeDistributionChartProps {
  data: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  loading?: boolean;
}

export default function SizeDistributionChart({ data, loading = false }: SizeDistributionChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Custom colors for different size ranges
  const getBarColor = (index: number) => {
    const colors = [
      'rgb(34, 197, 94)', // 0-1MB - green (small files)
      'rgb(59, 130, 246)', // 1-10MB - blue (small-medium)
      'rgb(245, 158, 11)', // 10-50MB - amber (medium)
      'rgb(249, 115, 22)', // 50-100MB - orange (large)
      'rgb(239, 68, 68)', // 100MB+ - red (very large)
    ];
    return colors[index % colors.length];
  };

  // Format data for Recharts
  const formattedData = data.map((item, index) => ({
    ...item,
    color: getBarColor(index),
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Size Distribution</CardTitle>
          <CardDescription>File size ranges</CardDescription>
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
        <CardTitle>Size Distribution</CardTitle>
        <CardDescription>File size ranges</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer className="p-0 -ml-10 min-w-[110%]" width="" height="100%">
            <BarChart data={formattedData}>
              <XAxis
                dataKey="range"
                stroke="rgb(107, 114, 128)"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 10 }}
                interval={0}
                label={{ value: 'File Size Range', position: 'insideBottom', offset: -5, fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <YAxis
                {...getYAxisProps(formattedData, 'count')}
                stroke="transparent"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 8 }}
                label={{ value: 'File Count', offset: 25, angle: -90, position: 'insideLeft', fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2  rounded shadow-sm">
                        <p className="font-semibold" style={{ color: 'var(--primary)' }}>
                          {data.range}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--blue-600)' }}>
                          Files: {data.count.toLocaleString()}
                        </p>
                        <p className="text-sm" style={{ color: 'var(--green-600)' }}>
                          Percentage: {data.percentage}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="count"
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data, index) => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke={hoveredBar === index ? entry.color : 'transparent'}
                    strokeWidth={hoveredBar === index ? 1 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
