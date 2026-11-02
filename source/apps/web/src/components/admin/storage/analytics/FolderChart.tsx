'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useState } from 'react';
import { getYAxisProps } from '../../../../app/admin/storage/utils/yAxisConfig';

interface FolderChartProps {
  data: Array<{
    folder: string;
    files: number;
    size: number;
  }>;
  loading?: boolean;
}

export default function FolderChart({ data, loading = false }: FolderChartProps) {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);

  // Format data for Recharts
  const formattedData = data.map((item, index) => ({
    ...item,
    color: 'rgb(59, 130, 246)', // Blue color for all folders
  }));

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files by Folder</CardTitle>
          <CardDescription>File count per folder</CardDescription>
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
        <CardTitle>Files by Folder</CardTitle>
        <CardDescription>File count per folder</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer className="p-0 -ml-10 min-w-[110%] " width="" height="100%">
            <BarChart data={formattedData}>
              <defs className="hover:bg-background">
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(66, 214, 128)" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="rgb(39, 174, 96)" stopOpacity={1} />
                </linearGradient>
                <linearGradient id="barGradientHover" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgb(105, 255, 179)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="rgb(67, 224, 117)" stopOpacity={1} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="folder"
                stroke="rgb(107, 114, 128)"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 10 }}
                interval={0}
                label={{ value: 'Folders', position: 'insideBottom', offset: -5, fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <YAxis
                {...getYAxisProps(formattedData, 'files')}
                stroke="transparent"
                tick={{ fill: 'rgb(107, 114, 128)', fontSize: 8 }}
                label={{ value: 'File Count', offset: 25, angle: -90, position: 'insideLeft', fill: 'rgb(107, 114, 128)', fontSize: 10 }}
              />

              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border border-gray-300 rounded shadow-sm">
                        <p className="font-semibold text-sm text-foreground">{data.folder}</p>
                        <p className="text-sm text-primary">Files: {Number(data.files || 0).toLocaleString()}</p>
                        <p className="text-sm text-accent">Size: {Number(data.size || 0).toFixed(2)} MB</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Bar
                dataKey="files"
                className="hover:bg-background"
                radius={[4, 4, 0, 0]}
                onMouseEnter={(data, index) => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={hoveredBar === index ? 'url(#barGradientHover)' : 'url(#barGradient)'}
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
