import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/wordings.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'effects.g.dart';

/// What a provision does to a named thing; a reviewed assertion that never changes the thing itself.
@JsonSerializable(includeIfNull: false)
class LegalEffects {
  const LegalEffects({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    this.effectiveOn,
    this.endedOn,
    this.fromYear,
    required this.id,
    required this.identityId,
    required this.kindTerm,
    this.note,
    this.noteLanguageId,
    required this.reviewStatus,
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
  final int? fromYear;
  final String id;
  final String identityId;
  final String kindTerm;
  final String? note;
  final String? noteLanguageId;
  final LegalReviewStatus reviewStatus;
  final int? toYear;
  final DateTime updatedAt;
  final int version;
  final String wordingId;

  factory LegalEffects.fromJson(Map<String, dynamic> json) => _$LegalEffectsFromJson(json);

  Map<String, dynamic> toJson() => _$LegalEffectsToJson(this);
}
