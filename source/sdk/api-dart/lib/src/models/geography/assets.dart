import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/geography/geometries.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'assets.g.dart';

/// A stored GIS file used for a feature or for one of its geometries. One file can serve many features and a feature can have many files. Photographs and video are filesystem media; acquisition and provenance belong to Source.
@JsonSerializable(includeIfNull: false)
class GeographyAssets {
  const GeographyAssets({
    this.band,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.featureId,
    required this.fileVersionId,
    this.geometryId,
    required this.id,
    required this.kindId,
    this.layer,
    this.member,
    required this.purposeId,
    required this.updatedAt,
    required this.version,
  });
  final int? band;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String featureId;
  final String fileVersionId;
  final String? geometryId;
  final String id;
  final String kindId;
  final String? layer;
  final String? member;
  final String purposeId;
  final DateTime updatedAt;
  final int version;

  factory GeographyAssets.fromJson(Map<String, dynamic> json) => _$GeographyAssetsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyAssetsToJson(this);
}
