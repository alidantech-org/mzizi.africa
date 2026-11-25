import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/election/election_detail_contests_candidates.dart';

part 'election_detail_contests.g.dart';

/// Election Detail Contests
@JsonSerializable(includeIfNull: false)
class ElectionElectionDetailContests {
  const ElectionElectionDetailContests({
    required this.candidates,
    required this.code,
    required this.contestId,
    this.featureId,
    required this.kindTerm,
    this.officeId,
  });
  final List<ElectionElectionDetailContestsCandidates> candidates;
  final String code;
  final String contestId;
  final String? featureId;
  final String kindTerm;
  final String? officeId;

  factory ElectionElectionDetailContests.fromJson(Map<String, dynamic> json) => _$ElectionElectionDetailContestsFromJson(json);

  Map<String, dynamic> toJson() => _$ElectionElectionDetailContestsToJson(this);
}
