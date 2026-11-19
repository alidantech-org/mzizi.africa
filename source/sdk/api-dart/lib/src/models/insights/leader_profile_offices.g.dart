// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'leader_profile_offices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsLeaderProfileOffices _$InsightsLeaderProfileOfficesFromJson(Map<String, dynamic> json) => InsightsLeaderProfileOffices(
  holderId: json['holderId'] as String,
  leaderSlug: json['leaderSlug'] as String,
  leftOfficeOn: json['leftOfficeOn'] as String?,
  office: json['office'] as String,
  tookOfficeOn: json['tookOfficeOn'] as String,
  unit: json['unit'] as String?,
);

Map<String, dynamic> _$InsightsLeaderProfileOfficesToJson(InsightsLeaderProfileOffices instance) => <String, dynamic>{
  'holderId': instance.holderId,
  'leaderSlug': instance.leaderSlug,
  'leftOfficeOn': ?instance.leftOfficeOn,
  'office': instance.office,
  'tookOfficeOn': instance.tookOfficeOn,
  'unit': ?instance.unit,
};
