// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_breakdowns.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsBreakdowns _$InsightsPlaceStatisticsBreakdownsFromJson(Map<String, dynamic> json) => InsightsPlaceStatisticsBreakdowns(
  age: (json['age'] as List<dynamic>?)?.map((e) => InsightsPlaceStatisticsBreakdownsAge.fromJson(e as Map<String, dynamic>)).toList(),
  community: (json['community'] as List<dynamic>?)
      ?.map((e) => InsightsPlaceStatisticsBreakdownsCommunity.fromJson(e as Map<String, dynamic>))
      .toList(),
  language: (json['language'] as List<dynamic>?)
      ?.map((e) => InsightsPlaceStatisticsBreakdownsLanguage.fromJson(e as Map<String, dynamic>))
      .toList(),
  residence: (json['residence'] as List<dynamic>?)
      ?.map((e) => InsightsPlaceStatisticsBreakdownsResidence.fromJson(e as Map<String, dynamic>))
      .toList(),
  sex: (json['sex'] as List<dynamic>?)?.map((e) => InsightsPlaceStatisticsBreakdownsSex.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsPlaceStatisticsBreakdownsToJson(InsightsPlaceStatisticsBreakdowns instance) => <String, dynamic>{
  'age': ?instance.age,
  'community': ?instance.community,
  'language': ?instance.language,
  'residence': ?instance.residence,
  'sex': ?instance.sex,
};
