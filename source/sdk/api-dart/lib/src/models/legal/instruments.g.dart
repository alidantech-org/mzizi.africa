// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'instruments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalInstruments _$LegalInstrumentsFromJson(Map<String, dynamic> json) => LegalInstruments(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  enactedOn: json['enactedOn'] == null ? null : DateTime.parse(json['enactedOn'] as String),
  id: json['id'] as String,
  issuingEntityId: json['issuingEntityId'] as String?,
  issuingUnitId: json['issuingUnitId'] as String?,
  kindId: json['kindId'] as String,
  publishedOn: json['publishedOn'] == null ? null : DateTime.parse(json['publishedOn'] as String),
  statusId: json['statusId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalInstrumentsToJson(LegalInstruments instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'enactedOn': ?instance.enactedOn?.toIso8601String(),
  'id': instance.id,
  'issuingEntityId': ?instance.issuingEntityId,
  'issuingUnitId': ?instance.issuingUnitId,
  'kindId': instance.kindId,
  'publishedOn': ?instance.publishedOn?.toIso8601String(),
  'statusId': ?instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
