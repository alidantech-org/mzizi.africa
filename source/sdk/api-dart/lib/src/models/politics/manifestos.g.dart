// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'manifestos.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsManifestos _$PoliticsManifestosFromJson(Map<String, dynamic> json) => PoliticsManifestos(
  artifactId: json['artifactId'] as String?,
  candidateId: json['candidateId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  electionId: json['electionId'] as String?,
  id: json['id'] as String,
  partyId: json['partyId'] as String?,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsManifestosToJson(PoliticsManifestos instance) => <String, dynamic>{
  'artifactId': ?instance.artifactId,
  'candidateId': ?instance.candidateId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'electionId': ?instance.electionId,
  'id': instance.id,
  'partyId': ?instance.partyId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
