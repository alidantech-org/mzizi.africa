import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/enums/source/verification_outcome.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';

part 'verifications.g.dart';

/// Append-only attributable assessment of one reviewed subject (a claim row or a relationship); disagreement stays explicit.
@JsonSerializable(includeIfNull: false)
class SourceVerifications {
  const SourceVerifications({
    required this.assessedAt,
    required this.code,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.explanation,
    required this.id,
    required this.methodId,
    required this.outcome,
    required this.reviewerSnapshot,
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
  final String explanation;
  final String id;
  final String methodId;
  final SourceVerificationOutcome outcome;
  final String reviewerSnapshot;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory SourceVerifications.fromJson(Map<String, dynamic> json) => _$SourceVerificationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceVerificationsToJson(this);
}
