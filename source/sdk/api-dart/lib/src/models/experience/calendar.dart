import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/experience/calendar_event.dart';
import 'package:mzizi_api/src/models/experience/countdown.dart';

part 'calendar.g.dart';

/// Calendar
@JsonSerializable(includeIfNull: false)
class ExperienceCalendar {
  const ExperienceCalendar({required this.events, required this.from, required this.gaps, this.next, required this.to});
  final List<ExperienceCalendarEvent> events;
  final DateTime from;
  final List<String> gaps;
  final ExperienceCountdown? next;
  final DateTime to;

  factory ExperienceCalendar.fromJson(Map<String, dynamic> json) => _$ExperienceCalendarFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCalendarToJson(this);
}
