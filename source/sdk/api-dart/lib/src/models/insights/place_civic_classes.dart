import 'package:json_annotation/json_annotation.dart';

part 'place_civic_classes.g.dart';

/// Place Civic Classes
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicClasses {
  const InsightsPlaceCivicClasses({required this.amount, required this.code, required this.label});
  final double amount;
  final String code;
  final String label;

  factory InsightsPlaceCivicClasses.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicClassesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicClassesToJson(this);
}
