// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'institution_detail_mandates.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstitutionDetailMandates _$GovernanceInstitutionDetailMandatesFromJson(Map<String, dynamic> json) =>
    GovernanceInstitutionDetailMandates(
      description: json['description'] as String,
      fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
      fromYear: (json['fromYear'] as num?)?.toInt(),
      kind: json['kind'] as String,
      toYear: (json['toYear'] as num?)?.toInt(),
    );

Map<String, dynamic> _$GovernanceInstitutionDetailMandatesToJson(GovernanceInstitutionDetailMandates instance) => <String, dynamic>{
  'description': instance.description,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'kind': instance.kind,
  'toYear': ?instance.toYear,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
