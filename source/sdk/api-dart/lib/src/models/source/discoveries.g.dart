// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'discoveries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDiscoveries _$SourceDiscoveriesFromJson(Map<String, dynamic> json) => SourceDiscoveries(
  addressId: json['addressId'] as String?,
  anchorText: json['anchorText'] as String?,
  context: json['context'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  discoveredAt: DateTime.parse(json['discoveredAt'] as String),
  foundOnAddressId: json['foundOnAddressId'] as String?,
  id: json['id'] as String,
  observedUrl: json['observedUrl'] as String,
  sourceId: json['sourceId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDiscoveriesToJson(SourceDiscoveries instance) => <String, dynamic>{
  'addressId': ?instance.addressId,
  'anchorText': ?instance.anchorText,
  'context': ?instance.context,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'discoveredAt': instance.discoveredAt.toIso8601String(),
  'foundOnAddressId': ?instance.foundOnAddressId,
  'id': instance.id,
  'observedUrl': instance.observedUrl,
  'sourceId': ?instance.sourceId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
