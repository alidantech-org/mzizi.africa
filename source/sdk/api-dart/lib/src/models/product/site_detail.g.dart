// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'site_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductSiteDetail _$ProductSiteDetailFromJson(Map<String, dynamic> json) => ProductSiteDetail(
  appCode: json['appCode'] as String,
  code: json['code'] as String,
  countryCode: json['countryCode'] as String?,
  countryId: json['countryId'] as String?,
  host: json['host'] as String,
  localeId: json['localeId'] as String?,
  siteId: json['siteId'] as String,
  status: $enumDecode(_$ProductSiteStatusEnumMap, json['status']),
);

Map<String, dynamic> _$ProductSiteDetailToJson(ProductSiteDetail instance) => <String, dynamic>{
  'appCode': instance.appCode,
  'code': instance.code,
  'countryCode': ?instance.countryCode,
  'countryId': ?instance.countryId,
  'host': instance.host,
  'localeId': ?instance.localeId,
  'siteId': instance.siteId,
  'status': _$ProductSiteStatusEnumMap[instance.status]!,
};

const _$ProductSiteStatusEnumMap = {ProductSiteStatus.live: 'live', ProductSiteStatus.planned: 'planned', ProductSiteStatus.retired: 'retired'};
