// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identifiers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GeographyIdentifiers _$GeographyIdentifiersFromJson(Map<String, dynamic> json) => GeographyIdentifiers(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  externalId: json['externalId'] as String,
  featureId: json['featureId'] as String,
  id: json['id'] as String,
  identifierSchemeId: json['identifierSchemeId'] as String,
  namespace: json['namespace'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GeographyIdentifiersToJson(GeographyIdentifiers instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'externalId': instance.externalId,
  'featureId': instance.featureId,
  'id': instance.id,
  'identifierSchemeId': instance.identifierSchemeId,
  'namespace': ?instance.namespace,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
