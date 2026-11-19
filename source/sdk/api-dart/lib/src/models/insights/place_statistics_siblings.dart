import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_siblings_density.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_siblings_population.dart';

part 'place_statistics_siblings.g.dart';

/// Place Statistics Siblings
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsSiblings {
  const InsightsPlaceStatisticsSiblings({this.density, required this.peers, this.population});
  final InsightsPlaceStatisticsSiblingsDensity? density;
  final double peers;
  final InsightsPlaceStatisticsSiblingsPopulation? population;

  factory InsightsPlaceStatisticsSiblings.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsSiblingsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsSiblingsToJson(this);
}
