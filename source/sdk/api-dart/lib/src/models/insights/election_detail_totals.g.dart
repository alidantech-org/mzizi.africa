// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'election_detail_totals.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsElectionDetailTotals _$InsightsElectionDetailTotalsFromJson(Map<String, dynamic> json) => InsightsElectionDetailTotals(
  name: json['name'] as String,
  party: json['party'] as String,
  partyCode: json['partyCode'] as String,
  share: (json['share'] as num).toDouble(),
  votes: (json['votes'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsElectionDetailTotalsToJson(InsightsElectionDetailTotals instance) => <String, dynamic>{
  'name': instance.name,
  'party': instance.party,
  'partyCode': instance.partyCode,
  'share': instance.share,
  'votes': instance.votes,
};
