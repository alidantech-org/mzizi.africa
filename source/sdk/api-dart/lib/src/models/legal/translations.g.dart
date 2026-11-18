// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'translations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalTranslations _$LegalTranslationsFromJson(Map<String, dynamic> json) => LegalTranslations(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  method: $enumDecode(_$LegalTranslationMethodEnumMap, json['method']),
  notes: json['notes'] as String?,
  producedAt: json['producedAt'] == null ? null : DateTime.parse(json['producedAt'] as String),
  producedBy: json['producedBy'] as String?,
  reviewStatus: $enumDecode(_$LegalReviewStatusEnumMap, json['reviewStatus']),
  reviewedAt: json['reviewedAt'] == null ? null : DateTime.parse(json['reviewedAt'] as String),
  reviewedBySnapshot: json['reviewedBySnapshot'] as String?,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  wordingId: json['wordingId'] as String,
);

Map<String, dynamic> _$LegalTranslationsToJson(LegalTranslations instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'method': _$LegalTranslationMethodEnumMap[instance.method]!,
  'notes': ?instance.notes,
  'producedAt': ?instance.producedAt?.toIso8601String(),
  'producedBy': ?instance.producedBy,
  'reviewStatus': _$LegalReviewStatusEnumMap[instance.reviewStatus]!,
  'reviewedAt': ?instance.reviewedAt?.toIso8601String(),
  'reviewedBySnapshot': ?instance.reviewedBySnapshot,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'wordingId': instance.wordingId,
};

const _$LegalTranslationMethodEnumMap = {
  LegalTranslationMethod.assisted: 'assisted',
  LegalTranslationMethod.human: 'human',
  LegalTranslationMethod.machine: 'machine',
};

const _$LegalReviewStatusEnumMap = {
  LegalReviewStatus.accepted: 'accepted',
  LegalReviewStatus.proposed: 'proposed',
  LegalReviewStatus.rejected: 'rejected',
  LegalReviewStatus.reviewed: 'reviewed',
};
