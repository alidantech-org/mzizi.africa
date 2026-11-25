// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sittings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureSittings _$LegislatureSittingsFromJson(Map<String, dynamic> json) => LegislatureSittings(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  kindTerm: json['kindTerm'] as String,
  occurrenceId: json['occurrenceId'] as String?,
  sequence: (json['sequence'] as num?)?.toInt(),
  session: json['session'] as String?,
  termId: json['termId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureSittingsToJson(LegislatureSittings instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'institutionId': instance.institutionId,
  'kindTerm': instance.kindTerm,
  'occurrenceId': ?instance.occurrenceId,
  'sequence': ?instance.sequence,
  'session': ?instance.session,
  'termId': ?instance.termId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
