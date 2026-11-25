// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'discoveries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDiscoveries _$SourceDiscoveriesFromJson(Map<String, dynamic> json) => SourceDiscoveries(
  anchorText: json['anchorText'] as String?,
  context: json['context'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  discoveredAt: DateTime.parse(json['discoveredAt'] as String),
  foundOnId: json['foundOnId'] as String?,
  id: json['id'] as String,
  observedUrl: json['observedUrl'] as String,
  pathId: json['pathId'] as String?,
  sourceId: json['sourceId'] as String?,
);

Map<String, dynamic> _$SourceDiscoveriesToJson(SourceDiscoveries instance) => <String, dynamic>{
  'anchorText': ?instance.anchorText,
  'context': ?instance.context,
  'createdAt': instance.createdAt.toIso8601String(),
  'discoveredAt': instance.discoveredAt.toIso8601String(),
  'foundOnId': ?instance.foundOnId,
  'id': instance.id,
  'observedUrl': instance.observedUrl,
  'pathId': ?instance.pathId,
  'sourceId': ?instance.sourceId,
};
