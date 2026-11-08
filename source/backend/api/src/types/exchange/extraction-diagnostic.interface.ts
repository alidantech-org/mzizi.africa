
import type { DiagnosticLevel } from "#/types/exchange/diagnostic-level.enum.ts";
import type { JsonDocument } from "#/types/exchange/json-document.type.ts";
import type { Label } from "#/types/shared/label.type.ts";
import type { Message } from "#/types/shared/message.type.ts";

/** Extraction Diagnostic */
export interface ExtractionDiagnostic {
  code: Label;
  level: DiagnosticLevel;
  locator?: JsonDocument;
  message: Message;
}