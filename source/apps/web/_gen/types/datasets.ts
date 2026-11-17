
import type { CodedEntity } from './coded-entity';
import type { Features } from './features';
import type { Unit } from './unit';
import type { Value } from './value';

/** Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts. */
export interface Datasets {
  code: string;
  coverageFeatureId?: string | null;
  createdAt: string;
  crs?: string | null;
  deletedAt?: string | null;
  fileVersionRefId?: string | null;
  format: string;
  id: string;
  qualityNotes?: string | null;
  representationId: string;
  resolution?: number | null;
  resolutionUnitId?: string | null;
  subjectId: string;
  title: string;
  updatedAt: string;
  version: number;
}