import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'occurrences.g.dart';

/// One dated instance of an event with its planned and actual dates, status, how we know the date, venue and format. Planned dates are never overwritten; changes are recorded.
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
    this.formatId,
    required this.id,
    required this.isAllDay,
    required this.knowledgeId,
    this.organiserEntityId,
    this.plannedEndsOn,
    required this.plannedStartsOn,
    this.sourceCitationId,
    this.startsAt,
    required this.statusId,
    this.timezone,
    required this.updatedAt,
    this.venueFeatureId,
    this.venueNote,
    required this.version,
  });
  final DateTime? actualEndsOn;
  final DateTime? actualStartsOn;
  final String code;
  final String? continuesOccurrenceId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String? formatId;
  final String id;
  final bool isAllDay;
  final String knowledgeId;
  final String? organiserEntityId;
  final DateTime? plannedEndsOn;
  final DateTime plannedStartsOn;
  final String? sourceCitationId;
  final DateTime? startsAt;
  final String statusId;
  final String? timezone;
  final DateTime updatedAt;
  final String? venueFeatureId;
  final String? venueNote;
  final int version;

  factory EventOccurrences.fromJson(Map<String, dynamic> json) => _$EventOccurrencesFromJson(json);

  Map<String, dynamic> toJson() => _$EventOccurrencesToJson(this);
}
