import 'package:json_annotation/json_annotation.dart';

part 'indicator_series_points.g.dart';

/// Indicator Series Points
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorSeriesPoints {
  const InsightsIndicatorSeriesPoints({required this.estimated, required this.period, required this.value});
  final bool estimated;
  final String period;
  final double value;

  factory InsightsIndicatorSeriesPoints.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorSeriesPointsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorSeriesPointsToJson(this);
}
