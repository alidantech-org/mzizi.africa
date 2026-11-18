// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'projects.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProjects _$CivicProjectsFromJson(Map<String, dynamic> json) => CivicProjects(
  code: json['code'] as String,
  completedOn: json['completedOn'] == null ? null : DateTime.parse(json['completedOn'] as String),
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String,
  id: json['id'] as String,
  implementingEntityId: json['implementingEntityId'] as String?,
  location: json['location'],
  name: json['name'] as String,
  responsibleInstitutionId: json['responsibleInstitutionId'] as String?,
  scopeUnitFeatureId: json['scopeUnitFeatureId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  sponsorEntityId: json['sponsorEntityId'] as String?,
  startedOn: json['startedOn'] == null ? null : DateTime.parse(json['startedOn'] as String),
  statusId: json['statusId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicProjectsToJson(CivicProjects instance) => <String, dynamic>{
  'code': instance.code,
  'completedOn': ?instance.completedOn?.toIso8601String(),
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': instance.description,
  'id': instance.id,
  'implementingEntityId': ?instance.implementingEntityId,
  'location': ?instance.location,
  'name': instance.name,
  'responsibleInstitutionId': ?instance.responsibleInstitutionId,
  'scopeUnitFeatureId': ?instance.scopeUnitFeatureId,
  'sourceCitationId': ?instance.sourceCitationId,
  'sponsorEntityId': ?instance.sponsorEntityId,
  'startedOn': ?instance.startedOn?.toIso8601String(),
  'statusId': instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
