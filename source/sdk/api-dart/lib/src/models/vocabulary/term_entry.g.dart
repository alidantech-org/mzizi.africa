// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'term_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyTermEntry _$VocabularyTermEntryFromJson(Map<String, dynamic> json) => VocabularyTermEntry(
  code: json['code'] as String,
  colorToken: json['colorToken'] as String?,
  iconCode: json['iconCode'] as String?,
  labels: (json['labels'] as List<dynamic>).map((e) => VocabularyTermEntryLabels.fromJson(e as Map<String, dynamic>)).toList(),
  lower: (json['lower'] as num?)?.toDouble(),
  parentId: json['parentId'] as String?,
  position: (json['position'] as num?)?.toInt(),
  status: $enumDecode(_$VocabularyTermStatusEnumMap, json['status']),
  termId: json['termId'] as String,
  upper: (json['upper'] as num?)?.toDouble(),
);

Map<String, dynamic> _$VocabularyTermEntryToJson(VocabularyTermEntry instance) => <String, dynamic>{
  'code': instance.code,
  'colorToken': ?instance.colorToken,
  'iconCode': ?instance.iconCode,
  'labels': instance.labels,
  'lower': ?instance.lower,
  'parentId': ?instance.parentId,
  'position': ?instance.position,
  'status': _$VocabularyTermStatusEnumMap[instance.status]!,
  'termId': instance.termId,
  'upper': ?instance.upper,
};

const _$VocabularyTermStatusEnumMap = {
  VocabularyTermStatus.active: 'active',
  VocabularyTermStatus.deprecated: 'deprecated',
  VocabularyTermStatus.retired: 'retired',
};
