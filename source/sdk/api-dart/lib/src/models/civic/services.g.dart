// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'services.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicServices _$CivicServicesFromJson(Map<String, dynamic> json) => CivicServices(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  description: json['description'] as String,
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  id: json['id'] as String,
  name: json['name'] as String,
  placeFeatureId: json['placeFeatureId'] as String?,
  providerEntityId: json['providerEntityId'] as String,
  responsibleInstitutionId: json['responsibleInstitutionId'] as String?,
  scopeUnitFeatureId: json['scopeUnitFeatureId'] as String?,
  serviceKindId: json['serviceKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicServicesToJson(CivicServices instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'description': instance.description,
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'id': instance.id,
  'name': instance.name,
  'placeFeatureId': ?instance.placeFeatureId,
  'providerEntityId': instance.providerEntityId,
  'responsibleInstitutionId': ?instance.responsibleInstitutionId,
  'scopeUnitFeatureId': ?instance.scopeUnitFeatureId,
  'serviceKindId': instance.serviceKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
