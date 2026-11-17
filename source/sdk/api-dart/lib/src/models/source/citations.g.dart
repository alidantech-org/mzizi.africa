// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'citations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCitations _$SourceCitationsFromJson(Map<String, dynamic> json) => SourceCitations(
  artifactId: json['artifactId'] as String,
  captureId: json['captureId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  locator: json['locator'] as String,
  locatorKindId: json['locatorKindId'] as String,
  quotedHash: json['quotedHash'] as String?,
  recordedAt: DateTime.parse(json['recordedAt'] as String),
  relationshipId: json['relationshipId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceCitationsToJson(SourceCitations instance) => <String, dynamic>{
  'artifactId': instance.artifactId,
  'captureId': ?instance.captureId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'locator': instance.locator,
  'locatorKindId': instance.locatorKindId,
  'quotedHash': ?instance.quotedHash,
  'recordedAt': instance.recordedAt.toIso8601String(),
  'relationshipId': ?instance.relationshipId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
