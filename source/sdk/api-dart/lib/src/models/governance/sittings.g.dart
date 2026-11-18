// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'sittings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceSittings _$GovernanceSittingsFromJson(Map<String, dynamic> json) => GovernanceSittings(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  occurrenceId: json['occurrenceId'] as String,
  sequenceNumber: (json['sequenceNumber'] as num?)?.toInt(),
  sessionLabel: json['sessionLabel'] as String?,
  sittingKindId: json['sittingKindId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  termId: json['termId'] as String?,
  title: json['title'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceSittingsToJson(GovernanceSittings instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'institutionId': instance.institutionId,
  'occurrenceId': instance.occurrenceId,
  'sequenceNumber': ?instance.sequenceNumber,
  'sessionLabel': ?instance.sessionLabel,
  'sittingKindId': instance.sittingKindId,
  'sourceCitationId': ?instance.sourceCitationId,
  'termId': ?instance.termId,
  'title': instance.title,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
