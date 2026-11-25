import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/civic/projects.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'sites.g.dart';

/// A place a project touches.
@JsonSerializable(includeIfNull: false)
class CivicSites {
  const CivicSites({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    required this.kindTerm,
    required this.projectId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final String kindTerm;
  final String projectId;
  final DateTime updatedAt;
  final int version;

  factory CivicSites.fromJson(Map<String, dynamic> json) => _$CivicSitesFromJson(json);

  Map<String, dynamic> toJson() => _$CivicSitesToJson(this);
}
