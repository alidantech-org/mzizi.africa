// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_detail_holders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeDetailHolders _$GovernanceOfficeDetailHoldersFromJson(Map<String, dynamic> json) => GovernanceOfficeDetailHolders(
  appointment: json['appointment'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  individualId: json['individualId'] as String,
  names: (json['names'] as List<dynamic>).map((e) => GovernanceOfficeDetailHoldersNames.fromJson(e as Map<String, dynamic>)).toList(),
  toYear: (json['toYear'] as num?)?.toInt(),
);

Map<String, dynamic> _$GovernanceOfficeDetailHoldersToJson(GovernanceOfficeDetailHolders instance) => <String, dynamic>{
  'appointment': instance.appointment,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'individualId': instance.individualId,
  'names': instance.names,
  'toYear': ?instance.toYear,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
