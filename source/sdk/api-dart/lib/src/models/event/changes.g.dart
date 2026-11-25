// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'changes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventChanges _$EventChangesFromJson(Map<String, dynamic> json) => EventChanges(
  authorityId: json['authorityId'] as String?,
  basisProvisionId: json['basisProvisionId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  decidedOn: json['decidedOn'] == null ? null : DateTime.parse(json['decidedOn'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromOn: json['fromOn'] == null ? null : DateTime.parse(json['fromOn'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  occurrenceId: json['occurrenceId'] as String,
  reasonTerm: json['reasonTerm'] as String?,
  replacementOccurrenceId: json['replacementOccurrenceId'] as String?,
  toOn: json['toOn'] == null ? null : DateTime.parse(json['toOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventChangesToJson(EventChanges instance) => <String, dynamic>{
  'authorityId': ?instance.authorityId,
  'basisProvisionId': ?instance.basisProvisionId,
  'createdAt': instance.createdAt.toIso8601String(),
  'decidedOn': ?instance.decidedOn?.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromOn': ?instance.fromOn?.toIso8601String(),
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'occurrenceId': instance.occurrenceId,
  'reasonTerm': ?instance.reasonTerm,
  'replacementOccurrenceId': ?instance.replacementOccurrenceId,
  'toOn': ?instance.toOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
