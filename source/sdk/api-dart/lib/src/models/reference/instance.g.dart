// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instance.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceInstance _$ReferenceInstanceFromJson(Map<String, dynamic> json) => ReferenceInstance(
  contactId: json['contactId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  domainId: json['domainId'] as String?,
  generatedAt: DateTime.parse(json['generatedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  officeId: json['officeId'] as String?,
  positionId: json['positionId'] as String?,
  statusId: json['statusId'] as String,
  templateId: json['templateId'] as String,
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  verifiedCitationId: json['verifiedCitationId'] as String?,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ReferenceInstanceToJson(ReferenceInstance instance) => <String, dynamic>{
  'contactId': ?instance.contactId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'domainId': ?instance.domainId,
  'generatedAt': instance.generatedAt.toIso8601String(),
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'officeId': ?instance.officeId,
  'positionId': ?instance.positionId,
  'statusId': instance.statusId,
  'templateId': instance.templateId,
  'unitFeatureId': ?instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'verifiedCitationId': ?instance.verifiedCitationId,
  'version': instance.version,
};
