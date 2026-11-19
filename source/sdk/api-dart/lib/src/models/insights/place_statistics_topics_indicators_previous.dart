import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_topics_indicators_previous.g.dart';

/// Place Statistics Topics Indicators Previous
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsTopicsIndicatorsPrevious {
  const InsightsPlaceStatisticsTopicsIndicatorsPrevious({required this.estimated, required this.period, required this.value});
  final bool estimated;
  final String period;
  final double value;

  factory InsightsPlaceStatisticsTopicsIndicatorsPrevious.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsTopicsIndicatorsPreviousFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsTopicsIndicatorsPreviousToJson(this);
}
