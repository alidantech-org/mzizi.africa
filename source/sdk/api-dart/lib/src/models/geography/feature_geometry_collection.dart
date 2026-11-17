import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/feature_geometry.dart';

part 'feature_geometry_collection.g.dart';

/// Feature Geometry Collection
@JsonSerializable(includeIfNull: false)
class GeographyFeatureGeometryCollection {
  const GeographyFeatureGeometryCollection({required this.geometries});
  final List<GeographyFeatureGeometry> geometries;

  factory GeographyFeatureGeometryCollection.fromJson(Map<String, dynamic> json) => _$GeographyFeatureGeometryCollectionFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureGeometryCollectionToJson(this);
}
