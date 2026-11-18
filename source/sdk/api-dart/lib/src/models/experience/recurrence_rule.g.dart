// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'recurrence_rule.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceRecurrenceRule _$ExperienceRecurrenceRuleFromJson(Map<String, dynamic> json) => ExperienceRecurrenceRule(
  dayOfMonth: (json['dayOfMonth'] as num?)?.toInt(),
  intervalYears: (json['intervalYears'] as num?)?.toInt(),
  kindCode: json['kindCode'] as String,
  month: (json['month'] as num?)?.toInt(),
  nthWeekday: (json['nthWeekday'] as num?)?.toInt(),
  rrule: json['rrule'] as String?,
  weekday: (json['weekday'] as num?)?.toInt(),
);

Map<String, dynamic> _$ExperienceRecurrenceRuleToJson(ExperienceRecurrenceRule instance) => <String, dynamic>{
  'dayOfMonth': ?instance.dayOfMonth,
  'intervalYears': ?instance.intervalYears,
  'kindCode': instance.kindCode,
  'month': ?instance.month,
  'nthWeekday': ?instance.nthWeekday,
  'rrule': ?instance.rrule,
  'weekday': ?instance.weekday,
};
