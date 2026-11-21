/** Boundary Shape */
export interface ExplorerBoundaryShape {
  address: string;
  bbox: number[];
  childCount: number;
  geometry: string;
  kind: string;
  kindCode: string;
  name: string;
  population?: number | null;
}
