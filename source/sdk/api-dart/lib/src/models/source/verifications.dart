import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/source/verification_outcome.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/evidence.dart';

part 'verifications.g.dart';

/// Append-only attributable assessment; disagreement and insufficient evidence remain explicit outcomes.
@JsonSerializable(includeIfNull: false)
class SourceVerifications {
  const SourceVerifications({
    required this.assessedAt,
    required this.code,
    this.confidence,
    required this.createdAt,
    this.deletedAt,
    required this.evidenceId,
    required this.explanation,
    required this.id,
    required this.methodId,
    required this.outcome,
    required this.reviewerSnapshot,
    this.supersedesId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime assessedAt;
  final String code;
  final double? confidence;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String evidenceId;
  final String explanation;
  final String id;
  final String methodId;
  final SourceVerificationOutcome outcome;
  final String reviewerSnapshot;
  final String? supersedesId;
  final DateTime updatedAt;
  final int version;

  factory SourceVerifications.fromJson(Map<String, dynamic> json) => _$SourceVerificationsFromJson(json);

  Map<String, dynamic> toJson() => _$SourceVerificationsToJson(this);
}
