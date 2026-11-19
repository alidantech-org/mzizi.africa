import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_breakdowns_sex.g.dart';

/// Place Statistics Breakdowns Sex
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdownsSex {
  const InsightsPlaceStatisticsBreakdownsSex({required this.label, required this.share, required this.value});
  final String label;
  final double share;
  final double value;

  factory InsightsPlaceStatisticsBreakdownsSex.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsBreakdownsSexFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsSexToJson(this);
}
