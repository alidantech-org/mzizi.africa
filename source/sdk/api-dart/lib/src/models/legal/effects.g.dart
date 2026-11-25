// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'effects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalEffects _$LegalEffectsFromJson(Map<String, dynamic> json) => LegalEffects(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveOn: json['effectiveOn'] == null ? null : DateTime.parse(json['effectiveOn'] as String),
  endedOn: json['endedOn'] == null ? null : DateTime.parse(json['endedOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  kindTerm: json['kindTerm'] as String,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  reviewStatus: $enumDecode(_$LegalReviewStatusEnumMap, json['reviewStatus']),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordingId: json['wordingId'] as String,
);

Map<String, dynamic> _$LegalEffectsToJson(LegalEffects instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveOn': ?instance.effectiveOn?.toIso8601String(),
  'endedOn': ?instance.endedOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'kindTerm': instance.kindTerm,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'reviewStatus': _$LegalReviewStatusEnumMap[instance.reviewStatus]!,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordingId': instance.wordingId,
};

const _$LegalReviewStatusEnumMap = {
  LegalReviewStatus.accepted: 'accepted',
  LegalReviewStatus.proposed: 'proposed',
  LegalReviewStatus.rejected: 'rejected',
  LegalReviewStatus.reviewed: 'reviewed',
};
