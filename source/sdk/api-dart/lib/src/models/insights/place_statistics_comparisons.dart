import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_comparisons_place.dart';

part 'place_statistics_comparisons.g.dart';

/// Place Statistics Comparisons
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsComparisons {
  const InsightsPlaceStatisticsComparisons({this.areaKm2, this.density, required this.place, this.population});
  final double? areaKm2;
  final double? density;
  final InsightsPlaceStatisticsComparisonsPlace place;
  final double? population;

  factory InsightsPlaceStatisticsComparisons.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsComparisonsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsComparisonsToJson(this);
}
