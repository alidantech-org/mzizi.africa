import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/shared/page_window.dart';

part 'calendar_window.g.dart';

/// Calendar Window
@JsonSerializable(includeIfNull: false)
class EventCalendarWindow {
  const EventCalendarWindow({required this.countryId, required this.from, this.limit, this.offset});
  final String countryId;
  final DateTime from;
  final int? limit;
  final int? offset;

  factory EventCalendarWindow.fromJson(Map<String, dynamic> json) => _$EventCalendarWindowFromJson(json);

  Map<String, dynamic> toJson() => _$EventCalendarWindowToJson(this);
}
