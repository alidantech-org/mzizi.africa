// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_tallies.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionPlaceTallies _$ElectionPlaceTalliesFromJson(Map<String, dynamic> json) => ElectionPlaceTallies(
  contestId: json['contestId'] as String?,
  countryId: json['countryId'] as String,
  featureId: json['featureId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$ElectionPlaceTalliesToJson(ElectionPlaceTallies instance) => <String, dynamic>{
  'contestId': ?instance.contestId,
  'countryId': instance.countryId,
  'featureId': instance.featureId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
