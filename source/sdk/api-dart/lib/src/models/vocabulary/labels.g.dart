// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'labels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyLabels _$VocabularyLabelsFromJson(Map<String, dynamic> json) => VocabularyLabels(
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kind: $enumDecode(_$VocabularyLabelKindEnumMap, json['kind']),
  languageId: json['languageId'] as String,
  schemeId: json['schemeId'] as String?,
  termId: json['termId'] as String?,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$VocabularyLabelsToJson(VocabularyLabels instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kind': _$VocabularyLabelKindEnumMap[instance.kind]!,
  'languageId': instance.languageId,
  'schemeId': ?instance.schemeId,
  'termId': ?instance.termId,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$VocabularyLabelKindEnumMap = {
  VocabularyLabelKind.abbreviation: 'abbreviation',
  VocabularyLabelKind.alternative: 'alternative',
  VocabularyLabelKind.definition: 'definition',
  VocabularyLabelKind.plural: 'plural',
  VocabularyLabelKind.preferred: 'preferred',
  VocabularyLabelKind.short: 'short',
};
