// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'venues.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventVenues _$EventVenuesFromJson(Map<String, dynamic> json) => EventVenues(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  note: json['note'] as String?,
  noteLanguageId: json['noteLanguageId'] as String?,
  occurrenceId: json['occurrenceId'] as String,
  roleTerm: json['roleTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventVenuesToJson(EventVenues instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': instance.featureId,
  'id': instance.id,
  'note': ?instance.note,
  'noteLanguageId': ?instance.noteLanguageId,
  'occurrenceId': instance.occurrenceId,
  'roleTerm': instance.roleTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
