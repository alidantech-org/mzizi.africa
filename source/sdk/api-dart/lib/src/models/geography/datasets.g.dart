// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'datasets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyDatasets _$GeographyDatasetsFromJson(Map<String, dynamic> json) => GeographyDatasets(
  code: json['code'] as String,
  coverageFeatureId: json['coverageFeatureId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  crs: json['crs'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fileVersionRefId: json['fileVersionRefId'] as String?,
  format: json['format'] as String,
  id: json['id'] as String,
  qualityNotes: json['qualityNotes'] as String?,
  representationId: json['representationId'] as String,
  resolution: (json['resolution'] as num?)?.toDouble(),
  resolutionUnitId: json['resolutionUnitId'] as String?,
  subjectId: json['subjectId'] as String,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyDatasetsToJson(GeographyDatasets instance) => <String, dynamic>{
  'code': instance.code,
  'coverageFeatureId': ?instance.coverageFeatureId,
  'createdAt': instance.createdAt.toIso8601String(),
  'crs': ?instance.crs,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fileVersionRefId': ?instance.fileVersionRefId,
  'format': instance.format,
  'id': instance.id,
  'qualityNotes': ?instance.qualityNotes,
  'representationId': instance.representationId,
  'resolution': ?instance.resolution,
  'resolutionUnitId': ?instance.resolutionUnitId,
  'subjectId': instance.subjectId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
