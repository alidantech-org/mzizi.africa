// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subjects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventSubjects _$EventSubjectsFromJson(Map<String, dynamic> json) => EventSubjects(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventId: json['eventId'] as String,
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  roleTerm: json['roleTerm'] as String,
);

Map<String, dynamic> _$EventSubjectsToJson(EventSubjects instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventId': instance.eventId,
  'id': instance.id,
  'identityId': instance.identityId,
  'roleTerm': instance.roleTerm,
};
