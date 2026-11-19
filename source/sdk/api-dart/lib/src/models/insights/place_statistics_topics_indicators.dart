import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_latest.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_previous.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators_series.dart';

part 'place_statistics_topics_indicators.g.dart';

/// Place Statistics Topics Indicators
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsTopicsIndicators {
  const InsightsPlaceStatisticsTopicsIndicators({
    this.change,
    required this.code,
    this.higherIsBetter,
    required this.latest,
    required this.measure,
    required this.name,
    this.previous,
    required this.series,
    required this.unit,
  });
  final double? change;
  final String code;
  final bool? higherIsBetter;
  final InsightsPlaceStatisticsTopicsIndicatorsLatest latest;
  final String measure;
  final String name;
  final InsightsPlaceStatisticsTopicsIndicatorsPrevious? previous;
  final List<InsightsPlaceStatisticsTopicsIndicatorsSeries> series;
  final String unit;

  factory InsightsPlaceStatisticsTopicsIndicators.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsTopicsIndicatorsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsTopicsIndicatorsToJson(this);
}
