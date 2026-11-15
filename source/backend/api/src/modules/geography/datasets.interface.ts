
import type { Description } from "#/modules/shared/description.type.ts";
import type { Id } from "#/modules/shared/id.type.ts";
import type { IdentityCode } from "#/modules/shared/identity-code.type.ts";
import type { NonEmptyString100 } from "#/modules/shared/non-empty-string100.type.ts";
import type { NonEmptyString255 } from "#/modules/shared/non-empty-string255.type.ts";
import type { Number } from "#/modules/shared/number.type.ts";
import type { PositiveInteger } from "#/modules/shared/positive-integer.type.ts";
import type { Instant } from "#/modules/shared/instant.type.ts";

/** Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts. */
export interface Datasets {
  code: IdentityCode;
  coverageFeatureId?: Id | null;
  createdAt: Instant;
  crs?: NonEmptyString100 | null;
  deletedAt?: Instant | null;
  fileVersionRefId?: Id | null;
  format: NonEmptyString100;
  id: Id;
  qualityNotes?: Description | null;
  representationId: Id;
  resolution?: Number | null;
  resolutionUnitId?: Id | null;
  sourceRefId?: Id | null;
  subjectId: Id;
  title: NonEmptyString255;
  updatedAt: Instant;
  version: PositiveInteger;
}