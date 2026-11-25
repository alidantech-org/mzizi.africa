import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/reference/timezones.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'occurrences.g.dart';

/// One happening of an event, with planned and actual dates.
@JsonSerializable(includeIfNull: false)
class EventOccurrences {
  const EventOccurrences({
    this.actualEndsOn,
    this.actualStartsOn,
    required this.code,
    this.continuesOccurrenceId,
    required this.createdAt,
    this.deletedAt,
    required this.eventId,
    this.formatTerm,
    required this.id,
    required this.isAllDay,
    required this.knowledgeTerm,
    this.organiserId,
    this.plannedEndsOn,
    required this.plannedStartsOn,
    this.startsAt,
    required this.statusTerm,
    this.timezoneId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime? actualEndsOn;
  final DateTime? actualStartsOn;
  final String code;
  final String? continuesOccurrenceId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String? formatTerm;
  final String id;
  final bool isAllDay;
  final String knowledgeTerm;
  final String? organiserId;
  final DateTime? plannedEndsOn;
  final DateTime plannedStartsOn;
  final DateTime? startsAt;
  final String statusTerm;
  final String? timezoneId;
  final DateTime updatedAt;
  final int version;

  factory EventOccurrences.fromJson(Map<String, dynamic> json) => _$EventOccurrencesFromJson(json);

  Map<String, dynamic> toJson() => _$EventOccurrencesToJson(this);
}
