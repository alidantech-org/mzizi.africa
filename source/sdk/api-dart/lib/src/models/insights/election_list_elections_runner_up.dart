import 'package:json_annotation/json_annotation.dart';

part 'election_list_elections_runner_up.g.dart';

/// Election List Elections Runner Up
@JsonSerializable(includeIfNull: false)
class InsightsElectionListElectionsRunnerUp {
  const InsightsElectionListElectionsRunnerUp({required this.name, required this.party, required this.votes});
  final String name;
  final String party;
  final double votes;

  factory InsightsElectionListElectionsRunnerUp.fromJson(Map<String, dynamic> json) => _$InsightsElectionListElectionsRunnerUpFromJson(json);

  Map<String, dynamic> toJson() => _$InsightsElectionListElectionsRunnerUpToJson(this);
}
