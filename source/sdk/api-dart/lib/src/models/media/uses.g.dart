// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'uses.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaUses _$MediaUsesFromJson(Map<String, dynamic> json) => MediaUses(
  assetId: json['assetId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  position: (json['position'] as num?)?.toInt(),
  purposeTerm: json['purposeTerm'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$MediaUsesToJson(MediaUses instance) => <String, dynamic>{
  'assetId': instance.assetId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'position': ?instance.position,
  'purposeTerm': instance.purposeTerm,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
