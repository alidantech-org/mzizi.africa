// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'calendar.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ExperienceCalendar _$ExperienceCalendarFromJson(Map<String, dynamic> json) => ExperienceCalendar(
  events: (json['events'] as List<dynamic>).map((e) => ExperienceCalendarEvent.fromJson(e as Map<String, dynamic>)).toList(),
  from: DateTime.parse(json['from'] as String),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  next: json['next'] == null ? null : ExperienceCountdown.fromJson(json['next'] as Map<String, dynamic>),
  to: DateTime.parse(json['to'] as String),
);

Map<String, dynamic> _$ExperienceCalendarToJson(ExperienceCalendar instance) => <String, dynamic>{
  'events': instance.events,
  'from': instance.from.toIso8601String(),
  'gaps': instance.gaps,
  'next': ?instance.next,
  'to': instance.to.toIso8601String(),
};
