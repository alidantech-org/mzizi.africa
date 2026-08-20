import AnalyticsFilters from '@/components/admin/storage/analytics/AnalyticsFilters';
import StatsCards from '@/components/admin/storage/analytics/StatsCards';
import FileTypeChart from '@/components/admin/storage/analytics/FileTypeChart';
import FolderChart from '@/components/admin/storage/analytics/FolderChart';
import UploadTrendsChart from '@/components/admin/storage/analytics/UploadTrendsChart';
import StorageGrowthChart from '@/components/admin/storage/analytics/StorageGrowthChart';
import SizeDistributionChart from '@/components/admin/storage/analytics/SizeDistributionChart';
import { getAnalytics, getFileCategories, getFolders } from './actions';

interface StoragePageProps {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function StoragePage(props: StoragePageProps) {
  const searchParams = await props.searchParams;

  // Get filter values from URL params
  const analyticsOptions = searchParams;

  const { body: data } = await getAnalytics(analyticsOptions);
  const { body: folderData } = await getFolders({ min_depth: 1, max_depth: 2 });
  const { body: fileCategoriesData } = await getFileCategories();
  const folders = folderData?.folders.map((item) => item.path) || [];
  const fileCategories = fileCategoriesData?.file_type_categories.map((item) => item) || [];

  // Extract data for components with safe defaults
  const summary = data?.summary || {
    total_files: 0,
    total_size_mb: 0,
    total_folders: 0,
    avg_file_size_mb: 0,
  };

  const sizeData =
    data?.size_distribution?.map((item: any) => ({
      range: item.range || 'Unknown',
      count: Number(item.count) || 0,
      percentage: Number(item.percentage) || 0,
    })) || [];

  const growthData = data?.growth_metrics || [

  ];

  const fileTypesAnalytics =
    data?.file_type_distribution?.map((item) => ({
      type: item.type || 'Unknown',
      count: Number(item.count) || 0,
      size: Number(item.size_mb) || 0,
    })) || [];
  const foldersAnalytics =
    data?.folder_distribution?.map((item) => ({
      folder: item.folder_path || 'Unknown',
      files: Number(item.files) || 0,
      size: Number(item.size_mb) || 0,
    })) || [];

  const growthType = data?.growth_type || 'monthly';

  return (
    <div className="space-y-3">
      {/* Filters */}
      <AnalyticsFilters folderOptions={folders} fileCategories={fileCategories} sizeRangeOptions={sizeData} />

      {/* Stats Cards */}
      <StatsCards
        totalFiles={Number(summary.total_files) || 0}
        totalSize={Number(summary.total_size_mb) || 0}
        totalFolders={Number(summary.total_folders) || 0}
        avgFileSize={Number(summary.avg_file_size_mb || 0).toFixed(2)}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Type Distribution */}
        <FileTypeChart data={fileTypesAnalytics} />
        <SizeDistributionChart data={sizeData} />

        {/* Folder Distribution */}
      </div>

      {/* Trends Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Trends */}
        <UploadTrendsChart data={growthData as any} growthType={growthType} />
        <StorageGrowthChart data={growthData as any} growthType={growthType} />

        {/* Storage Growth */}
      </div>
      <FolderChart data={foldersAnalytics} />

      {/* Size Distribution */}
    </div>
  );
}
