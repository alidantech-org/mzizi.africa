import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'file_relations.g.dart';

/// Directed exact input-to-output lineage with a pinned processing description; originals remain immutable.
@JsonSerializable(includeIfNull: false)
class FilesystemFileRelations {
  const FilesystemFileRelations({
    required this.createdAt,
    this.deletedAt,
    required this.derivedVersionId,
    required this.id,
    required this.kindId,
    required this.processingProvenance,
    required this.sourceVersionId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String derivedVersionId;
  final String id;
  final String kindId;
  final String processingProvenance;
  final String sourceVersionId;
  final DateTime updatedAt;
  final int version;

  factory FilesystemFileRelations.fromJson(Map<String, dynamic> json) => _$FilesystemFileRelationsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFileRelationsToJson(this);
}
