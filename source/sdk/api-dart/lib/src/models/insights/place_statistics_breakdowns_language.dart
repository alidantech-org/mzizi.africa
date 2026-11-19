import 'package:json_annotation/json_annotation.dart';

part 'place_statistics_breakdowns_language.g.dart';

/// Place Statistics Breakdowns Language
@JsonSerializable(includeIfNull: false)
class InsightsPlaceStatisticsBreakdownsLanguage {
  const InsightsPlaceStatisticsBreakdownsLanguage({required this.label, required this.share, required this.value});
  final String label;
  final double share;
  final double value;

  factory InsightsPlaceStatisticsBreakdownsLanguage.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceStatisticsBreakdownsLanguageFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceStatisticsBreakdownsLanguageToJson(this);
}
