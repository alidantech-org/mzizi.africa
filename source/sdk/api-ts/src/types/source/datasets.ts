import { SourceDatasetAssembly } from "#sdk/types/enums/source/dataset-assembly.ts";

/** A dataset we hold, most often a seed CSV that rows are loaded from: categorised, hashed, and either taken as downloaded or assembled from other inputs. */
export interface SourceDatasets {
  assembly: SourceDatasetAssembly;
  categoryId?: string | null;
  code: string;
  createdAt: string;
  deletedAt?: string | null;
  description?: string | null;
  fileVersionId?: string | null;
  format: string;
  id: string;
  location?: string | null;
  sha256?: string | null;
  title: string;
  updatedAt: string;
  version: number;
}
