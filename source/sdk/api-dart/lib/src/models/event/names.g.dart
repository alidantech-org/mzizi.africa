// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventNames _$EventNamesFromJson(Map<String, dynamic> json) => EventNames(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  eventId: json['eventId'] as String,
  id: json['id'] as String,
  isPreferred: json['isPreferred'] as bool,
  languageId: json['languageId'] as String,
  name: json['name'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventNamesToJson(EventNames instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'eventId': instance.eventId,
  'id': instance.id,
  'isPreferred': instance.isPreferred,
  'languageId': instance.languageId,
  'name': instance.name,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
