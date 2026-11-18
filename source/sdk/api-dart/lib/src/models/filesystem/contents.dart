import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/filesystem/file_versions.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';

part 'contents.g.dart';

/// One authored text (markdown) about a subject record: an institution, a place, a person, the Constitution or general knowledge. Media is referenced, never embedded.
@JsonSerializable(includeIfNull: false)
class FilesystemContents {
  const FilesystemContents({
    required this.body,
    required this.categoryId,
    this.classificationId,
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.fileVersionId,
    required this.id,
    required this.isDevelopmentText,
    required this.languageId,
    required this.subjectId,
    required this.subjectTable,
    this.summary,
    required this.title,
    required this.updatedAt,
    required this.version,
  });
  final String body;
  final String categoryId;
  final String? classificationId;
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? fileVersionId;
  final String id;
  final bool isDevelopmentText;
  final String languageId;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final String? summary;
  final String title;
  final DateTime updatedAt;
  final int version;

  factory FilesystemContents.fromJson(Map<String, dynamic> json) => _$FilesystemContentsFromJson(json);

  Map<String, dynamic> toJson() => _$FilesystemContentsToJson(this);
}
