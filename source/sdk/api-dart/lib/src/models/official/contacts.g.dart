// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contacts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialContacts _$OfficialContactsFromJson(Map<String, dynamic> json) => OfficialContacts(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  entityId: json['entityId'] as String?,
  id: json['id'] as String,
  individualId: json['individualId'] as String?,
  kindId: json['kindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  value: json['value'] as String,
  version: (json['version'] as num).toInt(),
  visibilityId: json['visibilityId'] as String,
);

Map<String, dynamic> _$OfficialContactsToJson(OfficialContacts instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'entityId': ?instance.entityId,
  'id': instance.id,
  'individualId': ?instance.individualId,
  'kindId': instance.kindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'value': instance.value,
  'version': instance.version,
  'visibilityId': instance.visibilityId,
};
