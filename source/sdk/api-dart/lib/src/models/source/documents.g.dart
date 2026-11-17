// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'documents.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDocuments _$SourceDocumentsFromJson(Map<String, dynamic> json) => SourceDocuments(
  code: json['code'] as String,
  contentType: json['contentType'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fileVersionId: json['fileVersionId'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  parentId: json['parentId'] as String?,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  publisherId: json['publisherId'] as String?,
  sha256: json['sha256'] as String,
  sizeBytes: (json['sizeBytes'] as num?)?.toInt(),
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDocumentsToJson(SourceDocuments instance) => <String, dynamic>{
  'code': instance.code,
  'contentType': ?instance.contentType,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fileVersionId': ?instance.fileVersionId,
  'id': instance.id,
  'kindId': instance.kindId,
  'parentId': ?instance.parentId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'publisherId': ?instance.publisherId,
  'sha256': instance.sha256,
  'sizeBytes': ?instance.sizeBytes,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
