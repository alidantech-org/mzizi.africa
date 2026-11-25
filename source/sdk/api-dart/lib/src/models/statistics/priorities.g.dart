// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'priorities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsPriorities _$StatisticsPrioritiesFromJson(Map<String, dynamic> json) => StatisticsPriorities(
  collectionId: json['collectionId'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  position: (json['position'] as num).toInt(),
  stewardId: json['stewardId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$StatisticsPrioritiesToJson(StatisticsPriorities instance) => <String, dynamic>{
  'collectionId': ?instance.collectionId,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'position': instance.position,
  'stewardId': ?instance.stewardId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
