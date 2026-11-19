import 'package:json_annotation/json_annotation.dart';

part 'institution_detail_metrics.g.dart';

/// Institution Detail Metrics
@JsonSerializable(includeIfNull: false)
class InsightsInstitutionDetailMetrics {
  const InsightsInstitutionDetailMetrics({required this.label, required this.value});
  final String label;
  final double value;

  factory InsightsInstitutionDetailMetrics.fromJson(Map<String, dynamic> json) => _$InsightsInstitutionDetailMetricsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsInstitutionDetailMetricsToJson(this);
}
