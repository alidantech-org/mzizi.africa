// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_elections_elections_contests_candidates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceElectionsElectionsContestsCandidates _$InsightsPlaceElectionsElectionsContestsCandidatesFromJson(Map<String, dynamic> json) =>
    InsightsPlaceElectionsElectionsContestsCandidates(
      individualId: json['individualId'] as String,
      name: json['name'] as String,
      party: json['party'] as String,
      partyCode: json['partyCode'] as String,
      share: (json['share'] as num).toDouble(),
      votes: (json['votes'] as num).toDouble(),
      won: json['won'] as bool,
    );

Map<String, dynamic> _$InsightsPlaceElectionsElectionsContestsCandidatesToJson(InsightsPlaceElectionsElectionsContestsCandidates instance) =>
    <String, dynamic>{
      'individualId': instance.individualId,
      'name': instance.name,
      'party': instance.party,
      'partyCode': instance.partyCode,
      'share': instance.share,
      'votes': instance.votes,
      'won': instance.won,
    };
