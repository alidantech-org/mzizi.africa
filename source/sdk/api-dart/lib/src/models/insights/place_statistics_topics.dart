import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_statistics_topics_indicators.dart';

part 'place_statistics_topics.g.dart';

/// Place Statistics Topics
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsTopics {
  const InsightsPlaceStatisticsTopics({required this.code, required this.indicators, required this.label});
  final String code;
  final List<InsightsPlaceStatisticsTopicsIndicators> indicators;
  final String label;

  factory InsightsPlaceStatisticsTopics.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsTopicsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsTopicsToJson(this);
}
