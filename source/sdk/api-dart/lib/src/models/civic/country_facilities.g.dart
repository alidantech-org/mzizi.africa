// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'country_facilities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicCountryFacilities _$CivicCountryFacilitiesFromJson(Map<String, dynamic> json) => CivicCountryFacilities(
  classTerm: json['classTerm'] as String?,
  countryId: json['countryId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$CivicCountryFacilitiesToJson(CivicCountryFacilities instance) => <String, dynamic>{
  'classTerm': ?instance.classTerm,
  'countryId': instance.countryId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
