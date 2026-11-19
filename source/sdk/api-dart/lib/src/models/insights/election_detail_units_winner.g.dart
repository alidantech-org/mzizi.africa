// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_units_winner.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetailUnitsWinner _$InsightsElectionDetailUnitsWinnerFromJson(Map<String, dynamic> json) => InsightsElectionDetailUnitsWinner(
  margin: (json['margin'] as num).toDouble(),
  name: json['name'] as String,
  party: json['party'] as String,
  partyCode: json['partyCode'] as String,
  share: (json['share'] as num).toDouble(),
  votes: (json['votes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsElectionDetailUnitsWinnerToJson(InsightsElectionDetailUnitsWinner instance) => <String, dynamic>{
  'margin': instance.margin,
  'name': instance.name,
  'party': instance.party,
  'partyCode': instance.partyCode,
  'share': instance.share,
  'votes': instance.votes,
};
