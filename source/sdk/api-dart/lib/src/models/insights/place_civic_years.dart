import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_civic_years_classes.dart';

part 'place_civic_years.g.dart';

/// Place Civic Years
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivicYears {
  const InsightsPlaceCivicYears({required this.classes, required this.total, required this.year});
  final List<InsightsPlaceCivicYearsClasses> classes;
  final double total;
  final double year;

  factory InsightsPlaceCivicYears.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicYearsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicYearsToJson(this);
}
