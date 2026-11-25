// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeEntry _$GovernanceOfficeEntryFromJson(Map<String, dynamic> json) => GovernanceOfficeEntry(
  code: json['code'] as String,
  holders: (json['holders'] as List<dynamic>).map((e) => GovernanceOfficeEntryHolders.fromJson(e as Map<String, dynamic>)).toList(),
  institutionCode: json['institutionCode'] as String,
  institutionId: json['institutionId'] as String,
  methodTerm: json['methodTerm'] as String?,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceOfficeEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  officeId: json['officeId'] as String,
  order: (json['order'] as num?)?.toInt(),
  roleTerm: json['roleTerm'] as String,
  seat: json['seat'] as String?,
);

Map<String, dynamic> _$GovernanceOfficeEntryToJson(GovernanceOfficeEntry instance) => <String, dynamic>{
  'code': instance.code,
  'holders': instance.holders,
  'institutionCode': instance.institutionCode,
  'institutionId': instance.institutionId,
  'methodTerm': ?instance.methodTerm,
  'names': instance.names,
  'officeId': instance.officeId,
  'order': ?instance.order,
  'roleTerm': instance.roleTerm,
  'seat': ?instance.seat,
};
