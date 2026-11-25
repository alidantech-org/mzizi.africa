import { SourceEvidenceMethod } from "#sdk/types/source/enums/evidence-method.ts";
import { SourceEvidenceRole } from "#sdk/types/source/enums/evidence-role.ts";

/** Evidence Entry */
export interface SourceEvidenceEntry {
  artifactId: string | null;
  confidence: number | null;
  editionDesignation: string | null;
  evidenceId: string;
  locator: string;
  locatorTerm: string;
  method: SourceEvidenceMethod;
  observedAt: string | null;
  productCode: string | null;
  publisherCode: string | null;
  role: SourceEvidenceRole;
}
