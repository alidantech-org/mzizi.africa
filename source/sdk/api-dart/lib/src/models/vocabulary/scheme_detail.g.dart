// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scheme_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularySchemeDetail _$VocabularySchemeDetailFromJson(Map<String, dynamic> json) => VocabularySchemeDetail(
  answers: $enumDecode(_$VocabularySchemeAnswersEnumMap, json['answers']),
  code: json['code'] as String,
  isOpen: json['isOpen'] as bool,
  labels: (json['labels'] as List<dynamic>).map((e) => VocabularySchemeDetailLabels.fromJson(e as Map<String, dynamic>)).toList(),
  schemeId: json['schemeId'] as String,
  shape: $enumDecode(_$VocabularySchemeShapeEnumMap, json['shape']),
);

Map<String, dynamic> _$VocabularySchemeDetailToJson(VocabularySchemeDetail instance) => <String, dynamic>{
  'answers': _$VocabularySchemeAnswersEnumMap[instance.answers]!,
  'code': instance.code,
  'isOpen': instance.isOpen,
  'labels': instance.labels,
  'schemeId': instance.schemeId,
  'shape': _$VocabularySchemeShapeEnumMap[instance.shape]!,
};

const _$VocabularySchemeAnswersEnumMap = {VocabularySchemeAnswers.many: 'many', VocabularySchemeAnswers.one: 'one'};

const _$VocabularySchemeShapeEnumMap = {
  VocabularySchemeShape.flat: 'flat',
  VocabularySchemeShape.graph: 'graph',
  VocabularySchemeShape.tree: 'tree',
};
