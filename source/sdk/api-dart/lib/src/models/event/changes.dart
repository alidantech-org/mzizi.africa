import 'package:json_annotation/json_annotation.dart';
import 'package:mzizi_api/src/models/event/occurrences.dart';
import 'package:mzizi_api/src/models/identity/identities.dart';
import 'package:mzizi_api/src/models/legal/provisions.dart';
import 'package:mzizi_api/src/models/reference/languages.dart';
import 'package:mzizi_api/src/models/shared/entity.dart';
import 'package:mzizi_api/src/models/vocabulary/terms.dart';

part 'changes.g.dart';

/// A postponement, cancellation or move of an occurrence.
@JsonSerializable(includeIfNull: false)
class EventChanges {
  const EventChanges({
    this.authorityId,
    this.basisProvisionId,
    required this.createdAt,
    this.decidedOn,
    this.deletedAt,
    this.fromOn,
    required this.id,
    required this.kindTerm,
    this.note,
    this.noteLanguageId,
    required this.occurrenceId,
    this.reasonTerm,
    this.replacementOccurrenceId,
    this.toOn,
    required this.updatedAt,
    required this.version,
  });
  final String? authorityId;
  final String? basisProvisionId;
  final DateTime createdAt;
  final DateTime? decidedOn;
  final DateTime? deletedAt;
  final DateTime? fromOn;
  final String id;
  final String kindTerm;
  final String? note;
  final String? noteLanguageId;
  final String occurrenceId;
  final String? reasonTerm;
  final String? replacementOccurrenceId;
  final DateTime? toOn;
  final DateTime updatedAt;
  final int version;

  factory EventChanges.fromJson(Map<String, dynamic> json) => _$EventChangesFromJson(json);

  Map<String, dynamic> toJson() => _$EventChangesToJson(this);
}
