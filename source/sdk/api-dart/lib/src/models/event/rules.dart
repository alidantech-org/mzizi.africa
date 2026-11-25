import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'rules.g.dart';

/// When an event recurs.
@JsonSerializable(includeIfNull: false)
class EventRules {
  const EventRules({
    this.adjustmentTerm,
    this.anchorOn,
    required this.createdAt,
    this.dayOfMonth,
    this.deletedAt,
    required this.eventId,
    this.fromYear,
    required this.id,
    this.intervalYears,
    required this.kindTerm,
    this.month,
    this.nthWeekday,
    this.rrule,
    this.toYear,
    required this.updatedAt,
    required this.version,
    this.weekday,
  });
  final String? adjustmentTerm;
  final DateTime? anchorOn;
  final DateTime createdAt;
  final int? dayOfMonth;
  final DateTime? deletedAt;
  final String eventId;
  final int? fromYear;
  final String id;
  final int? intervalYears;
  final String kindTerm;
  final int? month;
  final int? nthWeekday;
  final String? rrule;
  final int? toYear;
  final DateTime updatedAt;
  final int version;
  final int? weekday;

  factory EventRules.fromJson(Map<String, dynamic> json) => _$EventRulesFromJson(json);

  Map<String, dynamic> toJson() => _$EventRulesToJson(this);
}
