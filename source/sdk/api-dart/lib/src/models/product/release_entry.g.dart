// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'release_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ProductReleaseEntry _$ProductReleaseEntryFromJson(Map<String, dynamic> json) => ProductReleaseEntry(
  appCode: json['appCode'] as String,
  countryCode: json['countryCode'] as String,
  countryId: json['countryId'] as String,
  fromOn: json['fromOn'] == null ? null : DateTime.parse(json['fromOn'] as String),
  releaseId: json['releaseId'] as String,
  status: $enumDecode(_$ProductReleaseStatusEnumMap, json['status']),
);

Map<String, dynamic> _$ProductReleaseEntryToJson(ProductReleaseEntry instance) => <String, dynamic>{
  'appCode': instance.appCode,
  'countryCode': instance.countryCode,
  'countryId': instance.countryId,
  'fromOn': ?instance.fromOn?.toIso8601String(),
  'releaseId': instance.releaseId,
  'status': _$ProductReleaseStatusEnumMap[instance.status]!,
};

const _$ProductReleaseStatusEnumMap = {
  ProductReleaseStatus.live: 'live',
  ProductReleaseStatus.paused: 'paused',
  ProductReleaseStatus.preparing: 'preparing',
  ProductReleaseStatus.withdrawn: 'withdrawn',
};
