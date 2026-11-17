// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'source_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalitySourceEntry _$LocalitySourceEntryFromJson(Map<String, dynamic> json) => LocalitySourceEntry(
  artifactCount: (json['artifactCount'] as num).toInt(),
  citationCount: (json['citationCount'] as num).toInt(),
  code: json['code'] as String,
  name: json['name'] as String,
  publisherName: json['publisherName'] as String?,
  sourceId: json['sourceId'] as String,
);

Map<String, dynamic> _$LocalitySourceEntryToJson(LocalitySourceEntry instance) => <String, dynamic>{
  'artifactCount': instance.artifactCount,
  'citationCount': instance.citationCount,
  'code': instance.code,
  'name': instance.name,
  'publisherName': ?instance.publisherName,
  'sourceId': instance.sourceId,
};
