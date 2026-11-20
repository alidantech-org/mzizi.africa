import type { ExplorerFlagColor } from "#sdk/types/explorer/dto/flag-color.ts";

/** Country Choice */
export interface ExplorerCountryChoice {
  code: string;
  flagColors: ExplorerFlagColor[];
  flagUrl?: string | null;
  id: string;
  name: string;
  rootFeatureId?: string | null;
  served: boolean;
}
