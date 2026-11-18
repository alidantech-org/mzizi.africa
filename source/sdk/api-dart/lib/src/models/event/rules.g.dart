// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'rules.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventRules _$EventRulesFromJson(Map<String, dynamic> json) => EventRules(
  adjustmentId: json['adjustmentId'] as String?,
  anchorOn: json['anchorOn'] == null ? null : DateTime.parse(json['anchorOn'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  dayOfMonth: (json['dayOfMonth'] as num?)?.toInt(),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventId: json['eventId'] as String,
  fromToPrecision: $enumDecodeNullable(_$SharedDatePrecisionEnumMap, json['fromToPrecision']),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  intervalYears: (json['intervalYears'] as num?)?.toInt(),
  month: (json['month'] as num?)?.toInt(),
  nthWeekday: (json['nthWeekday'] as num?)?.toInt(),
  rrule: json['rrule'] as String?,
  ruleKindId: json['ruleKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  weekday: (json['weekday'] as num?)?.toInt(),
);

Map<String, dynamic> _$EventRulesToJson(EventRules instance) => <String, dynamic>{
  'adjustmentId': ?instance.adjustmentId,
  'anchorOn': ?instance.anchorOn?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'dayOfMonth': ?instance.dayOfMonth,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventId': instance.eventId,
  'fromToPrecision': ?_$SharedDatePrecisionEnumMap[instance.fromToPrecision],
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'intervalYears': ?instance.intervalYears,
  'month': ?instance.month,
  'nthWeekday': ?instance.nthWeekday,
  'rrule': ?instance.rrule,
  'ruleKindId': instance.ruleKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'weekday': ?instance.weekday,
};

const _$SharedDatePrecisionEnumMap = {
  SharedDatePrecision.approximate: 'approximate',
  SharedDatePrecision.endApproximate: 'end-approximate',
  SharedDatePrecision.exact: 'exact',
  SharedDatePrecision.startApproximate: 'start-approximate',
  SharedDatePrecision.unknown: 'unknown',
};
