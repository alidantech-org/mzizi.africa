import 'package:json_annotation/json_annotation.dart';

part 'comparison_a.g.dart';

/// Comparison A
@JsonSerializable(includeIfNull: false)
class InsightsComparisonA {
  const InsightsComparisonA({required this.featureId, required this.kindCode, required this.kindLabel, required this.name, required this.path});
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String path;

  factory InsightsComparisonA.fromJson(Map<String, dynamic> json) => _$InsightsComparisonAFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonAToJson(this);
}
