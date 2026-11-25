// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetail _$GovernanceInstitutionDetailFromJson(Map<String, dynamic> json) => GovernanceInstitutionDetail(
  armTerm: json['armTerm'] as String?,
  basisTerm: json['basisTerm'] as String?,
  classTerm: json['classTerm'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  institutionId: json['institutionId'] as String,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  offices: (json['offices'] as List<dynamic>).map((e) => GovernanceInstitutionDetailOffices.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceInstitutionDetailToJson(GovernanceInstitutionDetail instance) => <String, dynamic>{
  'armTerm': ?instance.armTerm,
  'basisTerm': ?instance.basisTerm,
  'classTerm': ?instance.classTerm,
  'code': instance.code,
  'countryId': instance.countryId,
  'fromYear': ?instance.fromYear,
  'institutionId': instance.institutionId,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'offices': instance.offices,
  'toYear': ?instance.toYear,
};
