// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_statistics_siblings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceStatisticsSiblings _$InsightsPlaceStatisticsSiblingsFromJson(Map<String, dynamic> json) => InsightsPlaceStatisticsSiblings(
  density: json['density'] == null ? null : InsightsPlaceStatisticsSiblingsDensity.fromJson(json['density'] as Map<String, dynamic>),
  peers: (json['peers'] as num).toDouble(),
  population: json['population'] == null ? null : InsightsPlaceStatisticsSiblingsPopulation.fromJson(json['population'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsPlaceStatisticsSiblingsToJson(InsightsPlaceStatisticsSiblings instance) => <String, dynamic>{
  'density': ?instance.density,
  'peers': instance.peers,
  'population': ?instance.population,
};
