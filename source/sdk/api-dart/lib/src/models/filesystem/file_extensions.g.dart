// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'file_extensions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemFileExtensions _$FilesystemFileExtensionsFromJson(Map<String, dynamic> json) => FilesystemFileExtensions(
  code: json['code'] as String,
  contentType: json['contentType'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  extension: json['extension'] as String,
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemFileExtensionsToJson(FilesystemFileExtensions instance) => <String, dynamic>{
  'code': instance.code,
  'contentType': instance.contentType,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'extension': instance.extension,
  'id': instance.id,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
