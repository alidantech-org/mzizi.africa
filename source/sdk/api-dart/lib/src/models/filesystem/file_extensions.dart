import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'file_extensions.g.dart';

/// Technical filename suffix and media-type hint; never a semantic document classification.
@JsonSerializable(includeIfNull: false)
class FilesystemFileExtensions {
  const FilesystemFileExtensions({
    required this.code,
    required this.contentType,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.extension,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String contentType;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String extension;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory FilesystemFileExtensions.fromJson(Map<String, dynamic> json) => _$FilesystemFileExtensionsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFileExtensionsToJson(this);
}
