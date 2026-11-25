import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/versions.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/editions.dart';

part 'artifacts.g.dart';

/// The bytes as obtained, through a filesystem version.
@JsonSerializable(includeIfNull: false)
class SourceArtifacts {
  const SourceArtifacts({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.editionId,
    required this.id,
    this.parentId,
    required this.updatedAt,
    required this.version,
    required this.versionId,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? editionId;
  final String id;
  final String? parentId;
  final DateTime updatedAt;
  final int version;
  final String versionId;

  factory SourceArtifacts.fromJson(Map<String, dynamic> json) => _$SourceArtifactsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceArtifactsToJson(this);
}
