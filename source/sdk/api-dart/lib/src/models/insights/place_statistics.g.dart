// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatistics _$InsightsPlaceStatisticsFromJson(Map<String, dynamic> json) => InsightsPlaceStatistics(
  breakdowns: json['breakdowns'],
  chain: (json['chain'] as List<dynamic>).map((e) => InsightsPlaceCrumb.fromJson(e as Map<String, dynamic>)).toList(),
  comparisons: json['comparisons'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  siblings: json['siblings'],
  topics: json['topics'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsPlaceStatisticsToJson(InsightsPlaceStatistics instance) => <String, dynamic>{
  'breakdowns': ?instance.breakdowns,
  'chain': instance.chain,
  'comparisons': instance.comparisons,
  'gaps': instance.gaps,
  'place': instance.place,
  'siblings': ?instance.siblings,
  'topics': instance.topics,
};
