// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'media.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemMedia _$FilesystemMediaFromJson(Map<String, dynamic> json) => FilesystemMedia(
  altText: json['altText'] as String?,
  caption: json['caption'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fileVersionId: json['fileVersionId'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  sourceUrl: json['sourceUrl'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemMediaToJson(FilesystemMedia instance) => <String, dynamic>{
  'altText': ?instance.altText,
  'caption': ?instance.caption,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fileVersionId': ?instance.fileVersionId,
  'id': instance.id,
  'kindId': instance.kindId,
  'sourceUrl': ?instance.sourceUrl,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
