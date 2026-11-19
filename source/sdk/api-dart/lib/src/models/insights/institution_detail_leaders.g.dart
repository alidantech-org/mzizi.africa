// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_leaders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsInstitutionDetailLeaders _$InsightsInstitutionDetailLeadersFromJson(Map<String, dynamic> json) => InsightsInstitutionDetailLeaders(
  holderId: json['holderId'] as String,
  how: InsightsInstitutionDetailLeadersHow.fromJson(json['how'] as Map<String, dynamic>),
  leaderSlug: json['leaderSlug'] as String,
  name: json['name'] as String,
  officeCode: json['officeCode'] as String,
  party: json['party'] as String?,
  photo: json['photo'] as String,
  since: json['since'] as String,
  tier: InsightsInstitutionDetailLeadersTier.fromJson(json['tier'] as Map<String, dynamic>),
  unit: json['unit'] == null ? null : InsightsInstitutionDetailLeadersUnit.fromJson(json['unit'] as Map<String, dynamic>),
);

Map<String, dynamic> _$InsightsInstitutionDetailLeadersToJson(InsightsInstitutionDetailLeaders instance) => <String, dynamic>{
  'holderId': instance.holderId,
  'how': instance.how,
  'leaderSlug': instance.leaderSlug,
  'name': instance.name,
  'officeCode': instance.officeCode,
  'party': ?instance.party,
  'photo': instance.photo,
  'since': instance.since,
  'tier': instance.tier,
  'unit': ?instance.unit,
};
