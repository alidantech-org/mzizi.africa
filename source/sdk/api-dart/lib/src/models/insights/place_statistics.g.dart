// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatistics _$InsightsPlaceStatisticsFromJson(Map<String, dynamic> json) => InsightsPlaceStatistics(
  breakdowns: InsightsPlaceStatisticsBreakdowns.fromJson(json['breakdowns'] as Map<String, dynamic>),
  chain: (json['chain'] as List<dynamic>).map((e) => InsightsPlaceCrumb.fromJson(e as Map<String, dynamic>)).toList(),
  comparisons: (json['comparisons'] as List<dynamic>)
      .map((e) => InsightsPlaceStatisticsComparisons.fromJson(e as Map<String, dynamic>))
      .toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  siblings: InsightsPlaceStatisticsSiblings.fromJson(json['siblings'] as Map<String, dynamic>),
  topics: (json['topics'] as List<dynamic>).map((e) => InsightsPlaceStatisticsTopics.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsPlaceStatisticsToJson(InsightsPlaceStatistics instance) => <String, dynamic>{
  'breakdowns': instance.breakdowns,
  'chain': instance.chain,
  'comparisons': instance.comparisons,
  'gaps': instance.gaps,
  'place': instance.place,
  'siblings': instance.siblings,
  'topics': instance.topics,
};
