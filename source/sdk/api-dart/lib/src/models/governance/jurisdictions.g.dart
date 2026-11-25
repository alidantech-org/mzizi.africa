// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'jurisdictions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceJurisdictions _$GovernanceJurisdictionsFromJson(Map<String, dynamic> json) => GovernanceJurisdictions(
  code: json['code'] as String,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  featureId: json['featureId'] as String?,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  kindTerm: json['kindTerm'] as String,
  officeId: json['officeId'] as String?,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceJurisdictionsToJson(GovernanceJurisdictions instance) => <String, dynamic>{
  'code': instance.code,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'featureId': ?instance.featureId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'kindTerm': instance.kindTerm,
  'officeId': ?instance.officeId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
