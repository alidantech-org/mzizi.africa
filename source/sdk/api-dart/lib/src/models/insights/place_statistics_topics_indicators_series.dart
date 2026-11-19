import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_topics_indicators_series.g.dart';

/// Place Statistics Topics Indicators Series
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsTopicsIndicatorsSeries {
  const InsightsPlaceStatisticsTopicsIndicatorsSeries({required this.estimated, required this.period, required this.value});
  final bool estimated;
  final String period;
  final double value;

  factory InsightsPlaceStatisticsTopicsIndicatorsSeries.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsTopicsIndicatorsSeriesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsTopicsIndicatorsSeriesToJson(this);
}
