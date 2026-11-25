// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'participants.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventParticipants _$EventParticipantsFromJson(Map<String, dynamic> json) => EventParticipants(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  occurrenceId: json['occurrenceId'] as String,
  roleTerm: json['roleTerm'] as String,
);

Map<String, dynamic> _$EventParticipantsToJson(EventParticipants instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': instance.identityId,
  'occurrenceId': instance.occurrenceId,
  'roleTerm': instance.roleTerm,
};
