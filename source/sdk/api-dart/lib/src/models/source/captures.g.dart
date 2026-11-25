// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'captures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCaptures _$SourceCapturesFromJson(Map<String, dynamic> json) => SourceCaptures(
  artifactId: json['artifactId'] as String?,
  contentType: json['contentType'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  discoveredAt: json['discoveredAt'] == null ? null : DateTime.parse(json['discoveredAt'] as String),
  discoveryId: json['discoveryId'] as String?,
  etag: json['etag'] as String?,
  id: json['id'] as String,
  lastModified: json['lastModified'] == null ? null : DateTime.parse(json['lastModified'] as String),
  originalUrl: json['originalUrl'] as String,
  pathId: json['pathId'] as String?,
  retrievedAt: DateTime.parse(json['retrievedAt'] as String),
  retrievedUrl: json['retrievedUrl'] as String?,
  sourceId: json['sourceId'] as String?,
  statusCode: (json['statusCode'] as num?)?.toInt(),
);

Map<String, dynamic> _$SourceCapturesToJson(SourceCaptures instance) => <String, dynamic>{
  'artifactId': ?instance.artifactId,
  'contentType': ?instance.contentType,
  'createdAt': instance.createdAt.toIso8601String(),
  'discoveredAt': ?instance.discoveredAt?.toIso8601String(),
  'discoveryId': ?instance.discoveryId,
  'etag': ?instance.etag,
  'id': instance.id,
  'lastModified': ?instance.lastModified?.toIso8601String(),
  'originalUrl': instance.originalUrl,
  'pathId': ?instance.pathId,
  'retrievedAt': instance.retrievedAt.toIso8601String(),
  'retrievedUrl': ?instance.retrievedUrl,
  'sourceId': ?instance.sourceId,
  'statusCode': ?instance.statusCode,
};
