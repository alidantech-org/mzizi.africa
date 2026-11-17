import 'package:json_annotation/json_annotation.dart';
import 'features.dart';
import 'historical_validity_entity.dart';
import 'value.dart';

part 'geometries.g.dart';

/// One drawing of a feature: a revision with a role, a basis, a confidence, a zoom range, a validity period and the stored file it came from. A feature has many; the current one has no end date.
@JsonSerializable(includeIfNull: false)
class Geometries {
  const Geometries({
    required this.area,
    required this.basisId,
    required this.centroid,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.envelope,
    required this.featureId,
    this.fileVersionRefId,
    required this.geometry,
    required this.geometryRoleId,
    required this.id,
    this.maxZoom,
    this.minZoom,
    this.observedAt,
    required this.revision,
    required this.srid,
    this.supersedesId,
    required this.updatedAt,
    this.validFrom,
    this.validFromEarliest,
    this.validFromLatest,
    this.validUntil,
    this.validUntilEarliest,
    this.validUntilLatest,
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
  final String? fileVersionRefId;
  final Object? geometry;
  final String geometryRoleId;
  final String id;
  final int? maxZoom;
  final int? minZoom;
  final DateTime? observedAt;
  final int revision;
  final int srid;
  final String? supersedesId;
  final DateTime updatedAt;
  final DateTime? validFrom;
  final DateTime? validFromEarliest;
  final DateTime? validFromLatest;
  final DateTime? validUntil;
  final DateTime? validUntilEarliest;
  final DateTime? validUntilLatest;
  final int version;

  factory Geometries.fromJson(Map<String, dynamic> json) => _$GeometriesFromJson(json);

  Map<String, dynamic> toJson() => _$GeometriesToJson(this);
}