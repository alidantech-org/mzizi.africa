// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facilities_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceFacilitiesInput _$ExperienceFacilitiesInputFromJson(Map<String, dynamic> json) => ExperienceFacilitiesInput(
  classCode: json['classCode'] as String?,
  featureId: json['featureId'] as String?,
  languageCode: json['languageCode'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  query: json['query'] as String?,
);

Map<String, dynamic> _$ExperienceFacilitiesInputToJson(ExperienceFacilitiesInput instance) => <String, dynamic>{
  'classCode': ?instance.classCode,
  'featureId': ?instance.featureId,
  'languageCode': ?instance.languageCode,
  'limit': ?instance.limit,
  'query': ?instance.query,
};
