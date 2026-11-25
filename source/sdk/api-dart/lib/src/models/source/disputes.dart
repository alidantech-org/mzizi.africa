import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'disputes.g.dart';

/// Conflicting claims about one row.
@JsonSerializable(includeIfNull: false)
class SourceDisputes {
  const SourceDisputes({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.kindTerm,
    this.note,
    this.noteLanguageId,
    this.resolutionId,
    this.resolvedOn,
    required this.statusTerm,
    required this.subjectId,
    required this.subjectTable,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String kindTerm;
  final String? note;
  final String? noteLanguageId;
  final String? resolutionId;
  final DateTime? resolvedOn;
  final String statusTerm;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final DateTime updatedAt;
  final int version;

  factory SourceDisputes.fromJson(Map<String, dynamic> json) => _$SourceDisputesFromJson(json);

  Map<String, dynamic> toJson() => _$SourceDisputesToJson(this);
}
