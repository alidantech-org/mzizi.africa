import 'package:json_annotation/json_annotation.dart';

part 'comparison.g.dart';

/// Comparison
@JsonSerializable(includeIfNull: false)
class InsightsComparison {
  const InsightsComparison({required this.a, required this.b, required this.gaps, required this.rows});
  final Object? a;
  final Object? b;
  final List<String> gaps;
  final List<Object?> rows;

  factory InsightsComparison.fromJson(Map<String, dynamic> json) => _$InsightsComparisonFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonToJson(this);
}
