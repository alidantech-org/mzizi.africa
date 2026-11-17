// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyAssets _$GeographyAssetsFromJson(Map<String, dynamic> json) => GeographyAssets(
  band: (json['band'] as num?)?.toInt(),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  featureId: json['featureId'] as String,
  fileVersionId: json['fileVersionId'] as String,
  geometryId: json['geometryId'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  layer: json['layer'] as String?,
  member: json['member'] as String?,
  purposeId: json['purposeId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyAssetsToJson(GeographyAssets instance) => <String, dynamic>{
  'band': ?instance.band,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'featureId': instance.featureId,
  'fileVersionId': instance.fileVersionId,
  'geometryId': ?instance.geometryId,
  'id': instance.id,
  'kindId': instance.kindId,
  'layer': ?instance.layer,
  'member': ?instance.member,
  'purposeId': instance.purposeId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
