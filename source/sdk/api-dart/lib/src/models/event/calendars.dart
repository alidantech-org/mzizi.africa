import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/reference/countries.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'calendars.g.dart';

/// A civic calendar, such as Kenya's public holidays or the National Assembly calendar.
@JsonSerializable(includeIfNull: false)
class EventCalendars {
  const EventCalendars({
    required this.code,
    this.countryId,
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.isObserved,
    required this.kindTerm,
    required this.updatedAt,
    required this.version,
    this.yearStartDay,
    this.yearStartMonth,
  });
  final String code;
  final String? countryId;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final bool isObserved;
  final String kindTerm;
  final DateTime updatedAt;
  final int version;
  final int? yearStartDay;
  final int? yearStartMonth;

  factory EventCalendars.fromJson(Map<String, dynamic> json) => _$EventCalendarsFromJson(json);

  Map<String, dynamic> toJson() => _$EventCalendarsToJson(this);
}
