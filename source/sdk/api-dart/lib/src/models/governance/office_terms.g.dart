// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'office_terms.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceOfficeTerms _$GovernanceOfficeTermsFromJson(Map<String, dynamic> json) => GovernanceOfficeTerms(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  featureId: json['featureId'] as String?,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String?,
  kindTerm: json['kindTerm'] as String,
  officeId: json['officeId'] as String?,
  ordinal: (json['ordinal'] as num?)?.toInt(),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceOfficeTermsToJson(GovernanceOfficeTerms instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'featureId': ?instance.featureId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'institutionId': ?instance.institutionId,
  'kindTerm': instance.kindTerm,
  'officeId': ?instance.officeId,
  'ordinal': ?instance.ordinal,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
