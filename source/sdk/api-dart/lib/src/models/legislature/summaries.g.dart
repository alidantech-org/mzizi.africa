// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'summaries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureSummaries _$LegislatureSummariesFromJson(Map<String, dynamic> json) => LegislatureSummaries(
  agendaId: json['agendaId'] as String?,
  billId: json['billId'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  motionId: json['motionId'] as String?,
  origin: $enumDecode(_$LegislatureTextOriginEnumMap, json['origin']),
  speechId: json['speechId'] as String?,
  status: $enumDecode(_$LegislatureTextStatusEnumMap, json['status']),
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureSummariesToJson(LegislatureSummaries instance) => <String, dynamic>{
  'agendaId': ?instance.agendaId,
  'billId': ?instance.billId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'motionId': ?instance.motionId,
  'origin': _$LegislatureTextOriginEnumMap[instance.origin]!,
  'speechId': ?instance.speechId,
  'status': _$LegislatureTextStatusEnumMap[instance.status]!,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$LegislatureTextOriginEnumMap = {
  LegislatureTextOrigin.human: 'human',
  LegislatureTextOrigin.machine: 'machine',
  LegislatureTextOrigin.original: 'original',
};

const _$LegislatureTextStatusEnumMap = {
  LegislatureTextStatus.draft: 'draft',
  LegislatureTextStatus.published: 'published',
  LegislatureTextStatus.reviewed: 'reviewed',
};
