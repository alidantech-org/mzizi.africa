// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendars.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventCalendars _$EventCalendarsFromJson(Map<String, dynamic> json) => EventCalendars(
  calendarKindId: json['calendarKindId'] as String,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String?,
  id: json['id'] as String,
  isObserved: json['isObserved'] as bool,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  yearStartDay: (json['yearStartDay'] as num?)?.toInt(),
  yearStartMonth: (json['yearStartMonth'] as num?)?.toInt(),
);

Map<String, dynamic> _$EventCalendarsToJson(EventCalendars instance) => <String, dynamic>{
  'calendarKindId': instance.calendarKindId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': ?instance.description,
  'id': instance.id,
  'isObserved': instance.isObserved,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'yearStartDay': ?instance.yearStartDay,
  'yearStartMonth': ?instance.yearStartMonth,
};
