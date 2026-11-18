import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'venues.g.dart';

/// One place an occurrence happens at. An occurrence can have many: a national election covers every county and polling place.
@JsonSerializable(includeIfNull: false)
class EventVenues {
  const EventVenues({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    this.note,
    required this.occurrenceId,
    required this.roleId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final String? note;
  final String occurrenceId;
  final String roleId;
  final DateTime updatedAt;
  final int version;

  factory EventVenues.fromJson(Map<String, dynamic> json) => _$EventVenuesFromJson(json);

  Map<String, dynamic> toJson() => _$EventVenuesToJson(this);
}
