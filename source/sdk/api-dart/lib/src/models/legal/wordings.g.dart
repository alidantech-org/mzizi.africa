// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'wordings.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegalWordings _$LegalWordingsFromJson(Map<String, dynamic> json) => LegalWordings(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  editionId: json['editionId'] as String,
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  heading: json['heading'] as String?,
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  provisionId: json['provisionId'] as String,
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  supersedesId: json['supersedesId'] as String?,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegalWordingsToJson(LegalWordings instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'editionId': instance.editionId,
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'heading': ?instance.heading,
  'id': instance.id,
  'languageId': instance.languageId,
  'provisionId': instance.provisionId,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'supersedesId': ?instance.supersedesId,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
