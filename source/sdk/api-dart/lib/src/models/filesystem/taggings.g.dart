// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'taggings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemTaggings _$FilesystemTaggingsFromJson(Map<String, dynamic> json) => FilesystemTaggings(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fileId: json['fileId'] as String?,
  folderId: json['folderId'] as String?,
  id: json['id'] as String,
  tagId: json['tagId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemTaggingsToJson(FilesystemTaggings instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fileId': ?instance.fileId,
  'folderId': ?instance.folderId,
  'id': instance.id,
  'tagId': instance.tagId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
