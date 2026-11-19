import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_breakdowns_age.g.dart';

/// Place Statistics Breakdowns Age
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdownsAge {
  const InsightsPlaceStatisticsBreakdownsAge({required this.label, required this.share, required this.value});
  final String label;
  final double share;
  final double value;

  factory InsightsPlaceStatisticsBreakdownsAge.fromJson(Map<String, dynamic> json) => _$InsightsPlaceStatisticsBreakdownsAgeFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsAgeToJson(this);
}
