// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sites.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductSites _$ProductSitesFromJson(Map<String, dynamic> json) => ProductSites(
  appId: json['appId'] as String,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  host: json['host'] as String,
  id: json['id'] as String,
  localeId: json['localeId'] as String?,
  status: $enumDecode(_$ProductSiteStatusEnumMap, json['status']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ProductSitesToJson(ProductSites instance) => <String, dynamic>{
  'appId': instance.appId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'host': instance.host,
  'id': instance.id,
  'localeId': ?instance.localeId,
  'status': _$ProductSiteStatusEnumMap[instance.status]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$ProductSiteStatusEnumMap = {ProductSiteStatus.live: 'live', ProductSiteStatus.planned: 'planned', ProductSiteStatus.retired: 'retired'};
