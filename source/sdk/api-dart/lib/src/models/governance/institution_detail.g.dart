// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetail _$GovernanceInstitutionDetailFromJson(Map<String, dynamic> json) => GovernanceInstitutionDetail(
  code: json['code'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kind: json['kind'] as String,
  mandates: (json['mandates'] as List<dynamic>).map((e) => GovernanceInstitutionDetailMandates.fromJson(e as Map<String, dynamic>)).toList(),
  names: (json['names'] as List<dynamic>).map((e) => GovernanceInstitutionDetailNames.fromJson(e as Map<String, dynamic>)).toList(),
  offices: (json['offices'] as List<dynamic>).map((e) => GovernanceInstitutionDetailOffices.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceInstitutionDetailToJson(GovernanceInstitutionDetail instance) => <String, dynamic>{
  'code': instance.code,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kind': instance.kind,
  'mandates': instance.mandates,
  'names': instance.names,
  'offices': instance.offices,
  'toYear': ?instance.toYear,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
