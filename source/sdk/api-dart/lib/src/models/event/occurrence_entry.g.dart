// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'occurrence_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventOccurrenceEntry _$EventOccurrenceEntryFromJson(Map<String, dynamic> json) => EventOccurrenceEntry(
  actualStartsOn: json['actualStartsOn'] == null ? null : DateTime.parse(json['actualStartsOn'] as String),
  eventCode: json['eventCode'] as String,
  eventId: json['eventId'] as String,
  featureId: json['featureId'] as String?,
  isAllDay: json['isAllDay'] as bool,
  kindTerm: json['kindTerm'] as String,
  names: (json['names'] as List<dynamic>).map((e) => EventOccurrenceEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  occurrenceId: json['occurrenceId'] as String,
  plannedEndsOn: json['plannedEndsOn'] == null ? null : DateTime.parse(json['plannedEndsOn'] as String),
  plannedStartsOn: DateTime.parse(json['plannedStartsOn'] as String),
  startsAt: json['startsAt'] == null ? null : DateTime.parse(json['startsAt'] as String),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$EventOccurrenceEntryToJson(EventOccurrenceEntry instance) => <String, dynamic>{
  'actualStartsOn': ?instance.actualStartsOn?.toIso8601String(),
  'eventCode': instance.eventCode,
  'eventId': instance.eventId,
  'featureId': ?instance.featureId,
  'isAllDay': instance.isAllDay,
  'kindTerm': instance.kindTerm,
  'names': instance.names,
  'occurrenceId': instance.occurrenceId,
  'plannedEndsOn': ?instance.plannedEndsOn?.toIso8601String(),
  'plannedStartsOn': instance.plannedStartsOn.toIso8601String(),
  'startsAt': ?instance.startsAt?.toIso8601String(),
  'statusTerm': instance.statusTerm,
};
