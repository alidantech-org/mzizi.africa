// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_leader.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileLeader _$InsightsLeaderProfileLeaderFromJson(Map<String, dynamic> json) => InsightsLeaderProfileLeader(
  birthDate: json['birthDate'] as String,
  holderId: json['holderId'] as String,
  individualId: json['individualId'] as String,
  institution: json['institution'] as String,
  leaderSlug: json['leaderSlug'] as String,
  name: json['name'] as String,
  office: json['office'] as String,
  party: json['party'] as String?,
  tookOfficeOn: json['tookOfficeOn'] as String,
  unit: json['unit'] as String?,
  unitId: json['unitId'] as String?,
  unitPath: json['unitPath'] as String?,
);

Map<String, dynamic> _$InsightsLeaderProfileLeaderToJson(InsightsLeaderProfileLeader instance) => <String, dynamic>{
  'birthDate': instance.birthDate,
  'holderId': instance.holderId,
  'individualId': instance.individualId,
  'institution': instance.institution,
  'leaderSlug': instance.leaderSlug,
  'name': instance.name,
  'office': instance.office,
  'party': ?instance.party,
  'tookOfficeOn': instance.tookOfficeOn,
  'unit': ?instance.unit,
  'unitId': ?instance.unitId,
  'unitPath': ?instance.unitPath,
};
