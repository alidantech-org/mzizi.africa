import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/event/schedules.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'items.g.dart';

/// One line of a schedule: an event placed at an offset from the anchor, and the occurrence it became.
@JsonSerializable(includeIfNull: false)
class EventItems {
  const EventItems({
    required this.countsWorkingDays,
    required this.createdAt,
    this.deletedAt,
    required this.eventId,
    required this.id,
    this.note,
    this.occurrenceId,
    this.offsetDays,
    required this.position,
    required this.scheduleId,
    required this.updatedAt,
    required this.version,
  });
  final bool countsWorkingDays;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String id;
  final String? note;
  final String? occurrenceId;
  final int? offsetDays;
  final int position;
  final String scheduleId;
  final DateTime updatedAt;
  final int version;

  factory EventItems.fromJson(Map<String, dynamic> json) => _$EventItemsFromJson(json);

  Map<String, dynamic> toJson() => _$EventItemsToJson(this);
}
