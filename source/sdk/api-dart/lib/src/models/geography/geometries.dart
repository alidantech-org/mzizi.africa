import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';

part 'geometries.g.dart';

/// One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date.
@JsonSerializable(includeIfNull: false)
class GeographyGeometries {
  const GeographyGeometries({
    required this.area,
    required this.basisId,
    required this.centroid,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.envelope,
    required this.featureId,
    this.fromToPrecision,
    this.fromYear,
    required this.geometry,
    required this.geometryRoleId,
    required this.id,
    this.maxZoom,
    this.minZoom,
    this.observedAt,
    required this.revision,
    required this.srid,
    this.supersedesId,
    this.toYear,
    required this.updatedAt,
    required this.version,
  });
  final double area;
  final String basisId;
  final Object? centroid;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final Object? envelope;
  final String featureId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final Object? geometry;
  final String geometryRoleId;
  final String id;
  final int? maxZoom;
  final int? minZoom;
  final DateTime? observedAt;
  final int revision;
  final int srid;
  final String? supersedesId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;

  factory GeographyGeometries.fromJson(Map<String, dynamic> json) => _$GeographyGeometriesFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyGeometriesToJson(this);
}
