import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/country.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'calendars.g.dart';

/// A way of counting time that gives events their dates: the civil calendar, a lunar calendar, a fiscal or school year.
@JsonSerializable(includeIfNull: false)
class EventCalendars {
  const EventCalendars({
    required this.calendarKindId,
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    this.description,
    required this.id,
    required this.isObserved,
    this.sourceCitationId,
    required this.updatedAt,
    required this.version,
    this.yearStartDay,
    this.yearStartMonth,
  });
  final String calendarKindId;
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? description;
  final String id;
  final bool isObserved;
  final String? sourceCitationId;
  final DateTime updatedAt;
  final int version;
  final int? yearStartDay;
  final int? yearStartMonth;

  factory EventCalendars.fromJson(Map<String, dynamic> json) => _$EventCalendarsFromJson(json);

  Map<String, dynamic> toJson() => _$EventCalendarsToJson(this);
}
