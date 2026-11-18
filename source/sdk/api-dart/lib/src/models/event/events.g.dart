// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'events.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventEvents _$EventEventsFromJson(Map<String, dynamic> json) => EventEvents(
  basisProvisionId: json['basisProvisionId'] as String?,
  calendarId: json['calendarId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventKindId: json['eventKindId'] as String,
  id: json['id'] as String,
  organiserEntityId: json['organiserEntityId'] as String?,
  scopeFeatureId: json['scopeFeatureId'] as String?,
  scopeLevelKindId: json['scopeLevelKindId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventEventsToJson(EventEvents instance) => <String, dynamic>{
  'basisProvisionId': ?instance.basisProvisionId,
  'calendarId': ?instance.calendarId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventKindId': instance.eventKindId,
  'id': instance.id,
  'organiserEntityId': ?instance.organiserEntityId,
  'scopeFeatureId': ?instance.scopeFeatureId,
  'scopeLevelKindId': ?instance.scopeLevelKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
