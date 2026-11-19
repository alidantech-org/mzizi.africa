import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/place_elections_elections_contests_candidates.dart';

part 'place_elections_elections_contests.g.dart';

/// Place Elections Elections Contests
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElectionsElectionsContests {
  const InsightsPlaceElectionsElectionsContests({
    required this.ballotsCast,
    required this.candidates,
    required this.kind,
    required this.registered,
    required this.turnout,
  });
  final double ballotsCast;
  final List<InsightsPlaceElectionsElectionsContestsCandidates> candidates;
  final String kind;
  final double registered;
  final double turnout;

  factory InsightsPlaceElectionsElectionsContests.fromJson(Map<String, dynamic> json) => _$InsightsPlaceElectionsElectionsContestsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsElectionsContestsToJson(this);
}
