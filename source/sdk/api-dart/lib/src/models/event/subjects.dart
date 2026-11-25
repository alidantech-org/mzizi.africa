import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'subjects.g.dart';

/// What an event is about.
@JsonSerializable(includeIfNull: false)
class EventSubjects {
  const EventSubjects({
    required this.createdAt,
    this.deletedAt,
    required this.eventId,
    required this.id,
    required this.identityId,
    required this.roleTerm,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String id;
  final String identityId;
  final String roleTerm;

  factory EventSubjects.fromJson(Map<String, dynamic> json) => _$EventSubjectsFromJson(json);

  Map<String, dynamic> toJson() => _$EventSubjectsToJson(this);
}
