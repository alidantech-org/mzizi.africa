// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dataset_lineage.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDatasetLineage _$SourceDatasetLineageFromJson(Map<String, dynamic> json) => SourceDatasetLineage(
  createdAt: DateTime.parse(json['createdAt'] as String),
  datasetId: json['datasetId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  inputCaptureId: json['inputCaptureId'] as String?,
  inputDatasetId: json['inputDatasetId'] as String?,
  inputDocumentId: json['inputDocumentId'] as String?,
  method: json['method'] as String?,
  role: $enumDecode(_$SourceLineageRoleEnumMap, json['role']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDatasetLineageToJson(SourceDatasetLineage instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'datasetId': instance.datasetId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'inputCaptureId': ?instance.inputCaptureId,
  'inputDatasetId': ?instance.inputDatasetId,
  'inputDocumentId': ?instance.inputDocumentId,
  'method': ?instance.method,
  'role': _$SourceLineageRoleEnumMap[instance.role]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceLineageRoleEnumMap = {SourceLineageRole.derived: 'derived', SourceLineageRole.lookup: 'lookup', SourceLineageRole.raw: 'raw'};
