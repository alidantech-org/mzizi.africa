import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/enums/shared/subject_table.dart';
import 'package:mzizi_api/src/models/event/events.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_subject_entity.dart';

part 'subjects.g.dart';

/// What an event is about or belongs to: an election, an institution, a person, a facility, a bill. An election's registration and nomination dates are events attached to it here.
@JsonSerializable(includeIfNull: false)
class EventSubjects {
  const EventSubjects({
    required this.code,
    required this.createdAt,
    this.deletedAt,
    required this.eventId,
    required this.id,
    required this.roleId,
    required this.subjectId,
    required this.subjectTable,
    required this.updatedAt,
    required this.version,
  });
  final String code;
  final DateTime createdAt;
  final DateTime? deletedAt;
  final String eventId;
  final String id;
  final String roleId;
  final String subjectId;
  final SharedSubjectTable subjectTable;
  final DateTime updatedAt;
  final int version;

  factory EventSubjects.fromJson(Map<String, dynamic> json) => _$EventSubjectsFromJson(json);

  Map<String, dynamic> toJson() => _$EventSubjectsToJson(this);
}
