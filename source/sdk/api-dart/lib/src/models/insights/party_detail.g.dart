// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyDetail _$InsightsPartyDetailFromJson(Map<String, dynamic> json) => InsightsPartyDetail(
  funding: (json['funding'] as List<dynamic>).map((e) => InsightsPartyDetailFunding.fromJson(e as Map<String, dynamic>)).toList(),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  members: (json['members'] as List<dynamic>).map((e) => InsightsPartyDetailMembers.fromJson(e as Map<String, dynamic>)).toList(),
  party: InsightsPartyDetailParty.fromJson(json['party'] as Map<String, dynamic>),
  results: (json['results'] as List<dynamic>).map((e) => InsightsPartyDetailResults.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsPartyDetailToJson(InsightsPartyDetail instance) => <String, dynamic>{
  'funding': instance.funding,
  'gaps': instance.gaps,
  'members': instance.members,
  'party': instance.party,
  'results': instance.results,
};
