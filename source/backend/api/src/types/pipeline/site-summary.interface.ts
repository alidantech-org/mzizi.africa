
import type { Id } from "#/types/shared/id.type.ts";
import type { Label } from "#/types/shared/label.type.ts";

/** Site Summary */
export interface SiteSummary {
  id: Id;
  kind: Label;
  name: Label;
  primaryDomain?: Label | null;
  status: Label;
}