import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_civic_classes.dart';
import 'package:mzizi_api/src/models/insights/place_civic_fund.dart';
import 'package:mzizi_api/src/models/insights/place_civic_infrastructure.dart';
import 'package:mzizi_api/src/models/insights/place_civic_leadership.dart';
import 'package:mzizi_api/src/models/insights/place_civic_projects.dart';
import 'package:mzizi_api/src/models/insights/place_civic_years.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';

part 'place_civic.g.dart';

/// Place Civic
@JsonSerializable(includeIfNull: false)
class InsightsPlaceCivic {
  const InsightsPlaceCivic({
    required this.chain,
    required this.classes,
    required this.fund,
    required this.gaps,
    required this.infrastructure,
    required this.leadership,
    required this.place,
    required this.projects,
    required this.years,
  });
  final List<InsightsPlaceCrumb> chain;
  final List<InsightsPlaceCivicClasses> classes;
  final InsightsPlaceCivicFund fund;
  final List<String> gaps;
  final InsightsPlaceCivicInfrastructure infrastructure;
  final List<InsightsPlaceCivicLeadership> leadership;
  final InsightsPlaceCrumb place;
  final List<InsightsPlaceCivicProjects> projects;
  final List<InsightsPlaceCivicYears> years;

  factory InsightsPlaceCivic.fromJson(Map<String, dynamic> json) => _$InsightsPlaceCivicFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceCivicToJson(this);
}
