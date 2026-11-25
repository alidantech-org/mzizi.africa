// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'releases.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductReleases _$ProductReleasesFromJson(Map<String, dynamic> json) => ProductReleases(
  appId: json['appId'] as String,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromOn: json['fromOn'] == null ? null : DateTime.parse(json['fromOn'] as String),
  id: json['id'] as String,
  status: $enumDecode(_$ProductReleaseStatusEnumMap, json['status']),
  toOn: json['toOn'] == null ? null : DateTime.parse(json['toOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ProductReleasesToJson(ProductReleases instance) => <String, dynamic>{
  'appId': instance.appId,
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromOn': ?instance.fromOn?.toIso8601String(),
  'id': instance.id,
  'status': _$ProductReleaseStatusEnumMap[instance.status]!,
  'toOn': ?instance.toOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ProductReleaseStatusEnumMap = {
  ProductReleaseStatus.live: 'live',
  ProductReleaseStatus.paused: 'paused',
  ProductReleaseStatus.preparing: 'preparing',
  ProductReleaseStatus.withdrawn: 'withdrawn',
};
