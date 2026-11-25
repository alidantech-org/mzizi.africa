// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_tenders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicCountryTenders _$CivicCountryTendersFromJson(Map<String, dynamic> json) => CivicCountryTenders(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
  statusTerm: json['statusTerm'] as String?,
);

Map<String, dynamic> _$CivicCountryTendersToJson(CivicCountryTenders instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
  'statusTerm': ?instance.statusTerm,
};
