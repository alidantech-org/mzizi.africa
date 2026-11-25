// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'choices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionChoices _$ElectionChoicesFromJson(Map<String, dynamic> json) => ElectionChoices(
  ballotOrder: (json['ballotOrder'] as num).toInt(),
  code: json['code'] as String,
  contestId: json['contestId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  text: json['text'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionChoicesToJson(ElectionChoices instance) => <String, dynamic>{
  'ballotOrder': instance.ballotOrder,
  'code': instance.code,
  'contestId': instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'text': instance.text,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
