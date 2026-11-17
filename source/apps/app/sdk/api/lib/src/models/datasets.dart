import 'package:json_annotation/json_annotation.dart';
import 'coded_entity.dart';
import 'features.dart';
import 'unit.dart';
import 'value.dart';

part 'datasets.g.dart';

/// Catalog metadata for vector, raster, climate, elevation, historical and derived datasets. Large assets remain in the existing Filesystem/SeaweedFS S3 system; external references await executable Source and Filesystem contracts.
@JsonSerializable(includeIfNull: false)
class Datasets {
  const Datasets({
    required this.code,
    this.coverageFeatureId,
    required this.createdAt,
    this.crs,
    this.deletedAt,
    this.fileVersionRefId,
    required this.format,
    required this.id,
    this.qualityNotes,
    required this.representationId,
    this.resolution,
    this.resolutionUnitId,
    required this.subjectId,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? coverageFeatureId;
  final DateTime createdAt;
  final String? crs;
  final DateTime? deletedAt;
  final String? fileVersionRefId;
  final String format;
  final String id;
  final String? qualityNotes;
  final String representationId;
  final double? resolution;
  final String? resolutionUnitId;
  final String subjectId;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory Datasets.fromJson(Map<String, dynamic> json) => _$DatasetsFromJson(json);

  Map<String, dynamic> toJson() => _$DatasetsToJson(this);
}