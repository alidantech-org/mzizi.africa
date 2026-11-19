// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'functions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceFunctions _$GovernanceFunctionsFromJson(Map<String, dynamic> json) => GovernanceFunctions(
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  parentFunctionId: json['parentFunctionId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  topicId: json['topicId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceFunctionsToJson(GovernanceFunctions instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'parentFunctionId': ?instance.parentFunctionId,
  'sourceCitationId': ?instance.sourceCitationId,
  'toYear': ?instance.toYear,
  'topicId': ?instance.topicId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
