// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyDetail _$InsightsPartyDetailFromJson(Map<String, dynamic> json) => InsightsPartyDetail(
  funding: json['funding'] as List<dynamic>,
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  members: json['members'] as List<dynamic>,
  party: json['party'],
  results: json['results'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsPartyDetailToJson(InsightsPartyDetail instance) => <String, dynamic>{
  'funding': instance.funding,
  'gaps': instance.gaps,
  'members': instance.members,
  'party': ?instance.party,
  'results': instance.results,
};
