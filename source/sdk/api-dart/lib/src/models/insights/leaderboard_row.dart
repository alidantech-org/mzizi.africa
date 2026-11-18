import 'package:json_annotation/json_annotation.dart';

part 'leaderboard_row.g.dart';

/// Leaderboard Row
@JsonSerializable(includeIfNull: false)
class InsightsLeaderboardRow {
  const InsightsLeaderboardRow({
    this.detail,
    this.featureId,
    required this.name,
    required this.rank,
    this.share,
    this.subjectId,
    required this.value,
  });
  final String? detail;
  final String? featureId;
  final String name;
  final int rank;
  final double? share;
  final String? subjectId;
  final double value;

  factory InsightsLeaderboardRow.fromJson(Map<String, dynamic> json) => _$InsightsLeaderboardRowFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderboardRowToJson(this);
}
