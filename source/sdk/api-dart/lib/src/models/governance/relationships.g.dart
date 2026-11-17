// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceRelationships _$GovernanceRelationshipsFromJson(Map<String, dynamic> json) => GovernanceRelationships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  objectInstitutionId: json['objectInstitutionId'] as String,
  relationshipKindId: json['relationshipKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  subjectInstitutionId: json['subjectInstitutionId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceRelationshipsToJson(GovernanceRelationships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'objectInstitutionId': instance.objectInstitutionId,
  'relationshipKindId': instance.relationshipKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'subjectInstitutionId': instance.subjectInstitutionId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'version': instance.version,
};
