// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'source_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceSourceEntry _$SourceSourceEntryFromJson(Map<String, dynamic> json) => SourceSourceEntry(
  code: json['code'] as String,
  credibilityTerm: json['credibilityTerm'] as String?,
  kind: $enumDecode(_$SourceSourceKindEnumMap, json['kind']),
  label: json['label'] as String,
  publisherCode: json['publisherCode'] as String,
  publisherId: json['publisherId'] as String,
  publisherNames: (json['publisherNames'] as List<dynamic>)
      .map((e) => SourceSourceEntryPublisherNames.fromJson(e as Map<String, dynamic>))
      .toList(),
  sourceId: json['sourceId'] as String,
);

Map<String, dynamic> _$SourceSourceEntryToJson(SourceSourceEntry instance) => <String, dynamic>{
  'code': instance.code,
  'credibilityTerm': ?instance.credibilityTerm,
  'kind': _$SourceSourceKindEnumMap[instance.kind]!,
  'label': instance.label,
  'publisherCode': instance.publisherCode,
  'publisherId': instance.publisherId,
  'publisherNames': instance.publisherNames,
  'sourceId': instance.sourceId,
};

const _$SourceSourceKindEnumMap = {
  SourceSourceKind.api: 'api',
  SourceSourceKind.feed: 'feed',
  SourceSourceKind.portal: 'portal',
  SourceSourceKind.website: 'website',
};
