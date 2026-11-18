import 'package:json_annotation/json_annotation.dart';

part 'comparison_input.g.dart';

/// Comparison Input
@JsonSerializable(includeIfNull: false)
class InsightsComparisonInput {
  const InsightsComparisonInput({required this.a, required this.b, this.metrics});
  final String a;
  final String b;
  final String? metrics;

  factory InsightsComparisonInput.fromJson(Map<String, dynamic> json) => _$InsightsComparisonInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonInputToJson(this);
}
