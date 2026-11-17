import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';

part 'media.g.dart';

/// A logo, symbol, photograph, recording or other media an entity or person can point at; its bytes are a filesystem file version.
@JsonSerializable(includeIfNull: false)
class FilesystemMedia {
  const FilesystemMedia({
    this.altText,
    this.caption,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fileVersionId,
    required this.id,
    required this.kindId,
    this.sourceUrl,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String? altText;
  final String? caption;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fileVersionId;
  final String id;
  final String kindId;
  final String? sourceUrl;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory FilesystemMedia.fromJson(Map<String, dynamic> json) => _$FilesystemMediaFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemMediaToJson(this);
}
