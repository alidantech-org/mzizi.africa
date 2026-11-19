import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_siblings_population.g.dart';

/// Place Statistics Siblings Population
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsSiblingsPopulation {
  const InsightsPlaceStatisticsSiblingsPopulation({required this.of, required this.position});
  final double of;
  final double position;

  factory InsightsPlaceStatisticsSiblingsPopulation.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsSiblingsPopulationFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsSiblingsPopulationToJson(this);
}
