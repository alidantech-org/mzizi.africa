import 'package:json_annotation/json_annotation.dart';

part 'comparison_b.g.dart';

/// Comparison B
@JsonSerializable(includeIfNull: false)
class InsightsComparisonB {
  const InsightsComparisonB({required this.featureId, required this.kindCode, required this.kindLabel, required this.name, required this.path});
  final String featureId;
  final String kindCode;
  final String kindLabel;
  final String name;
  final String path;

  factory InsightsComparisonB.fromJson(Map<String, dynamic> json) => _$InsightsComparisonBFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsComparisonBToJson(this);
}
