// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'countdown.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCountdown _$ExperienceCountdownFromJson(Map<String, dynamic> json) => ExperienceCountdown(
  daysAway: (json['daysAway'] as num).toInt(),
  eventCode: json['eventCode'] as String,
  knowledgeCode: json['knowledgeCode'] as String,
  knowledgeLabel: json['knowledgeLabel'] as String,
  milestones: (json['milestones'] as List<dynamic>).map((e) => ExperienceCountdownMilestone.fromJson(e as Map<String, dynamic>)).toList(),
  name: json['name'] as String,
  plannedOn: DateTime.parse(json['plannedOn'] as String),
  rule: json['rule'] == null ? null : ExperienceRecurrenceRule.fromJson(json['rule'] as Map<String, dynamic>),
);

Map<String, dynamic> _$ExperienceCountdownToJson(ExperienceCountdown instance) => <String, dynamic>{
  'daysAway': instance.daysAway,
  'eventCode': instance.eventCode,
  'knowledgeCode': instance.knowledgeCode,
  'knowledgeLabel': instance.knowledgeLabel,
  'milestones': instance.milestones,
  'name': instance.name,
  'plannedOn': instance.plannedOn.toIso8601String(),
  'rule': ?instance.rule,
};
