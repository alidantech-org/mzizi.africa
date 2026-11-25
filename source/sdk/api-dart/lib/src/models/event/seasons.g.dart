// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'seasons.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EventSeasons _$EventSeasonsFromJson(Map<String, dynamic> json) => EventSeasons(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endDay: (json['endDay'] as num?)?.toInt(),
  endMonth: (json['endMonth'] as num).toInt(),
  featureId: json['featureId'] as String?,
  id: json['id'] as String,
  isNatural: json['isNatural'] as bool,
  kindTerm: json['kindTerm'] as String,
  startDay: (json['startDay'] as num?)?.toInt(),
  startMonth: (json['startMonth'] as num).toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EventSeasonsToJson(EventSeasons instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endDay': ?instance.endDay,
  'endMonth': instance.endMonth,
  'featureId': ?instance.featureId,
  'id': instance.id,
  'isNatural': instance.isNatural,
  'kindTerm': instance.kindTerm,
  'startDay': ?instance.startDay,
  'startMonth': instance.startMonth,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
