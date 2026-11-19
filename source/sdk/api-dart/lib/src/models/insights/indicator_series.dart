import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/indicator_series_indicator.dart';
import 'package:mzizi_api/src/models/insights/indicator_series_points.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'indicator_series.g.dart';

/// Indicator Series
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorSeries {
  const InsightsIndicatorSeries({required this.gaps, required this.indicator, required this.place, required this.points});
  final List<String> gaps;
  final InsightsIndicatorSeriesIndicator indicator;
  final InsightsPlaceCrumb place;
  final List<InsightsIndicatorSeriesPoints> points;

  factory InsightsIndicatorSeries.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorSeriesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorSeriesToJson(this);
}
