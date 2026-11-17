import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/filesystem/retention.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/filesystem/folders.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'files.g.dart';

/// Stable logical file identity; equal content hashes may belong to different files.
@JsonSerializable(includeIfNull: false)
class FilesystemFiles {
  const FilesystemFiles({
    required this.code,
    required this.createdAt,
    this.currentVersionId,
    this.deletedAt,
    required this.folderId,
    required this.id,
    required this.name,
    required this.retention,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final String? currentVersionId;
  final DateTime? deletedAt;
  final String folderId;
  final String id;
  final String name;
  final FilesystemRetention retention;
  final DateTime updatedAt;
  final int version;

  factory FilesystemFiles.fromJson(Map<String, dynamic> json) => _$FilesystemFilesFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFilesToJson(this);
}
