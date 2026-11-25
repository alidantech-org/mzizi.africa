import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/geography/geometries.dart';
import 'package:mzizi_api/src/models/reference/hierarchies.dart';
import 'package:mzizi_api/src/models/reference/levels.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'assets.g.dart';

/// A stored GIS file or prepared map output (tile set, TopoJSON) for a feature, through filesystem versions.
@JsonSerializable(includeIfNull: false)
class GeographyAssets {
  const GeographyAssets({
    this.band,
    this.builtAt,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    this.geometryId,
    this.hierarchyId,
    required this.id,
    required this.kindTerm,
    this.layer,
    this.levelId,
    this.member,
    required this.purposeTerm,
    this.staleAt,
    required this.updatedAt,
    required this.version,
    required this.versionId,
  });
  final int? band;
  final DateTime? builtAt;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String? geometryId;
  final String? hierarchyId;
  final String id;
  final String kindTerm;
  final String? layer;
  final String? levelId;
  final String? member;
  final String purposeTerm;
  final DateTime? staleAt;
  final DateTime updatedAt;
  final int version;
  final String versionId;

  factory GeographyAssets.fromJson(Map<String, dynamic> json) => _$GeographyAssetsFromJson(json);

  Map<String, dynamic> toJson() => _$GeographyAssetsToJson(this);
}
