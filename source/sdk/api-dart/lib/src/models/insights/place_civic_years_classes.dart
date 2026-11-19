import 'package:json_annotation/json_annotation.dart';

part 'place_civic_years_classes.g.dart';

/// Place Civic Years Classes
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicYearsClasses {
  const InsightsPlaceCivicYearsClasses({required this.amount, required this.code, required this.label, required this.lines});
  final double amount;
  final String code;
  final String label;
  final double lines;

  factory InsightsPlaceCivicYearsClasses.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicYearsClassesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicYearsClassesToJson(this);
}
