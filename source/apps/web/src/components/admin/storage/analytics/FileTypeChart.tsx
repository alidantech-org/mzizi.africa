'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface FileTypeChartProps {
  data: Array<{
    type: string;
    count: number;
    size: number;
  }>;
  loading?: boolean;
}

export default function FileTypeChart({ data, loading = false }: FileTypeChartProps) {
  // File type to color mapping using reasonable common colors
  const getFileTypeColor = (fileType: string): string => {
    switch (fileType.toLowerCase()) {
      case 'image':
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'webp':
      case 'tiff':
      case 'tif':
      case 'ico':
      case 'heic':
      case 'heif':
      case 'raw':
      case 'cr2':
      case 'nef':
      case 'arw':
        return '#10b981'; // emerald
      case 'video':
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'wmv':
      case 'flv':
      case 'mkv':
      case 'webm':
        return '#8b5cf6'; // purple
      case 'audio':
      case 'mp3':
      case 'wav':
      case 'flac':
      case 'aac':
      case 'ogg':
      case 'wma':
      case 'm4a':
        return '#ec4899'; // pink
      case 'archive':
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
      case 'bz2':
        return '#f59e0b'; // amber
      case 'json':
        return '#eab308'; // yellow
      case 'geojson':
        return '#14b8a6'; // teal
      case 'csv':
      case 'xlsx':
      case 'xls':
      case 'spreadsheet':
      case 'ods':
        return '#22c55e'; // green
      case 'pdf':
        return '#ef4444'; // red
      case 'doc':
      case 'docx':
      case 'document':
      case 'odt':
      case 'rtf':
      case 'txt':
        return '#3b82f6'; // blue
      case 'ppt':
      case 'pptx':
      case 'presentation':
      case 'odp':
        return '#f97316'; // orange
      case 'svg':
      case 'vector':
      case 'eps':
      case 'ai':
        return '#6366f1'; // indigo
      case 'dbf':
      case 'sql':
      case 'db':
      case 'sqlite':
      case 'mdb':
      case 'accdb':
      case 'database':
        return '#64748b'; // slate
      case 'html':
      case 'css':
      case 'js':
      case 'ts':
      case 'jsx':
      case 'tsx':
      case 'code':
      case 'py':
      case 'python':
      case 'java':
      case 'c':
      case 'cpp':
      case 'cs':
      case 'go':
      case 'rust':
      case 'rs':
      case 'php':
      case 'rb':
      case 'ruby':
      case 'swift':
      case 'kt':
      case 'kotlin':
      case 'scala':
      case 'sh':
      case 'bash':
      case 'ps1':
      case 'powershell':
      case 'yaml':
      case 'yml':
      case 'xml':
      case 'toml':
      case 'ini':
      case 'cfg':
      case 'conf':
      case 'md':
      case 'markdown':
        return '#06b6d4'; // cyan
      default:
        return '#6b7280'; // gray
    }
  };

  const chartData = data.map((item, index) => ({
    ...item,
    color: getFileTypeColor(item.type),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded shadow-lg">
          <p className="font-semibold">{data.type}</p>
          <p className="text-sm">Files: {Number(data.count || 0).toLocaleString()}</p>
          <p className="text-sm">Size: {Number(data.size || 0).toLocaleString()} MB</p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files by Type</CardTitle>
          <CardDescription>Distribution of file types</CardDescription>
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
        <CardTitle>Files by Type</CardTitle>
        <CardDescription>Distribution of file types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer className="p-0 -ml-10 min-w-[110%]" width="" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent, type }) => `${type} ${(percent * 100).toFixed(0)}%`}
                fontSize={8}
                outerRadius={110}
                fill="#8884d8"
                stroke="none"
                dataKey="count"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend formatter={(value) => value} wrapperStyle={{ fontSize: '10px' }} /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
