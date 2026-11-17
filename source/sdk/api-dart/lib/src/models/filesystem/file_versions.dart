import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/filesystem/access.dart';
import 'package:mzizi_api/src/models/filesystem/file_extensions.dart';
import 'package:mzizi_api/src/models/filesystem/files.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'file_versions.g.dart';

/// Immutable exact bytes in the mzizi bucket; verify object hash, size and access before acceptance.
@JsonSerializable(includeIfNull: false)
class FilesystemFileVersions {
  const FilesystemFileVersions({
    required this.access,
    required this.contentType,
    required this.createdAt,
    required this.createdBySnapshot,
    this.deletedAt,
    this.fileExtensionId,
    required this.fileId,
    required this.id,
    this.originalFilename,
    required this.pinned,
    required this.provenance,
    required this.revision,
    required this.s3Key,
    required this.sha256,
    required this.sizeBytes,
    required this.updatedAt,
    required this.verifiedAt,
    required this.version,
  });
  final FilesystemAccess access;
  final String contentType;
  final DateTime createdAt;
  final String createdBySnapshot;
  final DateTime? deletedAt;
  final String? fileExtensionId;
  final String fileId;
  final String id;
  final String? originalFilename;
  final bool pinned;
  final String provenance;
  final int revision;
  final String s3Key;
  final String sha256;
  final int sizeBytes;
  final DateTime updatedAt;
  final DateTime verifiedAt;
  final int version;

  factory FilesystemFileVersions.fromJson(Map<String, dynamic> json) => _$FilesystemFileVersionsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFileVersionsToJson(this);
}
