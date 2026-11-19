// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_leadership.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicLeadership _$InsightsPlaceCivicLeadershipFromJson(Map<String, dynamic> json) => InsightsPlaceCivicLeadership(
  evidence: (json['evidence'] as List<dynamic>).map((e) => InsightsPlaceCivicLeadershipEvidence.fromJson(e as Map<String, dynamic>)).toList(),
  holderId: json['holderId'] as String,
  leaderSlug: json['leaderSlug'] as String,
  leftOfficeOn: json['leftOfficeOn'] as String?,
  officeCode: json['officeCode'] as String,
  officeTitle: json['officeTitle'] as String,
  partyName: json['partyName'] as String?,
  personName: json['personName'] as String,
  portrait: json['portrait'],
  tookOfficeOn: json['tookOfficeOn'] as String,
  unitFeatureId: json['unitFeatureId'] as String,
  unitName: json['unitName'] as String,
);

Map<String, dynamic> _$InsightsPlaceCivicLeadershipToJson(InsightsPlaceCivicLeadership instance) => <String, dynamic>{
  'evidence': instance.evidence,
  'holderId': instance.holderId,
  'leaderSlug': instance.leaderSlug,
  'leftOfficeOn': ?instance.leftOfficeOn,
  'officeCode': instance.officeCode,
  'officeTitle': instance.officeTitle,
  'partyName': ?instance.partyName,
  'personName': instance.personName,
  'portrait': ?instance.portrait,
  'tookOfficeOn': instance.tookOfficeOn,
  'unitFeatureId': instance.unitFeatureId,
  'unitName': instance.unitName,
};
