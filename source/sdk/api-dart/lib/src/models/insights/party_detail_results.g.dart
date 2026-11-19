// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail_results.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyDetailResults _$InsightsPartyDetailResultsFromJson(Map<String, dynamic> json) => InsightsPartyDetailResults(
  candidates: (json['candidates'] as num).toDouble(),
  contest: json['contest'] as String,
  votes: (json['votes'] as num).toDouble(),
  won: (json['won'] as num).toDouble(),
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsPartyDetailResultsToJson(InsightsPartyDetailResults instance) => <String, dynamic>{
  'candidates': instance.candidates,
  'contest': instance.contest,
  'votes': instance.votes,
  'won': instance.won,
  'year': instance.year,
};
