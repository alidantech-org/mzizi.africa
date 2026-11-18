import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/reference/language.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'names.g.dart';

/// The name of an event in one language; at most one preferred name per event and language.
@JsonSerializable(includeIfNull: false)
class EventNames {
  const EventNames({
    required this.createdAt,
    this.deletedAt,
    required this.eventId,
    required this.id,
    required this.isPreferred,
    required this.languageId,
    required this.name,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String id;
  final bool isPreferred;
  final String languageId;
  final String name;
  final DateTime updatedAt;
  final int version;

  factory EventNames.fromJson(Map<String, dynamic> json) => _$EventNamesFromJson(json);

  Map<String, dynamic> toJson() => _$EventNamesToJson(this);
}
