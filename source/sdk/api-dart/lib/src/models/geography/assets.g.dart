// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyAssets _$GeographyAssetsFromJson(Map<String, dynamic> json) => GeographyAssets(
  band: (json['band'] as num?)?.toInt(),
  builtAt: json['builtAt'] == null ? null : DateTime.parse(json['builtAt'] as String),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  geometryId: json['geometryId'] as String?,
  hierarchyId: json['hierarchyId'] as String?,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  layer: json['layer'] as String?,
  levelId: json['levelId'] as String?,
  member: json['member'] as String?,
  purposeTerm: json['purposeTerm'] as String,
  staleAt: json['staleAt'] == null ? null : DateTime.parse(json['staleAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  versionId: json['versionId'] as String,
);

Map<String, dynamic> _$GeographyAssetsToJson(GeographyAssets instance) => <String, dynamic>{
  'band': ?instance.band,
  'builtAt': ?instance.builtAt?.toIso8601String(),
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'geometryId': ?instance.geometryId,
  'hierarchyId': ?instance.hierarchyId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'layer': ?instance.layer,
  'levelId': ?instance.levelId,
  'member': ?instance.member,
  'purposeTerm': instance.purposeTerm,
  'staleAt': ?instance.staleAt?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'versionId': instance.versionId,
};
