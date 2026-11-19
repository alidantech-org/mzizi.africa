import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_topics_indicators_latest.g.dart';

/// Place Statistics Topics Indicators Latest
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsTopicsIndicatorsLatest {
  const InsightsPlaceStatisticsTopicsIndicatorsLatest({required this.estimated, required this.period, required this.value});
  final bool estimated;
  final String period;
  final double value;

  factory InsightsPlaceStatisticsTopicsIndicatorsLatest.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsTopicsIndicatorsLatestFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsTopicsIndicatorsLatestToJson(this);
}
