// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'effect_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalEffectEntry _$LegalEffectEntryFromJson(Map<String, dynamic> json) => LegalEffectEntry(
  designation: json['designation'] as String,
  effectId: json['effectId'] as String,
  effectiveOn: json['effectiveOn'] == null ? null : DateTime.parse(json['effectiveOn'] as String),
  instrumentId: json['instrumentId'] as String,
  kindTerm: json['kindTerm'] as String,
  provisionId: json['provisionId'] as String,
  reviewStatus: $enumDecode(_$LegalReviewStatusEnumMap, json['reviewStatus']),
  wordingId: json['wordingId'] as String,
);

Map<String, dynamic> _$LegalEffectEntryToJson(LegalEffectEntry instance) => <String, dynamic>{
  'designation': instance.designation,
  'effectId': instance.effectId,
  'effectiveOn': ?instance.effectiveOn?.toIso8601String(),
  'instrumentId': instance.instrumentId,
  'kindTerm': instance.kindTerm,
  'provisionId': instance.provisionId,
  'reviewStatus': _$LegalReviewStatusEnumMap[instance.reviewStatus]!,
  'wordingId': instance.wordingId,
};

const _$LegalReviewStatusEnumMap = {
  LegalReviewStatus.accepted: 'accepted',
  LegalReviewStatus.proposed: 'proposed',
  LegalReviewStatus.rejected: 'rejected',
  LegalReviewStatus.reviewed: 'reviewed',
};
