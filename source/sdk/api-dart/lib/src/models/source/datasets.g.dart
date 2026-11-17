// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'datasets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDatasets _$SourceDatasetsFromJson(Map<String, dynamic> json) => SourceDatasets(
  assembly: $enumDecode(_$SourceDatasetAssemblyEnumMap, json['assembly']),
  categoryId: json['categoryId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  fileVersionId: json['fileVersionId'] as String?,
  format: json['format'] as String,
  id: json['id'] as String,
  location: json['location'] as String?,
  sha256: json['sha256'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDatasetsToJson(SourceDatasets instance) => <String, dynamic>{
  'assembly': _$SourceDatasetAssemblyEnumMap[instance.assembly]!,
  'categoryId': ?instance.categoryId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'fileVersionId': ?instance.fileVersionId,
  'format': instance.format,
  'id': instance.id,
  'location': ?instance.location,
  'sha256': ?instance.sha256,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SourceDatasetAssemblyEnumMap = {
  SourceDatasetAssembly.asDownloaded: 'as-downloaded',
  SourceDatasetAssembly.assembled: 'assembled',
  SourceDatasetAssembly.authored: 'authored',
};
