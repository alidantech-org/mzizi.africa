import 'package:json_annotation/json_annotation.dart';

part 'election_detail_units_candidates.g.dart';

/// Election Detail Units Candidates
@JsonSerializable(includeIfNull: false)
class InsightsElectionDetailUnitsCandidates {
  const InsightsElectionDetailUnitsCandidates({
    required this.name,
    required this.party,
    required this.partyCode,
    required this.share,
    required this.votes,
  });
  final String name;
  final String party;
  final String partyCode;
  final double share;
  final double votes;

  factory InsightsElectionDetailUnitsCandidates.fromJson(Map<String, dynamic> json) => _$InsightsElectionDetailUnitsCandidatesFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionDetailUnitsCandidatesToJson(this);
}
