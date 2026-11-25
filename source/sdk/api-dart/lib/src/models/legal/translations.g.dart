// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'translations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalTranslations _$LegalTranslationsFromJson(Map<String, dynamic> json) => LegalTranslations(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  method: $enumDecode(_$LegalTranslationMethodEnumMap, json['method']),
  notes: json['notes'] as String?,
  review: $enumDecode(_$LegalReviewStatusEnumMap, json['review']),
  reviewedAt: json['reviewedAt'] == null ? null : DateTime.parse(json['reviewedAt'] as String),
  reviewedById: json['reviewedById'] as String?,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordingId: json['wordingId'] as String,
);

Map<String, dynamic> _$LegalTranslationsToJson(LegalTranslations instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'method': _$LegalTranslationMethodEnumMap[instance.method]!,
  'notes': ?instance.notes,
  'review': _$LegalReviewStatusEnumMap[instance.review]!,
  'reviewedAt': ?instance.reviewedAt?.toIso8601String(),
  'reviewedById': ?instance.reviewedById,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordingId': instance.wordingId,
};

const _$LegalTranslationMethodEnumMap = {LegalTranslationMethod.human: 'human', LegalTranslationMethod.machine: 'machine'};

const _$LegalReviewStatusEnumMap = {
  LegalReviewStatus.accepted: 'accepted',
  LegalReviewStatus.proposed: 'proposed',
  LegalReviewStatus.rejected: 'rejected',
  LegalReviewStatus.reviewed: 'reviewed',
};
