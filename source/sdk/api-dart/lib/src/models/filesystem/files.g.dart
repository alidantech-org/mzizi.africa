// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'files.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemFiles _$FilesystemFilesFromJson(Map<String, dynamic> json) => FilesystemFiles(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currentVersionId: json['currentVersionId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  folderId: json['folderId'] as String,
  id: json['id'] as String,
  name: json['name'] as String,
  retention: $enumDecode(_$FilesystemRetentionEnumMap, json['retention']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemFilesToJson(FilesystemFiles instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currentVersionId': ?instance.currentVersionId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'folderId': instance.folderId,
  'id': instance.id,
  'name': instance.name,
  'retention': _$FilesystemRetentionEnumMap[instance.retention]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$FilesystemRetentionEnumMap = {
  FilesystemRetention.preserveHistory: 'preserve_history',
  FilesystemRetention.replaceCurrent: 'replace_current',
};
