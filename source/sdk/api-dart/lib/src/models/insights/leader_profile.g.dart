// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfile _$InsightsLeaderProfileFromJson(Map<String, dynamic> json) => InsightsLeaderProfile(
  activity: json['activity'],
  contacts: json['contacts'] as List<dynamic>,
  election: json['election'] as List<dynamic>,
  evidence: json['evidence'] as List<dynamic>,
  fund: json['fund'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  leader: json['leader'],
  media: json['media'] as List<dynamic>,
  offices: json['offices'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsLeaderProfileToJson(InsightsLeaderProfile instance) => <String, dynamic>{
  'activity': ?instance.activity,
  'contacts': instance.contacts,
  'election': instance.election,
  'evidence': instance.evidence,
  'fund': ?instance.fund,
  'gaps': instance.gaps,
  'leader': ?instance.leader,
  'media': instance.media,
  'offices': instance.offices,
};
