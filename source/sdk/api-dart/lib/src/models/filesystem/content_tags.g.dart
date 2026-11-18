// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'content_tags.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemContentTags _$FilesystemContentTagsFromJson(Map<String, dynamic> json) => FilesystemContentTags(
  contentId: json['contentId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  tagId: json['tagId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemContentTagsToJson(FilesystemContentTags instance) => <String, dynamic>{
  'contentId': instance.contentId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'tagId': instance.tagId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
