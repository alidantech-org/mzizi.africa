// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hansards.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceHansards _$GovernanceHansardsFromJson(Map<String, dynamic> json) => GovernanceHansards(
  artifactId: json['artifactId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  isProvisional: json['isProvisional'] as bool,
  languageId: json['languageId'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  reference: json['reference'] as String?,
  sittingId: json['sittingId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceHansardsToJson(GovernanceHansards instance) => <String, dynamic>{
  'artifactId': instance.artifactId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'isProvisional': instance.isProvisional,
  'languageId': instance.languageId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'reference': ?instance.reference,
  'sittingId': instance.sittingId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
