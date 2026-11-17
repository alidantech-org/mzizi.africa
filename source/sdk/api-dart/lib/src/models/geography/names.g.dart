// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyNames _$GeographyNamesFromJson(Map<String, dynamic> json) => GeographyNames(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  isDefault: json['isDefault'] as bool,
  languageId: json['languageId'] as String,
  name: json['name'] as String,
  nameKindId: json['nameKindId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyNamesToJson(GeographyNames instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'isDefault': instance.isDefault,
  'languageId': instance.languageId,
  'name': instance.name,
  'nameKindId': instance.nameKindId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
