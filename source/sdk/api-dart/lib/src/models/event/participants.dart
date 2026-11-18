import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/official/individuals.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';

part 'participants.g.dart';

/// One organisation or person taking part in one occurrence in a role.
@JsonSerializable(includeIfNull: false)
class EventParticipants {
  const EventParticipants({
    required this.createdAt,
    this.deletedAt,
    this.entityId,
    required this.id,
    this.individualId,
    required this.occurrenceId,
    required this.roleId,
    required this.updatedAt,
    required this.version,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String? entityId;
  final String id;
  final String? individualId;
  final String occurrenceId;
  final String roleId;
  final DateTime updatedAt;
  final int version;

  factory EventParticipants.fromJson(Map<String, dynamic> json) => _$EventParticipantsFromJson(json);

  Map<String, dynamic> toJson() => _$EventParticipantsToJson(this);
}
