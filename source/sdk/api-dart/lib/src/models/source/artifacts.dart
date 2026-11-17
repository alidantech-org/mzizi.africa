import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/editions.dart';

part 'artifacts.g.dart';

/// One exact representation of an edition, tied to immutable bytes. Identical downloads from many sources are one artifact with many captures.
@JsonSerializable(includeIfNull: false)
class SourceArtifacts {
  const SourceArtifacts({
    required this.code,
    this.contentType,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.editionId,
    this.fileVersionId,
    this.format,
    required this.id,
    this.location,
    this.parentId,
    required this.sha256,
    this.sizeBytes,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String? contentType;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String editionId;
  final String? fileVersionId;
  final String? format;
  final String id;
  final String? location;
  final String? parentId;
  final String sha256;
  final int? sizeBytes;
  final DateTime updatedAt;
  final int version;

  factory SourceArtifacts.fromJson(Map<String, dynamic> json) => _$SourceArtifactsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceArtifactsToJson(this);
}
