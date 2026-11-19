// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfile _$InsightsLeaderProfileFromJson(Map<String, dynamic> json) => InsightsLeaderProfile(
  activity: InsightsLeaderProfileActivity.fromJson(json['activity'] as Map<String, dynamic>),
  contacts: (json['contacts'] as List<dynamic>).map((e) => InsightsLeaderProfileContacts.fromJson(e as Map<String, dynamic>)).toList(),
  election: (json['election'] as List<dynamic>).map((e) => InsightsLeaderProfileElection.fromJson(e as Map<String, dynamic>)).toList(),
  evidence: (json['evidence'] as List<dynamic>).map((e) => InsightsLeaderProfileEvidence.fromJson(e as Map<String, dynamic>)).toList(),
  fund: json['fund'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  leader: InsightsLeaderProfileLeader.fromJson(json['leader'] as Map<String, dynamic>),
  media: (json['media'] as List<dynamic>).map((e) => InsightsLeaderProfileMedia.fromJson(e as Map<String, dynamic>)).toList(),
  offices: (json['offices'] as List<dynamic>).map((e) => InsightsLeaderProfileOffices.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsLeaderProfileToJson(InsightsLeaderProfile instance) => <String, dynamic>{
  'activity': instance.activity,
  'contacts': instance.contacts,
  'election': instance.election,
  'evidence': instance.evidence,
  'fund': ?instance.fund,
  'gaps': instance.gaps,
  'leader': instance.leader,
  'media': instance.media,
  'offices': instance.offices,
};
