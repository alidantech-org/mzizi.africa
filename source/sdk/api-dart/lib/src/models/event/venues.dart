import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/geography/features.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'venues.g.dart';

/// Where an occurrence takes place.
@JsonSerializable(includeIfNull: false)
class EventVenues {
  const EventVenues({
    required this.createdAt,
    this.deletedAt,
    required this.featureId,
    required this.id,
    this.note,
    this.noteLanguageId,
    required this.occurrenceId,
    required this.roleTerm,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String featureId;
  final String id;
  final String? note;
  final String? noteLanguageId;
  final String occurrenceId;
  final String roleTerm;
  final DateTime updatedAt;
  final int version;

  factory EventVenues.fromJson(Map<String, dynamic> json) => _$EventVenuesFromJson(json);

  Map<String, dynamic> toJson() => _$EventVenuesToJson(this);
}
