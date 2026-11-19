import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/comparison_a.dart';
import 'package:mzizi_api/src/models/insights/comparison_b.dart';
import 'package:mzizi_api/src/models/insights/comparison_rows.dart';

part 'comparison.g.dart';

/// Comparison
@JsonSerializable(includeIfNull: false)
class InsightsComparison {
  const InsightsComparison({required this.a, required this.b, required this.gaps, required this.rows});
  final InsightsComparisonA a;
  final InsightsComparisonB b;
  final List<String> gaps;
  final List<InsightsComparisonRows> rows;

  factory InsightsComparison.fromJson(Map<String, dynamic> json) => _$InsightsComparisonFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonToJson(this);
}
