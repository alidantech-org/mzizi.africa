// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identifiers.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialIdentifiers _$OfficialIdentifiersFromJson(Map<String, dynamic> json) => OfficialIdentifiers(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  entityId: json['entityId'] as String?,
  id: json['id'] as String,
  individualId: json['individualId'] as String?,
  issuerEntityId: json['issuerEntityId'] as String?,
  namespace: json['namespace'] as String?,
  schemeId: json['schemeId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  value: json['value'] as String,
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialIdentifiersToJson(OfficialIdentifiers instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'entityId': ?instance.entityId,
  'id': instance.id,
  'individualId': ?instance.individualId,
  'issuerEntityId': ?instance.issuerEntityId,
  'namespace': ?instance.namespace,
  'schemeId': instance.schemeId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'value': instance.value,
  'version': instance.version,
};
