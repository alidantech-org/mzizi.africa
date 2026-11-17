// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'folders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemFolders _$FilesystemFoldersFromJson(Map<String, dynamic> json) => FilesystemFolders(
  access: $enumDecode(_$FilesystemAccessEnumMap, json['access']),
  authorization: json['authorization'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  name: json['name'] as String,
  parentId: json['parentId'] as String?,
  roleId: json['roleId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemFoldersToJson(FilesystemFolders instance) => <String, dynamic>{
  'access': _$FilesystemAccessEnumMap[instance.access]!,
  'authorization': ?instance.authorization,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'name': instance.name,
  'parentId': ?instance.parentId,
  'roleId': instance.roleId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$FilesystemAccessEnumMap = {
  FilesystemAccess.internal: 'internal',
  FilesystemAccess.private: 'private',
  FilesystemAccess.public: 'public',
  FilesystemAccess.restricted: 'restricted',
};
