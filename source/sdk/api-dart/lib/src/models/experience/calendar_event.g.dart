// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_event.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCalendarEvent _$ExperienceCalendarEventFromJson(Map<String, dynamic> json) => ExperienceCalendarEvent(
  actualOn: json['actualOn'] == null ? null : DateTime.parse(json['actualOn'] as String),
  changeNote: json['changeNote'] as String?,
  changeReason: json['changeReason'] as String?,
  daysAway: (json['daysAway'] as num).toInt(),
  eventCode: json['eventCode'] as String,
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
  knowledgeCode: json['knowledgeCode'] as String,
  knowledgeLabel: json['knowledgeLabel'] as String,
  name: json['name'] as String,
  occurrenceCode: json['occurrenceCode'] as String,
  plannedOn: DateTime.parse(json['plannedOn'] as String),
  statusCode: json['statusCode'] as String,
  statusLabel: json['statusLabel'] as String,
  venueCount: (json['venueCount'] as num).toInt(),
);

Map<String, dynamic> _$ExperienceCalendarEventToJson(ExperienceCalendarEvent instance) => <String, dynamic>{
  'actualOn': ?instance.actualOn?.toIso8601String(),
  'changeNote': ?instance.changeNote,
  'changeReason': ?instance.changeReason,
  'daysAway': instance.daysAway,
  'eventCode': instance.eventCode,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'knowledgeCode': instance.knowledgeCode,
  'knowledgeLabel': instance.knowledgeLabel,
  'name': instance.name,
  'occurrenceCode': instance.occurrenceCode,
  'plannedOn': instance.plannedOn.toIso8601String(),
  'statusCode': instance.statusCode,
  'statusLabel': instance.statusLabel,
  'venueCount': instance.venueCount,
};
