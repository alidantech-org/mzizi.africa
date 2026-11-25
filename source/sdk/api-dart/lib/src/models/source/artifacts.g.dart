// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'artifacts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceArtifacts _$SourceArtifactsFromJson(Map<String, dynamic> json) => SourceArtifacts(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  editionId: json['editionId'] as String?,
  id: json['id'] as String,
  parentId: json['parentId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  versionId: json['versionId'] as String,
);

Map<String, dynamic> _$SourceArtifactsToJson(SourceArtifacts instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'editionId': ?instance.editionId,
  'id': instance.id,
  'parentId': ?instance.parentId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'versionId': instance.versionId,
};
