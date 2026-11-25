// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyRelationships _$GeographyRelationshipsFromJson(Map<String, dynamic> json) => GeographyRelationships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  hierarchyId: json['hierarchyId'] as String?,
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  levelId: json['levelId'] as String?,
  objectFeatureId: json['objectFeatureId'] as String,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  subjectFeatureId: json['subjectFeatureId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyRelationshipsToJson(GeographyRelationships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'hierarchyId': ?instance.hierarchyId,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'levelId': ?instance.levelId,
  'objectFeatureId': instance.objectFeatureId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'subjectFeatureId': instance.subjectFeatureId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
