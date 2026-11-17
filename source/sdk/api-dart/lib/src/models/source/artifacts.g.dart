// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'artifacts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceArtifacts _$SourceArtifactsFromJson(Map<String, dynamic> json) => SourceArtifacts(
  code: json['code'] as String,
  contentType: json['contentType'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  editionId: json['editionId'] as String,
  fileVersionId: json['fileVersionId'] as String?,
  format: json['format'] as String?,
  id: json['id'] as String,
  location: json['location'] as String?,
  parentId: json['parentId'] as String?,
  sha256: json['sha256'] as String,
  sizeBytes: (json['sizeBytes'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceArtifactsToJson(SourceArtifacts instance) => <String, dynamic>{
  'code': instance.code,
  'contentType': ?instance.contentType,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'editionId': instance.editionId,
  'fileVersionId': ?instance.fileVersionId,
  'format': ?instance.format,
  'id': instance.id,
  'location': ?instance.location,
  'parentId': ?instance.parentId,
  'sha256': instance.sha256,
  'sizeBytes': ?instance.sizeBytes,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
