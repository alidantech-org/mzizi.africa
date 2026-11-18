// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'changes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventChanges _$EventChangesFromJson(Map<String, dynamic> json) => EventChanges(
  authorityEntityId: json['authorityEntityId'] as String?,
  basisProvisionId: json['basisProvisionId'] as String?,
  changeKindId: json['changeKindId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  decidedOn: json['decidedOn'] == null ? null : DateTime.parse(json['decidedOn'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  explanation: json['explanation'] as String?,
  fromOn: json['fromOn'] == null ? null : DateTime.parse(json['fromOn'] as String),
  id: json['id'] as String,
  occurrenceId: json['occurrenceId'] as String,
  reasonId: json['reasonId'] as String?,
  replacementOccurrenceId: json['replacementOccurrenceId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  toOn: json['toOn'] == null ? null : DateTime.parse(json['toOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventChangesToJson(EventChanges instance) => <String, dynamic>{
  'authorityEntityId': ?instance.authorityEntityId,
  'basisProvisionId': ?instance.basisProvisionId,
  'changeKindId': instance.changeKindId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'decidedOn': ?instance.decidedOn?.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'explanation': ?instance.explanation,
  'fromOn': ?instance.fromOn?.toIso8601String(),
  'id': instance.id,
  'occurrenceId': instance.occurrenceId,
  'reasonId': ?instance.reasonId,
  'replacementOccurrenceId': ?instance.replacementOccurrenceId,
  'sourceCitationId': ?instance.sourceCitationId,
  'toOn': ?instance.toOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
