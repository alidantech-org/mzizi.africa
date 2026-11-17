// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'captures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceCaptures _$SourceCapturesFromJson(Map<String, dynamic> json) => SourceCaptures(
  addressId: json['addressId'] as String?,
  artifactId: json['artifactId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  discoveryId: json['discoveryId'] as String?,
  id: json['id'] as String,
  originalUrl: json['originalUrl'] as String,
  responseMetadata: json['responseMetadata'] as String,
  retrievedAt: DateTime.parse(json['retrievedAt'] as String),
  retrievedUrl: json['retrievedUrl'] as String?,
  sourceId: json['sourceId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceCapturesToJson(SourceCaptures instance) => <String, dynamic>{
  'addressId': ?instance.addressId,
  'artifactId': ?instance.artifactId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'discoveryId': ?instance.discoveryId,
  'id': instance.id,
  'originalUrl': instance.originalUrl,
  'responseMetadata': instance.responseMetadata,
  'retrievedAt': instance.retrievedAt.toIso8601String(),
  'retrievedUrl': ?instance.retrievedUrl,
  'sourceId': ?instance.sourceId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
