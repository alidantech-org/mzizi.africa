// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'participants.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventParticipants _$EventParticipantsFromJson(Map<String, dynamic> json) => EventParticipants(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  entityId: json['entityId'] as String?,
  id: json['id'] as String,
  individualId: json['individualId'] as String?,
  occurrenceId: json['occurrenceId'] as String,
  roleId: json['roleId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventParticipantsToJson(EventParticipants instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'entityId': ?instance.entityId,
  'id': instance.id,
  'individualId': ?instance.individualId,
  'occurrenceId': instance.occurrenceId,
  'roleId': instance.roleId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
