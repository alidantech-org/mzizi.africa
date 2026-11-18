import 'package:json_annotation/json_annotation.dart';

part 'calendar_event.g.dart';

/// Calendar Event
@JsonSerializable(includeIfNull: false)
class ExperienceCalendarEvent {
  const ExperienceCalendarEvent({
    this.actualOn,
    this.changeNote,
    this.changeReason,
    required this.daysAway,
    required this.eventCode,
    required this.kindCode,
    required this.kindLabel,
    required this.knowledgeCode,
    required this.knowledgeLabel,
    required this.name,
    required this.occurrenceCode,
    required this.plannedOn,
    required this.statusCode,
    required this.statusLabel,
    required this.venueCount,
  });
  final DateTime? actualOn;
  final String? changeNote;
  final String? changeReason;
  final int daysAway;
  final String eventCode;
  final String kindCode;
  final String kindLabel;
  final String knowledgeCode;
  final String knowledgeLabel;
  final String name;
  final String occurrenceCode;
  final DateTime plannedOn;
  final String statusCode;
  final String statusLabel;
  final int venueCount;

  factory ExperienceCalendarEvent.fromJson(Map<String, dynamic> json) => _$ExperienceCalendarEventFromJson(json);

  Map<String, dynamic> toJson() => _$ExperienceCalendarEventToJson(this);
}
