import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/insights/election_list_elections_runner_up.dart';
import 'package:mzizi_api/src/models/insights/election_list_elections_winner.dart';

part 'election_list_elections.g.dart';

/// Election List Elections
@JsonSerializable(includeIfNull: false)
class InsightsElectionListElections {
  const InsightsElectionListElections({
    required this.code,
    required this.contests,
    required this.electionId,
    required this.heldOn,
    required this.kind,
    this.registeredVoters,
    this.runnerUp,
    this.validVotes,
    this.winner,
    required this.year,
  });
  final String code;
  final double contests;
  final String electionId;
  final String heldOn;
  final String kind;
  final double? registeredVoters;
  final InsightsElectionListElectionsRunnerUp? runnerUp;
  final double? validVotes;
  final InsightsElectionListElectionsWinner? winner;
  final double year;

  factory InsightsElectionListElections.fromJson(Map<String, dynamic> json) => _$InsightsElectionListElectionsFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionListElectionsToJson(this);
}
