// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'term_entry_labels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyTermEntryLabels _$VocabularyTermEntryLabelsFromJson(Map<String, dynamic> json) => VocabularyTermEntryLabels(
  countryId: json['countryId'] as String?,
  kind: $enumDecode(_$VocabularyLabelKindEnumMap, json['kind']),
  languageCode: json['languageCode'] as String,
  text: json['text'] as String,
);

Map<String, dynamic> _$VocabularyTermEntryLabelsToJson(VocabularyTermEntryLabels instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'kind': _$VocabularyLabelKindEnumMap[instance.kind]!,
  'languageCode': instance.languageCode,
  'text': instance.text,
};

const _$VocabularyLabelKindEnumMap = {
  VocabularyLabelKind.abbreviation: 'abbreviation',
  VocabularyLabelKind.alternative: 'alternative',
  VocabularyLabelKind.definition: 'definition',
  VocabularyLabelKind.plural: 'plural',
  VocabularyLabelKind.preferred: 'preferred',
  VocabularyLabelKind.short: 'short',
};
