/**
 * Endpoints for file upload
 */
export const FILES = {
  /**
   * Endpoint for uploading a single file
   */
  POST: {
    upload: { single: `/files/upload` }, // UPLOADS
  },
  /**
   * Endpoints for retrieving files by ID or related data
   */
  GET: {
    files: '/files',
    /**
     * Endpoint for retrieving a file by ID
     * @param {string} fileId - The ID of the file to retrieve
     * @returns {string} - The endpoint URL for the specified file ID
     */
    byId: (fileId: string) => `/files/by-id/${fileId}`,
    /**
     * Endpoint for retrieving all file types
     */
    fileTypes: `/files/types`,
    /**
     * Endpoint for retrieving all folders
     */
    folders: `/files/folders`,
    /**
     * Endpoint for retrieving file type categories
     */
    categories: `/files/categories`,
    /**
     * Endpoint for retrieving comprehensive file analytics
     */
    analytics: `/files/analytics`,
  },
  /**
   * Endpoint for deleting a file by S3 key
   * @param {string} s3Key - The S3 key of the file to delete
   * @returns {string} - The endpoint URL for the specified S3 key
   */
  DELETE: { byS3Key: (s3Key: string) => `/files/${s3Key}` },
} as const;
