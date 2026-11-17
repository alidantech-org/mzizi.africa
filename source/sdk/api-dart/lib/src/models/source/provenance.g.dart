// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'provenance.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceProvenance _$SourceProvenanceFromJson(Map<String, dynamic> json) => SourceProvenance(
  captureId: json['captureId'] as String?,
  columnName: json['columnName'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  datasetId: json['datasetId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  documentId: json['documentId'] as String?,
  id: json['id'] as String,
  line: (json['line'] as num?)?.toInt(),
  recordId: json['recordId'] as String,
  tableName: json['tableName'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceProvenanceToJson(SourceProvenance instance) => <String, dynamic>{
  'captureId': ?instance.captureId,
  'columnName': ?instance.columnName,
  'createdAt': instance.createdAt.toIso8601String(),
  'datasetId': instance.datasetId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'documentId': ?instance.documentId,
  'id': instance.id,
  'line': ?instance.line,
  'recordId': instance.recordId,
  'tableName': instance.tableName,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
