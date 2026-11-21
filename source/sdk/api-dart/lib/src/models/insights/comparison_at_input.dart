import 'package:json_annotation/json_annotation.dart';

part 'comparison_at_input.g.dart';

/// Comparison At Input
@JsonSerializable(includeIfNull: false)
class InsightsComparisonAtInput {
  const InsightsComparisonAtInput({required this.a, required this.b, required this.countryCode, this.languageCode, this.metrics});
  final String a;
  final String b;
  final String countryCode;
  final String? languageCode;
  final String? metrics;

  factory InsightsComparisonAtInput.fromJson(Map<String, dynamic> json) => _$InsightsComparisonAtInputFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonAtInputToJson(this);
}
