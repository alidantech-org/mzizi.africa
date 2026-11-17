import 'package:json_annotation/json_annotation.dart';

part 'feature_geometry.g.dart';

/// Feature Geometry
@JsonSerializable(includeIfNull: false)
class GeographyFeatureGeometry {
  const GeographyFeatureGeometry({
    required this.basisId,
    required this.centroid,
    this.confidence,
    required this.featureId,
    required this.geometry,
    required this.geometryId,
    required this.geometryRoleId,
    this.maxZoom,
    this.minZoom,
    this.observedAt,
    required this.revision,
    required this.validFrom,
  });
  final String basisId;
  final Object? centroid;
  final double? confidence;
  final String featureId;
  final Object? geometry;
  final String geometryId;
  final String geometryRoleId;
  final int? maxZoom;
  final int? minZoom;
  final DateTime? observedAt;
  final int revision;
  final DateTime validFrom;

  factory GeographyFeatureGeometry.fromJson(Map<String, dynamic> json) => _$GeographyFeatureGeometryFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyFeatureGeometryToJson(this);
}
