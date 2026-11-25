// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'mappings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyMappings _$VocabularyMappingsFromJson(Map<String, dynamic> json) => VocabularyMappings(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromId: json['fromId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$VocabularyMappingKindEnumMap, json['kind']),
  toId: json['toId'] as String,
);

Map<String, dynamic> _$VocabularyMappingsToJson(VocabularyMappings instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromId': instance.fromId,
  'id': instance.id,
  'kind': _$VocabularyMappingKindEnumMap[instance.kind]!,
  'toId': instance.toId,
};

const _$VocabularyMappingKindEnumMap = {
  VocabularyMappingKind.broader: 'broader',
  VocabularyMappingKind.close: 'close',
  VocabularyMappingKind.exact: 'exact',
  VocabularyMappingKind.narrower: 'narrower',
  VocabularyMappingKind.related: 'related',
};
