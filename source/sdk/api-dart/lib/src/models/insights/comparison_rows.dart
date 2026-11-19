import 'package:json_annotation/json_annotation.dart';

part 'comparison_rows.g.dart';

/// Comparison Rows
@JsonSerializable(includeIfNull: false)
class InsightsComparisonRows {
  const InsightsComparisonRows({
    required this.a,
    required this.b,
    required this.code,
    this.diffPercent,
    required this.higherIsBetter,
    required this.title,
    required this.unit,
  });
  final double a;
  final double b;
  final String code;
  final double? diffPercent;
  final bool higherIsBetter;
  final String title;
  final String unit;

  factory InsightsComparisonRows.fromJson(Map<String, dynamic> json) => _$InsightsComparisonRowsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonRowsToJson(this);
}
