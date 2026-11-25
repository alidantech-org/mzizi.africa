import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/shared/association.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'participants.g.dart';

/// Who took part in an occurrence.
@JsonSerializable(includeIfNull: false)
class EventParticipants {
  const EventParticipants({
    required this.createdAt,
    this.deletedAt,
    required this.id,
    required this.identityId,
    required this.occurrenceId,
    required this.roleTerm,
  });
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String id;
  final String identityId;
  final String occurrenceId;
  final String roleTerm;

  factory EventParticipants.fromJson(Map<String, dynamic> json) => _$EventParticipantsFromJson(json);

  Map<String, dynamic> toJson() => _$EventParticipantsToJson(this);
}
