// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'captions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaCaptions _$MediaCaptionsFromJson(Map<String, dynamic> json) => MediaCaptions(
  altText: json['altText'] as String?,
  assetId: json['assetId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  origin: $enumDecode(_$MediaTextOriginEnumMap, json['origin']),
  title: json['title'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$MediaCaptionsToJson(MediaCaptions instance) => <String, dynamic>{
  'altText': ?instance.altText,
  'assetId': instance.assetId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'languageId': instance.languageId,
  'origin': _$MediaTextOriginEnumMap[instance.origin]!,
  'title': ?instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$MediaTextOriginEnumMap = {MediaTextOrigin.human: 'human', MediaTextOrigin.machine: 'machine', MediaTextOrigin.original: 'original'};
