// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manifest_bindings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceManifestBindings _$SourceManifestBindingsFromJson(Map<String, dynamic> json) => SourceManifestBindings(
  activatedAt: DateTime.parse(json['activatedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deactivatedAt: json['deactivatedAt'] == null ? null : DateTime.parse(json['deactivatedAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveFrom: DateTime.parse(json['effectiveFrom'] as String),
  effectiveUntil: json['effectiveUntil'] == null ? null : DateTime.parse(json['effectiveUntil'] as String),
  id: json['id'] as String,
  manifestReleaseId: json['manifestReleaseId'] as String,
  sourceId: json['sourceId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceManifestBindingsToJson(SourceManifestBindings instance) => <String, dynamic>{
  'activatedAt': instance.activatedAt.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'deactivatedAt': ?instance.deactivatedAt?.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveFrom': instance.effectiveFrom.toIso8601String(),
  'effectiveUntil': ?instance.effectiveUntil?.toIso8601String(),
  'id': instance.id,
  'manifestReleaseId': instance.manifestReleaseId,
  'sourceId': instance.sourceId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
