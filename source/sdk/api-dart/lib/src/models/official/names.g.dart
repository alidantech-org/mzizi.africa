// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'names.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialNames _$OfficialNamesFromJson(Map<String, dynamic> json) => OfficialNames(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  entityId: json['entityId'] as String?,
  id: json['id'] as String,
  individualId: json['individualId'] as String?,
  isPreferred: json['isPreferred'] as bool,
  languageId: json['languageId'] as String,
  name: json['name'] as String,
  nameKindId: json['nameKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialNamesToJson(OfficialNames instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'entityId': ?instance.entityId,
  'id': instance.id,
  'individualId': ?instance.individualId,
  'isPreferred': instance.isPreferred,
  'languageId': instance.languageId,
  'name': instance.name,
  'nameKindId': instance.nameKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'version': instance.version,
};
