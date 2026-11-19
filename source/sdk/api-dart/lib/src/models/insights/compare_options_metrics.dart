import 'package:json_annotation/json_annotation.dart';

part 'compare_options_metrics.g.dart';

/// Compare Options Metrics
@JsonSerializable(includeIfNull: false)
class InsightsCompareOptionsMetrics {
  const InsightsCompareOptionsMetrics({
    required this.code,
    required this.describe,
    required this.domain,
    required this.higherIsBetter,
    required this.title,
    required this.unit,
  });
  final String code;
  final String describe;
  final String domain;
  final bool higherIsBetter;
  final String title;
  final String unit;

  factory InsightsCompareOptionsMetrics.fromJson(Map<String, dynamic> json) => _$InsightsCompareOptionsMetricsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsCompareOptionsMetricsToJson(this);
}
