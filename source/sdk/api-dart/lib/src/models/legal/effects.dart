import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_period_subject_entity.dart';

part 'effects.g.dart';

/// A reviewed assertion of what a wording establishes, governs, limits or changes for one subject record. Never mutates the subject.
@JsonSerializable(includeIfNull: false)
class LegalEffects {
  const LegalEffects({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    this.endedOn,
    this.explanation,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    required this.kindId,
    required this.observedAt,
    required this.reviewStatus,
    required this.subjectId,
    required this.subjectTable,
    this.toYear,
    required this.updatedAt,
    required this.version,
    required this.wordingId,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final DateTime? effectiveOn;
  final DateTime? endedOn;
  final String? explanation;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final String kindId;
  final DateTime observedAt;
  final LegalReviewStatus reviewStatus;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final int? toYear;
  final DateTime updatedAt;
  final int version;
  final String wordingId;

  factory LegalEffects.fromJson(Map<String, dynamic> json) => _$LegalEffectsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalEffectsToJson(this);
}
