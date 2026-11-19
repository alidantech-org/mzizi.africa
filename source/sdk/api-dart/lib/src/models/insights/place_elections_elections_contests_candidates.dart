import 'package:json_annotation/json_annotation.dart';

part 'place_elections_elections_contests_candidates.g.dart';

/// Place Elections Elections Contests Candidates
@JsonSerializable(includeIfNull: false)
class InsightsPlaceElectionsElectionsContestsCandidates {
  const InsightsPlaceElectionsElectionsContestsCandidates({
    required this.individualId,
    required this.name,
    required this.party,
    required this.partyCode,
    required this.share,
    required this.votes,
    required this.won,
  });
  final String individualId;
  final String name;
  final String party;
  final String partyCode;
  final double share;
  final double votes;
  final bool won;

  factory InsightsPlaceElectionsElectionsContestsCandidates.fromJson(Map<String, dynamic> json) =>
      _$InsightsPlaceElectionsElectionsContestsCandidatesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsPlaceElectionsElectionsContestsCandidatesToJson(this);
}
