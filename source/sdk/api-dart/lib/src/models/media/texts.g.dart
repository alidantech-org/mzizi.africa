// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'texts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaTexts _$MediaTextsFromJson(Map<String, dynamic> json) => MediaTexts(
  articleId: json['articleId'] as String,
  body: json['body'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  origin: $enumDecode(_$MediaTextOriginEnumMap, json['origin']),
  status: $enumDecode(_$MediaTextStatusEnumMap, json['status']),
  summary: json['summary'] as String?,
  title: json['title'] as String,
  translatedFromId: json['translatedFromId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$MediaTextsToJson(MediaTexts instance) => <String, dynamic>{
  'articleId': instance.articleId,
  'body': instance.body,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'origin': _$MediaTextOriginEnumMap[instance.origin]!,
  'status': _$MediaTextStatusEnumMap[instance.status]!,
  'summary': ?instance.summary,
  'title': instance.title,
  'translatedFromId': ?instance.translatedFromId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$MediaTextOriginEnumMap = {MediaTextOrigin.human: 'human', MediaTextOrigin.machine: 'machine', MediaTextOrigin.original: 'original'};

const _$MediaTextStatusEnumMap = {MediaTextStatus.draft: 'draft', MediaTextStatus.published: 'published', MediaTextStatus.reviewed: 'reviewed'};
