// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instances.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceInstances _$GovernanceInstancesFromJson(Map<String, dynamic> json) => GovernanceInstances(
  contactId: json['contactId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  domainId: json['domainId'] as String?,
  generatedAt: DateTime.parse(json['generatedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  officeId: json['officeId'] as String?,
  positionId: json['positionId'] as String?,
  statusTerm: json['statusTerm'] as String,
  templateId: json['templateId'] as String,
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceInstancesToJson(GovernanceInstances instance) => <String, dynamic>{
  'contactId': ?instance.contactId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'domainId': ?instance.domainId,
  'generatedAt': instance.generatedAt.toIso8601String(),
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'officeId': ?instance.officeId,
  'positionId': ?instance.positionId,
  'statusTerm': instance.statusTerm,
  'templateId': instance.templateId,
  'unitFeatureId': ?instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
