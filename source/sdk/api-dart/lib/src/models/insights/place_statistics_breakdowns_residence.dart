import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_breakdowns_residence.g.dart';

/// Place Statistics Breakdowns Residence
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdownsResidence {
  const InsightsPlaceStatisticsBreakdownsResidence({required this.label, required this.share, required this.value});
  final String label;
  final double share;
  final double value;

  factory InsightsPlaceStatisticsBreakdownsResidence.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsBreakdownsResidenceFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsResidenceToJson(this);
}
