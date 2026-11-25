// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_offices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetailOffices _$GovernanceInstitutionDetailOfficesFromJson(Map<String, dynamic> json) => GovernanceInstitutionDetailOffices(
  code: json['code'] as String,
  featureId: json['featureId'] as String?,
  holders: (json['holders'] as List<dynamic>).map((e) => GovernanceInstitutionDetailOfficesHolders.fromJson(e as Map<String, dynamic>)).toList(),
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionDetailOfficesNames.fromJson(e as Map<String, dynamic>)).toList(),
  officeId: json['officeId'] as String,
  order: (json['order'] as num?)?.toInt(),
  roleTerm: json['roleTerm'] as String,
  seat: json['seat'] as String?,
);

Map<String, dynamic> _$GovernanceInstitutionDetailOfficesToJson(GovernanceInstitutionDetailOffices instance) => <String, dynamic>{
  'code': instance.code,
  'featureId': ?instance.featureId,
  'holders': instance.holders,
  'names': instance.names,
  'officeId': instance.officeId,
  'order': ?instance.order,
  'roleTerm': instance.roleTerm,
  'seat': ?instance.seat,
};
