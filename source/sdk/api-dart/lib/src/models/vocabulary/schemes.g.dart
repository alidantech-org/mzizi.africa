// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'schemes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularySchemes _$VocabularySchemesFromJson(Map<String, dynamic> json) => VocabularySchemes(
  answers: $enumDecode(_$VocabularySchemeAnswersEnumMap, json['answers']),
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  isDated: json['isDated'] as bool,
  isOpen: json['isOpen'] as bool,
  shape: $enumDecode(_$VocabularySchemeShapeEnumMap, json['shape']),
  stewardId: json['stewardId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$VocabularySchemesToJson(VocabularySchemes instance) => <String, dynamic>{
  'answers': _$VocabularySchemeAnswersEnumMap[instance.answers]!,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'isDated': instance.isDated,
  'isOpen': instance.isOpen,
  'shape': _$VocabularySchemeShapeEnumMap[instance.shape]!,
  'stewardId': ?instance.stewardId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$VocabularySchemeAnswersEnumMap = {VocabularySchemeAnswers.many: 'many', VocabularySchemeAnswers.one: 'one'};

const _$VocabularySchemeShapeEnumMap = {
  VocabularySchemeShape.flat: 'flat',
  VocabularySchemeShape.graph: 'graph',
  VocabularySchemeShape.tree: 'tree',
};
