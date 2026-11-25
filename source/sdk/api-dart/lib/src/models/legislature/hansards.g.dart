// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'hansards.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureHansards _$LegislatureHansardsFromJson(Map<String, dynamic> json) => LegislatureHansards(
  artifactId: json['artifactId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  reference: json['reference'] as String?,
  sittingId: json['sittingId'] as String,
  status: $enumDecode(_$LegislatureHansardStatusEnumMap, json['status']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureHansardsToJson(LegislatureHansards instance) => <String, dynamic>{
  'artifactId': ?instance.artifactId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'reference': ?instance.reference,
  'sittingId': instance.sittingId,
  'status': _$LegislatureHansardStatusEnumMap[instance.status]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$LegislatureHansardStatusEnumMap = {LegislatureHansardStatus.finalValue: 'final', LegislatureHansardStatus.provisional: 'provisional'};
