import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/enums/source/verification_outcome.dart';
import 'package:mzizi_api/src/models/auth/accounts.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'verifications.g.dart';

/// A review decision about one row, against what and when.
@JsonSerializable(includeIfNull: false)
class SourceVerifications {
  const SourceVerifications({
    required this.assessedAt,
    required this.code,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.methodTerm,
    this.note,
    this.noteLanguageId,
    required this.outcome,
    this.reviewerId,
    required this.subjectId,
    required this.subjectTable,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime assessedAt;
  final String code;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String methodTerm;
  final String? note;
  final String? noteLanguageId;
  final SourceVerificationOutcome outcome;
  final String? reviewerId;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory SourceVerifications.fromJson(Map<String, dynamic> json) => _$SourceVerificationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceVerificationsToJson(this);
}
