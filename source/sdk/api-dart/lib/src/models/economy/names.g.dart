// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyNames _$EconomyNamesFromJson(Map<String, dynamic> json) => EconomyNames(
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  kind: $enumDecode(_$EconomyNameKindEnumMap, json['kind']),
  languageId: json['languageId'] as String,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EconomyNamesToJson(EconomyNames instance) => <String, dynamic>{
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'goodId': instance.goodId,
  'id': instance.id,
  'kind': _$EconomyNameKindEnumMap[instance.kind]!,
  'languageId': instance.languageId,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$EconomyNameKindEnumMap = {
  EconomyNameKind.alternative: 'alternative',
  EconomyNameKind.plural: 'plural',
  EconomyNameKind.preferred: 'preferred',
  EconomyNameKind.short: 'short',
};
