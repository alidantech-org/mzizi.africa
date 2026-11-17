// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'entities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialEntities _$OfficialEntitiesFromJson(Map<String, dynamic> json) => OfficialEntities(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  dissolvedOn: json['dissolvedOn'] == null ? null : DateTime.parse(json['dissolvedOn'] as String),
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  registeredOn: json['registeredOn'] == null ? null : DateTime.parse(json['registeredOn'] as String),
  registrationCountryId: json['registrationCountryId'] as String?,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialEntitiesToJson(OfficialEntities instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'dissolvedOn': ?instance.dissolvedOn?.toIso8601String(),
  'id': instance.id,
  'kindId': instance.kindId,
  'registeredOn': ?instance.registeredOn?.toIso8601String(),
  'registrationCountryId': ?instance.registrationCountryId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
