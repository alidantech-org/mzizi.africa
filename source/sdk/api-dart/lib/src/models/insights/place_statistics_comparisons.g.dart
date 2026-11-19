// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_comparisons.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsComparisons _$InsightsPlaceStatisticsComparisonsFromJson(Map<String, dynamic> json) => InsightsPlaceStatisticsComparisons(
  areaKm2: (json['areaKm2'] as num?)?.toDouble(),
  density: (json['density'] as num?)?.toDouble(),
  place: InsightsPlaceStatisticsComparisonsPlace.fromJson(json['place'] as Map<String, dynamic>),
  population: (json['population'] as num?)?.toDouble(),
);

Map<String, dynamic> _$InsightsPlaceStatisticsComparisonsToJson(InsightsPlaceStatisticsComparisons instance) => <String, dynamic>{
  'areaKm2': ?instance.areaKm2,
  'density': ?instance.density,
  'place': instance.place,
  'population': ?instance.population,
};
