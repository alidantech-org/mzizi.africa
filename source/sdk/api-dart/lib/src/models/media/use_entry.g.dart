// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'use_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaUseEntry _$MediaUseEntryFromJson(Map<String, dynamic> json) => MediaUseEntry(
  assetId: json['assetId'] as String,
  captions: (json['captions'] as List<dynamic>).map((e) => MediaUseEntryCaptions.fromJson(e as Map<String, dynamic>)).toList(),
  embedUrl: json['embedUrl'] as String?,
  externalUrl: json['externalUrl'] as String?,
  height: (json['height'] as num?)?.toInt(),
  kind: $enumDecode(_$MediaAssetKindEnumMap, json['kind']),
  kindTerm: json['kindTerm'] as String,
  position: (json['position'] as num?)?.toInt(),
  purposeTerm: json['purposeTerm'] as String,
  s3Key: json['s3Key'] as String?,
  thumbnailUrl: json['thumbnailUrl'] as String?,
  width: (json['width'] as num?)?.toInt(),
);

Map<String, dynamic> _$MediaUseEntryToJson(MediaUseEntry instance) => <String, dynamic>{
  'assetId': instance.assetId,
  'captions': instance.captions,
  'embedUrl': ?instance.embedUrl,
  'externalUrl': ?instance.externalUrl,
  'height': ?instance.height,
  'kind': _$MediaAssetKindEnumMap[instance.kind]!,
  'kindTerm': instance.kindTerm,
  'position': ?instance.position,
  'purposeTerm': instance.purposeTerm,
  's3Key': ?instance.s3Key,
  'thumbnailUrl': ?instance.thumbnailUrl,
  'width': ?instance.width,
};

const _$MediaAssetKindEnumMap = {MediaAssetKind.embed: 'embed', MediaAssetKind.externalValue: 'external', MediaAssetKind.held: 'held'};
