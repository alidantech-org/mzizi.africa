/** Capture */
export interface StagingCapture {
  byteSize: number;
  contentType?: string;
  fetchedAt: string;
  httpStatus?: number;
  id: string;
  objectKey: string;
  sha256: string;
  sourceId: string;
  url: string;
}
