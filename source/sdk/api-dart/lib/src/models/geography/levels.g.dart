// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'levels.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyLevels _$GeographyLevelsFromJson(Map<String, dynamic> json) => GeographyLevels(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  depth: (json['depth'] as num).toInt(),
  featureKindId: json['featureKindId'] as String,
  hierarchyKindId: json['hierarchyKindId'] as String,
  id: json['id'] as String,
  isRoutingHierarchy: json['isRoutingHierarchy'] as bool,
  rootFeatureId: json['rootFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyLevelsToJson(GeographyLevels instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'depth': instance.depth,
  'featureKindId': instance.featureKindId,
  'hierarchyKindId': instance.hierarchyKindId,
  'id': instance.id,
  'isRoutingHierarchy': instance.isRoutingHierarchy,
  'rootFeatureId': ?instance.rootFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
