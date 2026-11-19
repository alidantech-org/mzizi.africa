import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';

part 'media.g.dart';

/// One use of a stored media file by one subject record, which it mentions by table and id. A subject can have many media of any kind and one file can serve many subjects; subjects carry no media pointer.
@JsonSerializable(includeIfNull: false)
class FilesystemMedia {
  const FilesystemMedia({
    this.altText,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.description,
    this.endSecond,
    this.externalUrl,
    this.fileVersionId,
    required this.id,
    required this.kindId,
    this.platformId,
    this.position,
    this.purpose,
    this.startSecond,
    required this.subjectId,
    required this.subjectTable,
    this.thumbnailUrl,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String? altText;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final int? endSecond;
  final String? externalUrl;
  final String? fileVersionId;
  final String id;
  final String kindId;
  final String? platformId;
  final int? position;
  final String? purpose;
  final int? startSecond;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final String? thumbnailUrl;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory FilesystemMedia.fromJson(Map<String, dynamic> json) => _$FilesystemMediaFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemMediaToJson(this);
}
