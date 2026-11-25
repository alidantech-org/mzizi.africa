// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'terms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

VocabularyTerms _$VocabularyTermsFromJson(Map<String, dynamic> json) => VocabularyTerms(
  code: json['code'] as String,
  colorToken: json['colorToken'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  iconCode: json['iconCode'] as String?,
  id: json['id'] as String,
  lower: (json['lower'] as num?)?.toDouble(),
  lowerInclusive: json['lowerInclusive'] as bool?,
  parentId: json['parentId'] as String?,
  position: (json['position'] as num?)?.toInt(),
  schemeId: json['schemeId'] as String,
  status: $enumDecode(_$VocabularyTermStatusEnumMap, json['status']),
  supersedesId: json['supersedesId'] as String?,
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  upper: (json['upper'] as num?)?.toDouble(),
  upperInclusive: json['upperInclusive'] as bool?,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$VocabularyTermsToJson(VocabularyTerms instance) => <String, dynamic>{
  'code': instance.code,
  'colorToken': ?instance.colorToken,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'iconCode': ?instance.iconCode,
  'id': instance.id,
  'lower': ?instance.lower,
  'lowerInclusive': ?instance.lowerInclusive,
  'parentId': ?instance.parentId,
  'position': ?instance.position,
  'schemeId': instance.schemeId,
  'status': _$VocabularyTermStatusEnumMap[instance.status]!,
  'supersedesId': ?instance.supersedesId,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'upper': ?instance.upper,
  'upperInclusive': ?instance.upperInclusive,
  'version': instance.version,
};

const _$VocabularyTermStatusEnumMap = {
  VocabularyTermStatus.active: 'active',
  VocabularyTermStatus.deprecated: 'deprecated',
  VocabularyTermStatus.retired: 'retired',
};
