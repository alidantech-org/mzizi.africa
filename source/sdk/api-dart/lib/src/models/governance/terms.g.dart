// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'terms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceTerms _$GovernanceTermsFromJson(Map<String, dynamic> json) => GovernanceTerms(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  ordinal: (json['ordinal'] as num?)?.toInt(),
  sourceCitationId: json['sourceCitationId'] as String?,
  startsOn: DateTime.parse(json['startsOn'] as String),
  termKindId: json['termKindId'] as String,
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceTermsToJson(GovernanceTerms instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'ordinal': ?instance.ordinal,
  'sourceCitationId': ?instance.sourceCitationId,
  'startsOn': instance.startsOn.toIso8601String(),
  'termKindId': instance.termKindId,
  'unitFeatureId': ?instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
