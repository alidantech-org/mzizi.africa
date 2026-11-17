// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manifest_releases.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceManifestReleases _$SourceManifestReleasesFromJson(Map<String, dynamic> json) => SourceManifestReleases(
  approvedAt: DateTime.parse(json['approvedAt'] as String),
  approvedBySnapshot: json['approvedBySnapshot'] as String,
  contentHash: json['contentHash'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveFrom: DateTime.parse(json['effectiveFrom'] as String),
  effectiveUntil: json['effectiveUntil'] == null ? null : DateTime.parse(json['effectiveUntil'] as String),
  fileVersionId: json['fileVersionId'] as String,
  id: json['id'] as String,
  inputSchemaCode: json['inputSchemaCode'] as String,
  inputSchemaVersion: json['inputSchemaVersion'] as String,
  manifestId: json['manifestId'] as String,
  releaseLabel: json['releaseLabel'] as String,
  requiredCapabilities: json['requiredCapabilities'] as String,
  status: $enumDecode(_$SourceReleaseStatusEnumMap, json['status']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceManifestReleasesToJson(SourceManifestReleases instance) => <String, dynamic>{
  'approvedAt': instance.approvedAt.toIso8601String(),
  'approvedBySnapshot': instance.approvedBySnapshot,
  'contentHash': instance.contentHash,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveFrom': instance.effectiveFrom.toIso8601String(),
  'effectiveUntil': ?instance.effectiveUntil?.toIso8601String(),
  'fileVersionId': instance.fileVersionId,
  'id': instance.id,
  'inputSchemaCode': instance.inputSchemaCode,
  'inputSchemaVersion': instance.inputSchemaVersion,
  'manifestId': instance.manifestId,
  'releaseLabel': instance.releaseLabel,
  'requiredCapabilities': instance.requiredCapabilities,
  'status': _$SourceReleaseStatusEnumMap[instance.status]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceReleaseStatusEnumMap = {
  SourceReleaseStatus.approved: 'approved',
  SourceReleaseStatus.retired: 'retired',
  SourceReleaseStatus.withdrawn: 'withdrawn',
};
