import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/election_detail_contests_candidates_names.dart';

part 'election_detail_contests_candidates.g.dart';

/// Election Detail Contests Candidates
@JsonSerializable(includeIfNull: false)
class ElectionElectionDetailContestsCandidates {
  const ElectionElectionDetailContestsCandidates({
    this.ballotOrder,
    required this.candidateId,
    required this.individualId,
    required this.names,
    this.partyCode,
    this.partyId,
  });
  final int? ballotOrder;
  final String candidateId;
  final String individualId;
  final List<ElectionElectionDetailContestsCandidatesNames> names;
  final String? partyCode;
  final String? partyId;

  factory ElectionElectionDetailContestsCandidates.fromJson(Map<String, dynamic> json) =>
      _$ElectionElectionDetailContestsCandidatesFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionDetailContestsCandidatesToJson(this);
}
