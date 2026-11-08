
import type { ClassifierMethod } from "#/types/source/classifier-method.enum.ts";
import type { RouteStatus } from "#/types/source/route-status.enum.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Id } from "#/types/shared/id.type.ts";
import type { LongText } from "#/types/shared/long-text.type.ts";
import type { Version } from "#/types/shared/version.type.ts";
import type { DocumentKindCode } from "#/types/source/document-kind-code.type.ts";
import type { ToolName } from "#/types/source/tool-name.type.ts";
import type { BaseEntity } from "#/types/shared/base-entity.interface.ts";
import type { DateTime } from "#/types/shared/date-time.type.ts";

/** Document Classification */
export interface DocumentClassification {
  classifiedAt: DateTime;
  classifierVersion: ToolName;
  createdAt: DateTime;
  documentId: Id;
  evidence?: LongText | null;
  facts?: LongText | null;
  id: Id;
  kind: DocumentKindCode;
  method: ClassifierMethod;
  routeParser?: ToolName | null;
  routeStatus: RouteStatus;
  score: Confidence;
  updatedAt: DateTime;
  version: Version;
}