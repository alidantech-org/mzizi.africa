// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_elections.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionCountryElections _$ElectionCountryElectionsFromJson(Map<String, dynamic> json) => ElectionCountryElections(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$ElectionCountryElectionsToJson(ElectionCountryElections instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
