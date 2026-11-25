/** A GeoJSON geometry (RFC 7946) in EPSG:4326, as the API returns geometry fields. */
export type GeoJsonPosition = number[];
export type GeoJsonGeometry =
  | { type: "Point"; coordinates: GeoJsonPosition }
  | { type: "MultiPoint" | "LineString"; coordinates: GeoJsonPosition[] }
  | { type: "MultiLineString" | "Polygon"; coordinates: GeoJsonPosition[][] }
  | { type: "MultiPolygon"; coordinates: GeoJsonPosition[][][] }
  | { type: "GeometryCollection"; geometries: GeoJsonGeometry[] };
