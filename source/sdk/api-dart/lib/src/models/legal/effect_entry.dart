import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/legal/review_status.dart';

part 'effect_entry.g.dart';

/// Effect Entry
@JsonSerializable(includeIfNull: false)
class LegalEffectEntry {
  const LegalEffectEntry({
    required this.designation,
    required this.effectId,
    this.effectiveOn,
    required this.instrumentId,
    required this.kindTerm,
    required this.provisionId,
    required this.reviewStatus,
    required this.wordingId,
  });
  final String designation;
  final String effectId;
  final DateTime? effectiveOn;
  final String instrumentId;
  final String kindTerm;
  final String provisionId;
  final LegalReviewStatus reviewStatus;
  final String wordingId;

  factory LegalEffectEntry.fromJson(Map<String, dynamic> json) => _$LegalEffectEntryFromJson(json);

  Map<String, dynamic> toJson() => _$LegalEffectEntryToJson(this);
}
