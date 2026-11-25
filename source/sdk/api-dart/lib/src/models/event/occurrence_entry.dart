import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrence_entry_names.dart';

part 'occurrence_entry.g.dart';

/// Occurrence Entry
@JsonSerializable(includeIfNull: false)
class EventOccurrenceEntry {
  const EventOccurrenceEntry({
    this.actualStartsOn,
    required this.eventCode,
    required this.eventId,
    this.featureId,
    required this.isAllDay,
    required this.kindTerm,
    required this.names,
    required this.occurrenceId,
    this.plannedEndsOn,
    required this.plannedStartsOn,
    this.startsAt,
    required this.statusTerm,
  });
  final DateTime? actualStartsOn;
  final String eventCode;
  final String eventId;
  final String? featureId;
  final bool isAllDay;
  final String kindTerm;
  final List<EventOccurrenceEntryNames> names;
  final String occurrenceId;
  final DateTime? plannedEndsOn;
  final DateTime plannedStartsOn;
  final DateTime? startsAt;
  final String statusTerm;

  factory EventOccurrenceEntry.fromJson(Map<String, dynamic> json) => _$EventOccurrenceEntryFromJson(json);

  Map<String, dynamic> toJson() => _$EventOccurrenceEntryToJson(this);
}
