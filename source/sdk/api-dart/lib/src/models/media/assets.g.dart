// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'assets.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaAssets _$MediaAssetsFromJson(Map<String, dynamic> json) => MediaAssets(
  author: json['author'] as String?,
  availability: $enumDecodeNullable(_$MediaAvailabilityEnumMap, json['availability']),
  capturedOn: json['capturedOn'] == null ? null : DateTime.parse(json['capturedOn'] as String),
  checkedAt: json['checkedAt'] == null ? null : DateTime.parse(json['checkedAt'] as String),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  duration: (json['duration'] as num?)?.toDouble(),
  embedUrl: json['embedUrl'] as String?,
  endSecond: (json['endSecond'] as num?)?.toDouble(),
  externalId: json['externalId'] as String?,
  externalUrl: json['externalUrl'] as String?,
  height: (json['height'] as num?)?.toInt(),
  id: json['id'] as String,
  kind: $enumDecode(_$MediaAssetKindEnumMap, json['kind']),
  kindTerm: json['kindTerm'] as String,
  licenceTerm: json['licenceTerm'] as String?,
  providerTerm: json['providerTerm'] as String?,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  startSecond: (json['startSecond'] as num?)?.toDouble(),
  thumbnailUrl: json['thumbnailUrl'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  versionId: json['versionId'] as String?,
  width: (json['width'] as num?)?.toInt(),
);

Map<String, dynamic> _$MediaAssetsToJson(MediaAssets instance) => <String, dynamic>{
  'author': ?instance.author,
  'availability': ?_$MediaAvailabilityEnumMap[instance.availability],
  'capturedOn': ?instance.capturedOn?.toIso8601String(),
  'checkedAt': ?instance.checkedAt?.toIso8601String(),
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'duration': ?instance.duration,
  'embedUrl': ?instance.embedUrl,
  'endSecond': ?instance.endSecond,
  'externalId': ?instance.externalId,
  'externalUrl': ?instance.externalUrl,
  'height': ?instance.height,
  'id': instance.id,
  'kind': _$MediaAssetKindEnumMap[instance.kind]!,
  'kindTerm': instance.kindTerm,
  'licenceTerm': ?instance.licenceTerm,
  'providerTerm': ?instance.providerTerm,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'startSecond': ?instance.startSecond,
  'thumbnailUrl': ?instance.thumbnailUrl,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'versionId': ?instance.versionId,
  'width': ?instance.width,
};

const _$MediaAvailabilityEnumMap = {
  MediaAvailability.live: 'live',
  MediaAvailability.removed: 'removed',
  MediaAvailability.unavailable: 'unavailable',
};

const _$MediaAssetKindEnumMap = {MediaAssetKind.embed: 'embed', MediaAssetKind.externalValue: 'external', MediaAssetKind.held: 'held'};
