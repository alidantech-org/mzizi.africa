import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/calendars.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'events.g.dart';

/// One event or a recurring series of events: a public holiday, a national day, an election, a sitting, a government visit. Names, rules and dated occurrences are separate; content and media attach through the subject mechanism.
@JsonSerializable(includeIfNull: false)
class EventEvents {
  const EventEvents({
    this.basisProvisionId,
    this.calendarId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.eventKindId,
    required this.id,
    this.organiserEntityId,
    this.scopeFeatureId,
    this.scopeLevelKindId,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
  });
  final String? basisProvisionId;
  final String? calendarId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventKindId;
  final String id;
  final String? organiserEntityId;
  final String? scopeFeatureId;
  final String? scopeLevelKindId;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;

  factory EventEvents.fromJson(Map<String, dynamic> json) => _$EventEventsFromJson(json);

  Map<String, dynamic> toJson() => _$EventEventsToJson(this);
}
