// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'countdown_milestone.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCountdownMilestone _$ExperienceCountdownMilestoneFromJson(Map<String, dynamic> json) => ExperienceCountdownMilestone(
  daysAway: (json['daysAway'] as num).toInt(),
  name: json['name'] as String,
  offsetDays: (json['offsetDays'] as num?)?.toInt(),
  plannedOn: DateTime.parse(json['plannedOn'] as String),
);

Map<String, dynamic> _$ExperienceCountdownMilestoneToJson(ExperienceCountdownMilestone instance) => <String, dynamic>{
  'daysAway': instance.daysAway,
  'name': instance.name,
  'offsetDays': ?instance.offsetDays,
  'plannedOn': instance.plannedOn.toIso8601String(),
};
