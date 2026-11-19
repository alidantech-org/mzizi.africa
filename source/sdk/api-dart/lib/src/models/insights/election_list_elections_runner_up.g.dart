// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_list_elections_runner_up.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionListElectionsRunnerUp _$InsightsElectionListElectionsRunnerUpFromJson(Map<String, dynamic> json) =>
    InsightsElectionListElectionsRunnerUp(
      name: json['name'] as String,
      party: json['party'] as String,
      votes: (json['votes'] as num).toDouble(),
    );

Map<String, dynamic> _$InsightsElectionListElectionsRunnerUpToJson(InsightsElectionListElectionsRunnerUp instance) => <String, dynamic>{
  'name': instance.name,
  'party': instance.party,
  'votes': instance.votes,
};
