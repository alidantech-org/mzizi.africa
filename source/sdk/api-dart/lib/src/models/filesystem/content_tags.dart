import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/contents.dart';
import 'package:mzizi_api/src/models/filesystem/tags.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'content_tags.g.dart';

/// Tags a content text; a text may have several.
@JsonSerializable(includeIfNull: false)
class FilesystemContentTags {
  const FilesystemContentTags({
    required this.contentId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.tagId,
    required this.updatedAt,
    required this.version,
  });
  final String contentId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String tagId;
  final DateTime updatedAt;
  final int version;

  factory FilesystemContentTags.fromJson(Map<String, dynamic> json) => _$FilesystemContentTagsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemContentTagsToJson(this);
}
