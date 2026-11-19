// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'motion_detail_members.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsMotionDetailMembers _$InsightsMotionDetailMembersFromJson(Map<String, dynamic> json) => InsightsMotionDetailMembers(
  holderId: json['holderId'] as String,
  individualId: json['individualId'] as String,
  leaderSlug: json['leaderSlug'] as String,
  name: json['name'] as String,
  office: json['office'] as String,
  party: json['party'] as String?,
  partyCode: json['partyCode'] as String?,
  position: json['position'] as String,
  unit: json['unit'] as String?,
);

Map<String, dynamic> _$InsightsMotionDetailMembersToJson(InsightsMotionDetailMembers instance) => <String, dynamic>{
  'holderId': instance.holderId,
  'individualId': instance.individualId,
  'leaderSlug': instance.leaderSlug,
  'name': instance.name,
  'office': instance.office,
  'party': ?instance.party,
  'partyCode': ?instance.partyCode,
  'position': instance.position,
  'unit': ?instance.unit,
};
