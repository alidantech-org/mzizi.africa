// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'derivations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceDerivations _$SourceDerivationsFromJson(Map<String, dynamic> json) => SourceDerivations(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  inputArtifactId: json['inputArtifactId'] as String?,
  inputEditionId: json['inputEditionId'] as String?,
  inputVersionId: json['inputVersionId'] as String?,
  kindTerm: json['kindTerm'] as String,
  method: json['method'] as String?,
  outputArtifactId: json['outputArtifactId'] as String?,
  outputEditionId: json['outputEditionId'] as String?,
  outputVersionId: json['outputVersionId'] as String?,
  run: json['run'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceDerivationsToJson(SourceDerivations instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'inputArtifactId': ?instance.inputArtifactId,
  'inputEditionId': ?instance.inputEditionId,
  'inputVersionId': ?instance.inputVersionId,
  'kindTerm': instance.kindTerm,
  'method': ?instance.method,
  'outputArtifactId': ?instance.outputArtifactId,
  'outputEditionId': ?instance.outputEditionId,
  'outputVersionId': ?instance.outputVersionId,
  'run': ?instance.run,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
