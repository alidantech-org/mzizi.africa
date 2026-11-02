
import type { SegmentKind } from "#/types/exchange/segment-kind.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Confidence } from "#/types/shared/confidence.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Extraction Segment */
export interface ExtractionSegment {
  confidence?: Confidence;
  content: JsonDocument;
  key: Label;
  kind: SegmentKind;
  locator: JsonDocument;
}