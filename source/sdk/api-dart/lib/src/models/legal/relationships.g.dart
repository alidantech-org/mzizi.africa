// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalRelationships _$LegalRelationshipsFromJson(Map<String, dynamic> json) => LegalRelationships(
  affectedWordingId: json['affectedWordingId'] as String?,
  authorityWordingId: json['authorityWordingId'] as String?,
  citationId: json['citationId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  effectiveOn: json['effectiveOn'] == null ? null : DateTime.parse(json['effectiveOn'] as String),
  explanation: json['explanation'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  objectInstrumentId: json['objectInstrumentId'] as String?,
  resultingWordingId: json['resultingWordingId'] as String?,
  subjectInstrumentId: json['subjectInstrumentId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalRelationshipsToJson(LegalRelationships instance) => <String, dynamic>{
  'affectedWordingId': ?instance.affectedWordingId,
  'authorityWordingId': ?instance.authorityWordingId,
  'citationId': ?instance.citationId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'effectiveOn': ?instance.effectiveOn?.toIso8601String(),
  'explanation': ?instance.explanation,
  'id': instance.id,
  'kindId': instance.kindId,
  'objectInstrumentId': ?instance.objectInstrumentId,
  'resultingWordingId': ?instance.resultingWordingId,
  'subjectInstrumentId': ?instance.subjectInstrumentId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
