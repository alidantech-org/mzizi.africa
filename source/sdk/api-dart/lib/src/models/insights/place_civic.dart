import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'place_civic.g.dart';

/// Place Civic
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivic {
  const InsightsPlaceCivic({
    required this.chain,
    required this.classes,
    this.fund,
    required this.gaps,
    required this.infrastructure,
    required this.leadership,
    required this.place,
    required this.projects,
    required this.years,
  });
  final List<InsightsPlaceCrumb> chain;
  final List<Object?> classes;
  final Object? fund;
  final List<String> gaps;
  final Object? infrastructure;
  final List<Object?> leadership;
  final InsightsPlaceCrumb place;
  final List<Object?> projects;
  final List<Object?> years;

  factory InsightsPlaceCivic.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicToJson(this);
}
