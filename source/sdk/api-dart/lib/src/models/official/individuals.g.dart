// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'individuals.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialIndividuals _$OfficialIndividualsFromJson(Map<String, dynamic> json) => OfficialIndividuals(
  birthDate: json['birthDate'] == null ? null : DateTime.parse(json['birthDate'] as String),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deathDate: json['deathDate'] == null ? null : DateTime.parse(json['deathDate'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialIndividualsToJson(OfficialIndividuals instance) => <String, dynamic>{
  'birthDate': ?instance.birthDate?.toIso8601String(),
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deathDate': ?instance.deathDate?.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
