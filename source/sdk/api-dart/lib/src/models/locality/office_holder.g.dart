// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_holder.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityOfficeHolder _$LocalityOfficeHolderFromJson(Map<String, dynamic> json) => LocalityOfficeHolder(
  evidence: (json['evidence'] as List<dynamic>).map((e) => LocalityEvidenceRef.fromJson(e as Map<String, dynamic>)).toList(),
  holderId: json['holderId'] as String,
  leftOfficeOn: json['leftOfficeOn'] == null ? null : DateTime.parse(json['leftOfficeOn'] as String),
  officeCode: json['officeCode'] as String,
  officeTitle: json['officeTitle'] as String,
  partyName: json['partyName'] as String?,
  personName: json['personName'] as String,
  portrait: json['portrait'] == null ? null : LocalityMediaRef.fromJson(json['portrait'] as Map<String, dynamic>),
  tookOfficeOn: json['tookOfficeOn'] == null ? null : DateTime.parse(json['tookOfficeOn'] as String),
  unitFeatureId: json['unitFeatureId'] as String?,
  unitName: json['unitName'] as String?,
);

Map<String, dynamic> _$LocalityOfficeHolderToJson(LocalityOfficeHolder instance) => <String, dynamic>{
  'evidence': instance.evidence,
  'holderId': instance.holderId,
  'leftOfficeOn': ?instance.leftOfficeOn?.toIso8601String(),
  'officeCode': instance.officeCode,
  'officeTitle': instance.officeTitle,
  'partyName': ?instance.partyName,
  'personName': instance.personName,
  'portrait': ?instance.portrait,
  'tookOfficeOn': ?instance.tookOfficeOn?.toIso8601String(),
  'unitFeatureId': ?instance.unitFeatureId,
  'unitName': ?instance.unitName,
};
