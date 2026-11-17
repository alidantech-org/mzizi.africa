// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'file_versions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FilesystemFileVersions _$FilesystemFileVersionsFromJson(Map<String, dynamic> json) => FilesystemFileVersions(
  access: $enumDecode(_$FilesystemAccessEnumMap, json['access']),
  contentType: json['contentType'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  createdBySnapshot: json['createdBySnapshot'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fileExtensionId: json['fileExtensionId'] as String?,
  fileId: json['fileId'] as String,
  id: json['id'] as String,
  originalFilename: json['originalFilename'] as String?,
  pinned: json['pinned'] as bool,
  provenance: json['provenance'] as String,
  revision: (json['revision'] as num).toInt(),
  s3Key: json['s3Key'] as String,
  sha256: json['sha256'] as String,
  sizeBytes: (json['sizeBytes'] as num).toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  verifiedAt: DateTime.parse(json['verifiedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FilesystemFileVersionsToJson(FilesystemFileVersions instance) => <String, dynamic>{
  'access': _$FilesystemAccessEnumMap[instance.access]!,
  'contentType': instance.contentType,
  'createdAt': instance.createdAt.toIso8601String(),
  'createdBySnapshot': instance.createdBySnapshot,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fileExtensionId': ?instance.fileExtensionId,
  'fileId': instance.fileId,
  'id': instance.id,
  'originalFilename': ?instance.originalFilename,
  'pinned': instance.pinned,
  'provenance': instance.provenance,
  'revision': instance.revision,
  's3Key': instance.s3Key,
  'sha256': instance.sha256,
  'sizeBytes': instance.sizeBytes,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'verifiedAt': instance.verifiedAt.toIso8601String(),
  'version': instance.version,
};

const _$FilesystemAccessEnumMap = {
  FilesystemAccess.internal: 'internal',
  FilesystemAccess.private: 'private',
  FilesystemAccess.public: 'public',
  FilesystemAccess.restricted: 'restricted',
};
