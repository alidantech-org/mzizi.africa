import 'package:json_annotation/json_annotation.dart';

part 'leader_profile_election.g.dart';

/// Leader Profile Election
@JsonSerializable(includeIfNull: false)
class InsightsLeaderProfileElection {
  const InsightsLeaderProfileElection({
    required this.candidates,
    required this.heldOn,
    required this.margin,
    required this.registered,
    required this.runnerUp,
    required this.share,
    required this.total,
    required this.votes,
    required this.year,
  });
  final double candidates;
  final String heldOn;
  final double margin;
  final double registered;

  @JsonKey(name: 'runner_up')
  final double runnerUp;
  final double share;
  final double total;
  final double votes;
  final double year;

  factory InsightsLeaderProfileElection.fromJson(Map<String, dynamic> json) => _$InsightsLeaderProfileElectionFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsLeaderProfileElectionToJson(this);
}
