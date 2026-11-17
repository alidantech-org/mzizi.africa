import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/files.dart';
import 'package:mzizi_api/src/models/filesystem/folders.dart';
import 'package:mzizi_api/src/models/filesystem/tags.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'taggings.g.dart';

/// One tag assignment to exactly one typed file or folder target.
@JsonSerializable(includeIfNull: false)
class FilesystemTaggings {
  const FilesystemTaggings({
    required this.createdAt,
    this.deletedAt,
    this.fileId,
    this.folderId,
    required this.id,
    required this.tagId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fileId;
  final String? folderId;
  final String id;
  final String tagId;
  final DateTime updatedAt;
  final int version;

  factory FilesystemTaggings.fromJson(Map<String, dynamic> json) => _$FilesystemTaggingsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemTaggingsToJson(this);
}
