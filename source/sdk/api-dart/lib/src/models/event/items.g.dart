// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'items.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventItems _$EventItemsFromJson(Map<String, dynamic> json) => EventItems(
  countsWorkingDays: json['countsWorkingDays'] as bool,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventId: json['eventId'] as String,
  id: json['id'] as String,
  note: json['note'] as String?,
  occurrenceId: json['occurrenceId'] as String?,
  offsetDays: (json['offsetDays'] as num?)?.toInt(),
  position: (json['position'] as num).toInt(),
  scheduleId: json['scheduleId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventItemsToJson(EventItems instance) => <String, dynamic>{
  'countsWorkingDays': instance.countsWorkingDays,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventId': instance.eventId,
  'id': instance.id,
  'note': ?instance.note,
  'occurrenceId': ?instance.occurrenceId,
  'offsetDays': ?instance.offsetDays,
  'position': instance.position,
  'scheduleId': instance.scheduleId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
