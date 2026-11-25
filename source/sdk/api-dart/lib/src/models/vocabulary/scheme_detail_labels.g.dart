// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_detail_labels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularySchemeDetailLabels _$VocabularySchemeDetailLabelsFromJson(Map<String, dynamic> json) => VocabularySchemeDetailLabels(
  kind: $enumDecode(_$VocabularyLabelKindEnumMap, json['kind']),
  languageCode: json['languageCode'] as String,
  text: json['text'] as String,
);

Map<String, dynamic> _$VocabularySchemeDetailLabelsToJson(VocabularySchemeDetailLabels instance) => <String, dynamic>{
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
