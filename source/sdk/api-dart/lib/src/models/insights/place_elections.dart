import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_crumb.dart';
import 'package:mzizi_api/src/models/insights/place_elections_elections.dart';
import 'package:mzizi_api/src/models/insights/place_elections_registration_trend.dart';
import 'package:mzizi_api/src/models/insights/place_elections_turnout_trend.dart';

part 'place_elections.g.dart';

/// Place Elections
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElections {
  const InsightsPlaceElections({
    required this.elections,
    required this.gaps,
    required this.place,
    required this.registrationTrend,
    required this.turnoutTrend,
  });
  final List<InsightsPlaceElectionsElections> elections;
  final List<String> gaps;
  final InsightsPlaceCrumb place;
  final List<InsightsPlaceElectionsRegistrationTrend> registrationTrend;
  final List<InsightsPlaceElectionsTurnoutTrend> turnoutTrend;

  factory InsightsPlaceElections.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsToJson(this);
}
