// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'changes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyChanges _$GeographyChangesFromJson(Map<String, dynamic> json) => GeographyChanges(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveOn: json['effectiveOn'] == null ? null : DateTime.parse(json['effectiveOn'] as String),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  occurrenceId: json['occurrenceId'] as String?,
  predecessorFeatureId: json['predecessorFeatureId'] as String?,
  successorFeatureId: json['successorFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyChangesToJson(GeographyChanges instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveOn': ?instance.effectiveOn?.toIso8601String(),
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'occurrenceId': ?instance.occurrenceId,
  'predecessorFeatureId': ?instance.predecessorFeatureId,
  'successorFeatureId': ?instance.successorFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
