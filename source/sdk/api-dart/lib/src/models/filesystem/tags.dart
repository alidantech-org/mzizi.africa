import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'tags.g.dart';

/// One shared tag catalogue for files and folders.
@JsonSerializable(includeIfNull: false)
class FilesystemTags {
  const FilesystemTags({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory FilesystemTags.fromJson(Map<String, dynamic> json) => _$FilesystemTagsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemTagsToJson(this);
}
