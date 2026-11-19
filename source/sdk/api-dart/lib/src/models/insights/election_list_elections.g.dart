// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_list_elections.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionListElections _$InsightsElectionListElectionsFromJson(Map<String, dynamic> json) => InsightsElectionListElections(
  code: json['code'] as String,
  contests: (json['contests'] as num).toDouble(),
  electionId: json['electionId'] as String,
  heldOn: json['heldOn'] as String,
  kind: json['kind'] as String,
  registeredVoters: (json['registeredVoters'] as num?)?.toDouble(),
  runnerUp: json['runnerUp'] == null ? null : InsightsElectionListElectionsRunnerUp.fromJson(json['runnerUp'] as Map<String, dynamic>),
  validVotes: (json['validVotes'] as num?)?.toDouble(),
  winner: json['winner'] == null ? null : InsightsElectionListElectionsWinner.fromJson(json['winner'] as Map<String, dynamic>),
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsElectionListElectionsToJson(InsightsElectionListElections instance) => <String, dynamic>{
  'code': instance.code,
  'contests': instance.contests,
  'electionId': instance.electionId,
  'heldOn': instance.heldOn,
  'kind': instance.kind,
  'registeredVoters': ?instance.registeredVoters,
  'runnerUp': ?instance.runnerUp,
  'validVotes': ?instance.validVotes,
  'winner': ?instance.winner,
  'year': instance.year,
};
