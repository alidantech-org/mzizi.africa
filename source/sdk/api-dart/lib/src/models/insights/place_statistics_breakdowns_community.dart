import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_breakdowns_community.g.dart';

/// Place Statistics Breakdowns Community
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdownsCommunity {
  const InsightsPlaceStatisticsBreakdownsCommunity({required this.label, required this.share, required this.value});
  final String label;
  final double share;
  final double value;

  factory InsightsPlaceStatisticsBreakdownsCommunity.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsBreakdownsCommunityFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsCommunityToJson(this);
}
