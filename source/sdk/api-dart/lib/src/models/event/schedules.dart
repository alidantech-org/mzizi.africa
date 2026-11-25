import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'schedules.g.dart';

/// A published timetable of steps counted from an anchor (an election timetable).
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
    this.issuerId,
    required this.kindTerm,
    this.publishedOn,
    required this.statusTerm,
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
  final String? issuerId;
  final String kindTerm;
  final DateTime? publishedOn;
  final String statusTerm;
  final String? supersedesScheduleId;
  final DateTime updatedAt;
  final int version;

  factory EventSchedules.fromJson(Map<String, dynamic> json) => _$EventSchedulesFromJson(json);

  Map<String, dynamic> toJson() => _$EventSchedulesToJson(this);
}
