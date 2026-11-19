import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_elections_elections_contests.dart';

part 'place_elections_elections.g.dart';

/// Place Elections Elections
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElectionsElections {
  const InsightsPlaceElectionsElections({
    required this.contests,
    required this.electionId,
    required this.heldOn,
    required this.kind,
    required this.year,
  });
  final List<InsightsPlaceElectionsElectionsContests> contests;
  final String electionId;
  final String heldOn;
  final String kind;
  final double year;

  factory InsightsPlaceElectionsElections.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsElectionsToJson(this);
}
