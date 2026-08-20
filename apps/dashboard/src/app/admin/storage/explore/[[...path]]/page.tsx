import { getAndsearchFiles, getFileCategories, getFile, getFileTypes, getFolders } from '@/app/admin/storage/actions';
import StorageTabs from '@/components/admin/storage/explore/StorageTabs';
import FileTypeBrowser from '@/components/admin/storage/explore/FileTypeBrowser';
import FolderBrowser from '@/components/admin/storage/explore/FolderBrowser';
import FileBrowser from '@/components/admin/storage/explore/FileBrowser';
import { SearchItem, SortItem, ViewTypeItem } from '@/components/admin/storage/explore/ExploreItems';
import FiltersSheet from '@/components/admin/storage/explore/FiltersSheet';
import FileUpload from '@/components/admin/storage/files/FileUpload';
import Pagination from '@/components/admin/storage/explore/Pagination';
import { FiltersProvider } from '@/contexts/FiltersContext';
import { FileRecord } from '@/app/admin/storage/types/file';
import { Folder } from '@/app/admin/storage/types/folder';
import { FileType } from '@/app/admin/storage/types/file-type';
import { cn } from '@/lib/utils';

interface ExploreStoragePageProps {
  params: Promise<{ path?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

interface PathData {
  root: {
    files: FileRecord[];
    folderPaths: string[];
    fileCategories: string[];
    fileTypesCodes: string[];
    contentTypes: string[];
    directories: { id: string; name: string }[];
  };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    offset?: number;
    totalPages: number;
  };
  folderData: { folders: Folder[]; total: number };
  fileTypeData: {
    fileCategories: string[];
    fileTypes: FileType[];
  };
}

enum PathSegments {
  ROOT = '',
  FOLDERS = 'folders',
  FILE_TYPES = 'file-types',
}

export default async function FilesPage({ params, searchParams }: ExploreStoragePageProps) {
  const { path } = await params;
  const searchParamsData = await searchParams;
  const segments = path || [''];
  const pathSegment = segments[0];
  const pathData: PathData = {
    root: { files: [], folderPaths: [], fileCategories: [], contentTypes: [], fileTypesCodes: [], directories: [] },
    folderData: { folders: [], total: 0 },
    fileTypeData: { fileCategories: [], fileTypes: [] },
  };

  const viewMode: string = (searchParamsData?.viewMode as string) || 'table';
  delete searchParamsData?.viewMode;

  if (!pathSegment || pathSegment === PathSegments.ROOT) {
    const { body: filesData } = await getAndsearchFiles(searchParamsData);
    const { body: rootFolderData } = await getFolders({ min_depth: 1, max_depth: 2 });
    const { body: fileCategoriesData } = await getFileCategories();
    const { body: fileTypesData } = await getFileTypes(searchParamsData);

    pathData.root.files = filesData?.files || [];
    pathData.pagination = filesData?.pagination
      ? {
          total: filesData.pagination.total,
          page: Math.floor((filesData.pagination.offset || 0) / filesData.pagination.limit),
          limit: filesData.pagination.limit,
          offset: filesData.pagination.offset,
          totalPages: Math.ceil(filesData.pagination.total / filesData.pagination.limit),
        }
      : undefined;
    pathData.root.folderPaths = rootFolderData?.folders.map((item) => item.path) || [];
    pathData.root.directories =
      rootFolderData?.folders.map((item) => {
        return { id: item.id, name: item.name + ` (${item.path})` };
      }) || [];
    pathData.root.fileCategories = fileCategoriesData?.file_type_categories.map((item) => item) || [];
    pathData.root.fileTypesCodes = fileTypesData?.file_types.map((item) => item.code) || [];
    pathData.root.contentTypes = fileTypesData?.file_types.map((item) => item.mime_type) || [];
  } else if (pathSegment === PathSegments.FOLDERS) {
    const depth = Math.max(0, segments.length - 1);

    const query: any = {
      ...searchParamsData,
      min_depth: depth,
      max_depth: depth,
    };

    if (depth > 0) {
      query.path = segments.slice(1).join('/');
    }

    const { body: folderData } = await getFolders(query);

    pathData.folderData.folders = folderData?.folders || [];
    pathData.folderData.total = folderData?.pagination.total || 0;
    pathData.pagination = folderData?.pagination
      ? {
          total: folderData.pagination.total,
          page: Math.floor((folderData.pagination.offset || 0) / folderData.pagination.limit),
          limit: folderData.pagination.limit,
          offset: folderData.pagination.offset,
          totalPages: Math.ceil(folderData.pagination.total / folderData.pagination.limit),
        }
      : undefined;
  } else if (pathSegment === PathSegments.FILE_TYPES) {
    const { body: fileCategoriesData } = await getFileCategories();
    const { body: fileTypesData } = await getFileTypes(searchParamsData);
    pathData.fileTypeData.fileTypes = fileTypesData?.file_types || [];
    pathData.root.fileCategories = fileCategoriesData?.file_type_categories.map((item) => item) || [];
    pathData.pagination = fileTypesData?.pagination
      ? {
          total: fileTypesData.pagination.total,
          page: Math.floor((fileTypesData.pagination.offset || 0) / fileTypesData.pagination.limit),
          limit: fileTypesData.pagination.limit,
          offset: fileTypesData.pagination.offset,
          totalPages: Math.ceil(fileTypesData.pagination.total / fileTypesData.pagination.limit),
        }
      : undefined;
  }

  return (
    <FiltersProvider initialFilters={searchParamsData}>
      <div className="space-y-3 w-full overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-row gap-3 items-center justify-between w-full">
          <div className="flex-shrink-0">
            <StorageTabs />
          </div>
          <div className="flex gap-2 flex-wrap items-center justify-end flex-1 min-w-0">
            <div className="flex-1 min-w-[200px] max-w-md">
              <SearchItem searchFor={pathSegment} />
            </div>
            {(!pathSegment || pathSegment === PathSegments.ROOT) && (
              <div className="flex-shrink-0">
                <SortItem />
              </div>
            )}
            <div className="flex-shrink-0">
              <ViewTypeItem />
            </div>
            {(!pathSegment || pathSegment === PathSegments.ROOT) && (
              <div className="flex-shrink-0">
                <FiltersSheet
                  folders={pathData.root.folderPaths}
                  directories={pathData.root.directories}
                  categories={pathData.root.fileCategories}
                  contentTypes={pathData.root.contentTypes}
                  fileTypeCodes={pathData.root.fileTypesCodes}
                  initialFilters={searchParamsData}
                />
              </div>
            )}
            <div className="flex-shrink-0">
              <FileUpload />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden flex-col gap-3 w-full">
          <div className="flex-shrink-0">
            <StorageTabs />
          </div>
          <div className="flex-1 min-w-0">
            <SearchItem searchFor={pathSegment} />
          </div>
          <div className="flex gap-2 items-center w-full">
            {(!pathSegment || pathSegment === PathSegments.ROOT) && (
              <div className="flex-1 min-w-0">
                <SortItem />
              </div>
            )}
            <div className={cn('flex flex-shrink-0', (pathSegment || pathSegment !== PathSegments.ROOT) && 'w-full gap-2 justify-between')}>
              <ViewTypeItem />
              {(pathSegment || pathSegment !== PathSegments.ROOT) && <FileUpload />}
            </div>
          </div>{' '}
          <div className="flex fle-row justify-between">
            {(!pathSegment || pathSegment === PathSegments.ROOT) && (
              <div className="flex-shrink-0">
                <FiltersSheet
                  folders={pathData.root.folderPaths}
                  directories={pathData.root.directories}
                  categories={pathData.root.fileCategories}
                  contentTypes={pathData.root.contentTypes}
                  fileTypeCodes={pathData.root.fileTypesCodes}
                  initialFilters={searchParamsData}
                />
              </div>
            )}
            {(!pathSegment || pathSegment === PathSegments.ROOT) && <FileUpload />}
          </div>
        </div>
        {(!pathSegment || pathSegment === PathSegments.ROOT) && (
          <>
            <FileBrowser viewMode={viewMode} files={pathData.root.files} />
          </>
        )}
        {pathSegment === PathSegments.FILE_TYPES && <FileTypeBrowser viewMode={viewMode} fileTypes={pathData.fileTypeData.fileTypes} />}
        {pathSegment === PathSegments.FOLDERS && (
          <FolderBrowser
            viewMode={viewMode}
            folders={pathData.folderData.folders}
            segments={segments}
            depth={Math.max(0, segments.length - 1)}
          />
        )}
        {pathData.pagination && <Pagination pagination={pathData.pagination} />}
      </div>
    </FiltersProvider>
  );
}
