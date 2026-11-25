// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'occurrences.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventOccurrences _$EventOccurrencesFromJson(Map<String, dynamic> json) => EventOccurrences(
  actualEndsOn: json['actualEndsOn'] == null ? null : DateTime.parse(json['actualEndsOn'] as String),
  actualStartsOn: json['actualStartsOn'] == null ? null : DateTime.parse(json['actualStartsOn'] as String),
  code: json['code'] as String,
  continuesOccurrenceId: json['continuesOccurrenceId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventId: json['eventId'] as String,
  formatTerm: json['formatTerm'] as String?,
  id: json['id'] as String,
  isAllDay: json['isAllDay'] as bool,
  knowledgeTerm: json['knowledgeTerm'] as String,
  organiserId: json['organiserId'] as String?,
  plannedEndsOn: json['plannedEndsOn'] == null ? null : DateTime.parse(json['plannedEndsOn'] as String),
  plannedStartsOn: DateTime.parse(json['plannedStartsOn'] as String),
  startsAt: json['startsAt'] == null ? null : DateTime.parse(json['startsAt'] as String),
  statusTerm: json['statusTerm'] as String,
  timezoneId: json['timezoneId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventOccurrencesToJson(EventOccurrences instance) => <String, dynamic>{
  'actualEndsOn': ?instance.actualEndsOn?.toIso8601String(),
  'actualStartsOn': ?instance.actualStartsOn?.toIso8601String(),
  'code': instance.code,
  'continuesOccurrenceId': ?instance.continuesOccurrenceId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventId': instance.eventId,
  'formatTerm': ?instance.formatTerm,
  'id': instance.id,
  'isAllDay': instance.isAllDay,
  'knowledgeTerm': instance.knowledgeTerm,
  'organiserId': ?instance.organiserId,
  'plannedEndsOn': ?instance.plannedEndsOn?.toIso8601String(),
  'plannedStartsOn': instance.plannedStartsOn.toIso8601String(),
  'startsAt': ?instance.startsAt?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'timezoneId': ?instance.timezoneId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
