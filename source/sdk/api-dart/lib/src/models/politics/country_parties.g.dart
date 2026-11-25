// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_parties.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsCountryParties _$PoliticsCountryPartiesFromJson(Map<String, dynamic> json) => PoliticsCountryParties(
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$PoliticsCountryPartiesToJson(PoliticsCountryParties instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
