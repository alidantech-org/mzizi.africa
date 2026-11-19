// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'party_detail_members.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPartyDetailMembers _$InsightsPartyDetailMembersFromJson(Map<String, dynamic> json) => InsightsPartyDetailMembers(
  holderId: json['holderId'] as String?,
  individualId: json['individualId'] as String,
  leaderSlug: json['leaderSlug'] as String?,
  name: json['name'] as String,
  office: json['office'] as String?,
  unit: json['unit'] as String?,
  unitId: json['unitId'] as String?,
  unitPath: json['unitPath'] as String?,
);

Map<String, dynamic> _$InsightsPartyDetailMembersToJson(InsightsPartyDetailMembers instance) => <String, dynamic>{
  'holderId': ?instance.holderId,
  'individualId': instance.individualId,
  'leaderSlug': ?instance.leaderSlug,
  'name': instance.name,
  'office': ?instance.office,
  'unit': ?instance.unit,
  'unitId': ?instance.unitId,
  'unitPath': ?instance.unitPath,
};
