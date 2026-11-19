import 'package:json_annotation/json_annotation.dart';

part 'indicator_map_indicator.g.dart';

/// Indicator Map Indicator
@JsonSerializable(includeIfNull: false)
class InsightsIndicatorMapIndicator {
  const InsightsIndicatorMapIndicator({required this.code, this.higherIsBetter, required this.name, required this.unit});
  final String code;
  final bool? higherIsBetter;
  final String name;
  final String unit;

  factory InsightsIndicatorMapIndicator.fromJson(Map<String, dynamic> json) => _$InsightsIndicatorMapIndicatorFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsIndicatorMapIndicatorToJson(this);
}
