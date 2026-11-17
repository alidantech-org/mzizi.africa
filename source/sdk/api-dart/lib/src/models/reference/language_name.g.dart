// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'language_name.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceLanguageName _$ReferenceLanguageNameFromJson(Map<String, dynamic> json) => ReferenceLanguageName(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  inLanguageId: json['inLanguageId'] as String,
  languageId: json['languageId'] as String,
  name: json['name'] as String,
  nameKind: $enumDecode(_$ReferenceLanguageNameKindEnumMap, json['nameKind']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceLanguageNameToJson(ReferenceLanguageName instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'inLanguageId': instance.inLanguageId,
  'languageId': instance.languageId,
  'name': instance.name,
  'nameKind': _$ReferenceLanguageNameKindEnumMap[instance.nameKind]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ReferenceLanguageNameKindEnumMap = {
  ReferenceLanguageNameKind.abbreviation: 'abbreviation',
  ReferenceLanguageNameKind.alternative: 'alternative',
  ReferenceLanguageNameKind.endonym: 'endonym',
  ReferenceLanguageNameKind.exonym: 'exonym',
};
