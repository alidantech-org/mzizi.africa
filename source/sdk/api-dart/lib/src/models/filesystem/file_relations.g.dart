// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'file_relations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemFileRelations _$FilesystemFileRelationsFromJson(Map<String, dynamic> json) => FilesystemFileRelations(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  derivedVersionId: json['derivedVersionId'] as String,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  processingProvenance: json['processingProvenance'] as String,
  sourceVersionId: json['sourceVersionId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemFileRelationsToJson(FilesystemFileRelations instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'derivedVersionId': instance.derivedVersionId,
  'id': instance.id,
  'kindId': instance.kindId,
  'processingProvenance': instance.processingProvenance,
  'sourceVersionId': instance.sourceVersionId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
