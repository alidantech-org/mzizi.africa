import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/geography/geometries.dart';
import 'package:mzizi_api/src/models/shared/association.dart';

part 'outlines.g.dart';

/// A prepared, simplified outline of a geometry for one zoom band; rebuilt when its geometry changes.
@JsonSerializable(includeIfNull: false)
class GeographyOutlines {
  const GeographyOutlines({
    required this.band,
    required this.bbox,
    required this.builtAt,
    required this.centroid,
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.geometry,
    required this.geometryId,
    required this.id,
    required this.points,
    required this.tolerance,
  });
  final int band;
  final Object? bbox;
  final DateTime builtAt;
  final Object? centroid;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final Object? geometry;
  final String geometryId;
  final String id;
  final int points;
  final double tolerance;

  factory GeographyOutlines.fromJson(Map<String, dynamic> json) => _$GeographyOutlinesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyOutlinesToJson(this);
}
