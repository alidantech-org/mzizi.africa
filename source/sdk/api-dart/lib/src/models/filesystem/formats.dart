import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'formats.g.dart';

/// A technical file format: suffix and media type, never a document classification.
@JsonSerializable(includeIfNull: false)
class FilesystemFormats {
  const FilesystemFormats({
    required this.code,
    required this.contentType,
    required this.createdAt,
    this.deletedAt,
    required this.extension,
    required this.id,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final String contentType;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String extension;
  final String id;
  final DateTime updatedAt;
  final int version;

  factory FilesystemFormats.fromJson(Map<String, dynamic> json) => _$FilesystemFormatsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemFormatsToJson(this);
}
