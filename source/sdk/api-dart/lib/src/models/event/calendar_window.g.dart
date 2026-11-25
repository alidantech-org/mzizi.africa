// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar_window.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventCalendarWindow _$EventCalendarWindowFromJson(Map<String, dynamic> json) => EventCalendarWindow(
  countryId: json['countryId'] as String,
  from: DateTime.parse(json['from'] as String),
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$EventCalendarWindowToJson(EventCalendarWindow instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'from': instance.from.toIso8601String(),
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
