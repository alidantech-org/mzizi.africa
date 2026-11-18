import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'schedules.g.dart';

/// A published plan of dated items: an election timetable, a school year, a parliamentary calendar. Items are placed by offset from an anchor, so moving the anchor moves the plan.
@JsonSerializable(includeIfNull: false)
class EventSchedules {
  const EventSchedules({
    this.anchorEventId,
    this.anchorOn,
    this.basisProvisionId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    this.issuerEntityId,
    this.publishedOn,
    required this.scheduleKindId,
    this.sourceCitationId,
    required this.statusId,
    this.supersedesScheduleId,
    required this.updatedAt,
    required this.version,
  });
  final String? anchorEventId;
  final DateTime? anchorOn;
  final String? basisProvisionId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String? issuerEntityId;
  final DateTime? publishedOn;
  final String scheduleKindId;
  final String? sourceCitationId;
  final String statusId;
  final String? supersedesScheduleId;
  final DateTime updatedAt;
  final int version;

  factory EventSchedules.fromJson(Map<String, dynamic> json) => _$EventSchedulesFromJson(json);

  Map<String, dynamic> toJson() => _$EventSchedulesToJson(this);
}
