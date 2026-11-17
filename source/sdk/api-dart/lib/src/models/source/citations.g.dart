// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'citations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCitations _$SourceCitationsFromJson(Map<String, dynamic> json) => SourceCitations(
  captureId: json['captureId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  documentId: json['documentId'] as String?,
  evidenceId: json['evidenceId'] as String,
  fileVersionId: json['fileVersionId'] as String,
  id: json['id'] as String,
  locator: json['locator'] as String,
  locatorKindId: json['locatorKindId'] as String,
  quotedHash: json['quotedHash'] as String?,
  recordedAt: DateTime.parse(json['recordedAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceCitationsToJson(SourceCitations instance) => <String, dynamic>{
  'captureId': ?instance.captureId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'documentId': ?instance.documentId,
  'evidenceId': instance.evidenceId,
  'fileVersionId': instance.fileVersionId,
  'id': instance.id,
  'locator': instance.locator,
  'locatorKindId': instance.locatorKindId,
  'quotedHash': ?instance.quotedHash,
  'recordedAt': instance.recordedAt.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
