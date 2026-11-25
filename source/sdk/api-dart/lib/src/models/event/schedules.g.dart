// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'schedules.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventSchedules _$EventSchedulesFromJson(Map<String, dynamic> json) => EventSchedules(
  anchorEventId: json['anchorEventId'] as String?,
  anchorOn: json['anchorOn'] == null ? null : DateTime.parse(json['anchorOn'] as String),
  basisProvisionId: json['basisProvisionId'] as String?,
  code: json['code'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  issuerId: json['issuerId'] as String?,
  kindTerm: json['kindTerm'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  statusTerm: json['statusTerm'] as String,
  supersedesScheduleId: json['supersedesScheduleId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventSchedulesToJson(EventSchedules instance) => <String, dynamic>{
  'anchorEventId': ?instance.anchorEventId,
  'anchorOn': ?instance.anchorOn?.toIso8601String(),
  'basisProvisionId': ?instance.basisProvisionId,
  'code': instance.code,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'issuerId': ?instance.issuerId,
  'kindTerm': instance.kindTerm,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'supersedesScheduleId': ?instance.supersedesScheduleId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
