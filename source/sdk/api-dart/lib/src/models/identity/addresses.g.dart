// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'addresses.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

IdentityAddresses _$IdentityAddressesFromJson(Map<String, dynamic> json) => IdentityAddresses(
  canonicalId: json['canonicalId'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  languageId: json['languageId'] as String?,
  parentId: json['parentId'] as String?,
  sectionTerm: json['sectionTerm'] as String?,
  segment: json['segment'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$IdentityAddressesToJson(IdentityAddresses instance) => <String, dynamic>{
  'canonicalId': ?instance.canonicalId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'identityId': instance.identityId,
  'languageId': ?instance.languageId,
  'parentId': ?instance.parentId,
  'sectionTerm': ?instance.sectionTerm,
  'segment': instance.segment,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
