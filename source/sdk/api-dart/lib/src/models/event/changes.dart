import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/official/entities.dart';
import 'package:mzizi_api/src/models/reference/value.dart';
import 'package:mzizi_api/src/models/shared/coded_entity.dart';
import 'package:mzizi_api/src/models/source/citations.dart';

part 'changes.g.dart';

/// One reschedule, postponement, adjournment, cancellation or confirmation of an occurrence, with the reason, who decided it and under which law. History is the list of changes.
@JsonSerializable(includeIfNull: false)
class EventChanges {
  const EventChanges({
    this.authorityEntityId,
    this.basisProvisionId,
    required this.changeKindId,
    required this.code,
    required this.createdAt,
    this.decidedOn,
    this.deletedAt,
    this.explanation,
    this.fromOn,
    required this.id,
    required this.occurrenceId,
    this.reasonId,
    this.replacementOccurrenceId,
    this.sourceCitationId,
    this.toOn,
    required this.updatedAt,
    required this.version,
  });
  final String? authorityEntityId;
  final String? basisProvisionId;
  final String changeKindId;
  final String code;
  final DateTime createdAt;
  final DateTime? decidedOn;
  final DateTime? deletedAt;
  final String? explanation;
  final DateTime? fromOn;
  final String id;
  final String occurrenceId;
  final String? reasonId;
  final String? replacementOccurrenceId;
  final String? sourceCitationId;
  final DateTime? toOn;
  final DateTime updatedAt;
  final int version;

  factory EventChanges.fromJson(Map<String, dynamic> json) => _$EventChangesFromJson(json);

  Map<String, dynamic> toJson() => _$EventChangesToJson(this);
}
