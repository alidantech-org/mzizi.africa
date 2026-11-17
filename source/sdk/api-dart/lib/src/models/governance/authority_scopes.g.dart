// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'authority_scopes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceAuthorityScopes _$GovernanceAuthorityScopesFromJson(Map<String, dynamic> json) => GovernanceAuthorityScopes(
  authorityKindId: json['authorityKindId'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  officeId: json['officeId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  unitFeatureId: json['unitFeatureId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceAuthorityScopesToJson(GovernanceAuthorityScopes instance) => <String, dynamic>{
  'authorityKindId': instance.authorityKindId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'officeId': ?instance.officeId,
  'sourceCitationId': ?instance.sourceCitationId,
  'unitFeatureId': instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
