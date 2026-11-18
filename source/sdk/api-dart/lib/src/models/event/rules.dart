import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/date_precision.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/period_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'rules.g.dart';

/// How the dates of an event are produced, with the adjustment the law applies when a date falls on a rest day. Occurrences generated from a rule are projected until announced.
@JsonSerializable(includeIfNull: false)
class EventRules {
  const EventRules({
    this.adjustmentId,
    this.anchorOn,
    required this.createdAt,
    this.dayOfMonth,
    this.deletedAt,
    required this.eventId,
    this.fromToPrecision,
    this.fromYear,
    required this.id,
    this.intervalYears,
    this.month,
    this.nthWeekday,
    this.rrule,
    required this.ruleKindId,
    this.sourceCitationId,
    this.toYear,
    required this.updatedAt,
    required this.version,
    this.weekday,
  });
  final String? adjustmentId;
  final DateTime? anchorOn;
  final DateTime createdAt;
  final int? dayOfMonth;
  final DateTime? deletedAt;
  final String eventId;
  final SharedDatePrecision? fromToPrecision;
  final int? fromYear;
  final String id;
  final int? intervalYears;
  final int? month;
  final int? nthWeekday;
  final String? rrule;
  final String ruleKindId;
  final String? sourceCitationId;
  final int? toYear;
  final DateTime updatedAt;
  final int version;
  final int? weekday;

  factory EventRules.fromJson(Map<String, dynamic> json) => _$EventRulesFromJson(json);

  Map<String, dynamic> toJson() => _$EventRulesToJson(this);
}
