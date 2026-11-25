// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeDetail _$GovernanceOfficeDetailFromJson(Map<String, dynamic> json) => GovernanceOfficeDetail(
  code: json['code'] as String,
  featureId: json['featureId'] as String?,
  holders: (json['holders'] as List<dynamic>).map((e) => GovernanceOfficeDetailHolders.fromJson(e as Map<String, dynamic>)).toList(),
  institutionId: json['institutionId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceOfficeDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  officeId: json['officeId'] as String,
  positionId: json['positionId'] as String,
  roleTerm: json['roleTerm'] as String,
  seat: json['seat'] as String?,
  termLimit: (json['termLimit'] as num?)?.toInt(),
  termYears: (json['termYears'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceOfficeDetailToJson(GovernanceOfficeDetail instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': ?instance.featureId,
  'holders': instance.holders,
  'institutionId': instance.institutionId,
  'names': instance.names,
  'officeId': instance.officeId,
  'positionId': instance.positionId,
  'roleTerm': instance.roleTerm,
  'seat': ?instance.seat,
  'termLimit': ?instance.termLimit,
  'termYears': ?instance.termYears,
};
