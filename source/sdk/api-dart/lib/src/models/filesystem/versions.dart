import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/filesystem/access.dart';
import 'package:mzizi_api/src/models/filesystem/files.dart';
import 'package:mzizi_api/src/models/filesystem/formats.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'versions.g.dart';

/// Immutable exact bytes in object storage, with hash, size and access.
@JsonSerializable(includeIfNull: false)
class FilesystemVersions {
  const FilesystemVersions({
    required this.access,
    required this.contentType,
    required this.createdAt,
    required this.createdBySnapshot,
    this.deletedAt,
    required this.fileId,
    this.formatId,
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
  final String fileId;
  final String? formatId;
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

  factory FilesystemVersions.fromJson(Map<String, dynamic> json) => _$FilesystemVersionsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemVersionsToJson(this);
}
