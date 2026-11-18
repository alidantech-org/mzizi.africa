import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/leaderboard_metric.dart';
import 'package:mzizi_api/src/models/insights/leaderboard_row.dart';

part 'leaderboard.g.dart';

/// Leaderboard
@JsonSerializable(includeIfNull: false)
class InsightsLeaderboard {
  const InsightsLeaderboard({required this.gaps, required this.metric, required this.rows, required this.scope});
  final List<String> gaps;
  final InsightsLeaderboardMetric metric;
  final List<InsightsLeaderboardRow> rows;
  final String scope;

  factory InsightsLeaderboard.fromJson(Map<String, dynamic> json) => _$InsightsLeaderboardFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderboardToJson(this);
}
