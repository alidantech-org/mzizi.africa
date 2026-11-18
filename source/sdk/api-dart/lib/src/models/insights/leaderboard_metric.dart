import 'package:json_annotation/json_annotation.dart';

part 'leaderboard_metric.g.dart';

/// Leaderboard Metric
@JsonSerializable(includeIfNull: false)
class InsightsLeaderboardMetric {
  const InsightsLeaderboardMetric({
    required this.code,
    required this.describe,
    required this.domain,
    required this.higherIsBetter,
    required this.title,
    this.unit,
  });
  final String code;
  final String describe;
  final String domain;
  final bool higherIsBetter;
  final String title;
  final String? unit;

  factory InsightsLeaderboardMetric.fromJson(Map<String, dynamic> json) => _$InsightsLeaderboardMetricFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderboardMetricToJson(this);
}
