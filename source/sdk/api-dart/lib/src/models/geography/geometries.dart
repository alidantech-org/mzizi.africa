import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'geometries.g.dart';

/// One full-detail drawing of a feature with its role, basis and revision. The current drawing has no end year.
@JsonSerializable(includeIfNull: false)
class GeographyGeometries {
  const GeographyGeometries({
    required this.area,
    required this.basisTerm,
    required this.centroid,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.envelope,
    required this.featureId,
    this.fromYear,
    required this.geometry,
    required this.id,
    required this.revision,
    required this.roleTerm,
    this.supersedesId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final double area;
  final String basisTerm;
  final Object? centroid;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final Object? envelope;
  final String featureId;
  final int? fromYear;
  final Object? geometry;
  final String id;
  final int revision;
  final String roleTerm;
  final String? supersedesId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyGeometries.fromJson(Map<String, dynamic> json) => _$GeographyGeometriesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyGeometriesToJson(this);
}
