import 'package:json_annotation/json_annotation.dart';

part 'indicator_series_indicator.g.dart';

/// Indicator Series Indicator
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorSeriesIndicator {
  const InsightsIndicatorSeriesIndicator({
    required this.code,
    required this.description,
    this.higherIsBetter,
    required this.name,
    required this.unit,
  });
  final String code;
  final String description;
  final bool? higherIsBetter;
  final String name;
  final String unit;

  factory InsightsIndicatorSeriesIndicator.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorSeriesIndicatorFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorSeriesIndicatorToJson(this);
}
