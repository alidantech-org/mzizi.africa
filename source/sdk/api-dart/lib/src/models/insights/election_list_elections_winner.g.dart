// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_list_elections_winner.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionListElectionsWinner _$InsightsElectionListElectionsWinnerFromJson(Map<String, dynamic> json) =>
    InsightsElectionListElectionsWinner(name: json['name'] as String, party: json['party'] as String, votes: (json['votes'] as num).toDouble());

Map<String, dynamic> _$InsightsElectionListElectionsWinnerToJson(InsightsElectionListElectionsWinner instance) => <String, dynamic>{
  'name': instance.name,
  'party': instance.party,
  'votes': instance.votes,
};
