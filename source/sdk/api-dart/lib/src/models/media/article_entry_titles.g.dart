// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'article_entry_titles.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaArticleEntryTitles _$MediaArticleEntryTitlesFromJson(Map<String, dynamic> json) => MediaArticleEntryTitles(
  languageCode: json['languageCode'] as String,
  origin: $enumDecode(_$MediaTextOriginEnumMap, json['origin']),
  status: $enumDecode(_$MediaTextStatusEnumMap, json['status']),
  summary: json['summary'] as String?,
  title: json['title'] as String,
);

Map<String, dynamic> _$MediaArticleEntryTitlesToJson(MediaArticleEntryTitles instance) => <String, dynamic>{
  'languageCode': instance.languageCode,
  'origin': _$MediaTextOriginEnumMap[instance.origin]!,
  'status': _$MediaTextStatusEnumMap[instance.status]!,
  'summary': ?instance.summary,
  'title': instance.title,
};

const _$MediaTextOriginEnumMap = {MediaTextOrigin.human: 'human', MediaTextOrigin.machine: 'machine', MediaTextOrigin.original: 'original'};

const _$MediaTextStatusEnumMap = {MediaTextStatus.draft: 'draft', MediaTextStatus.published: 'published', MediaTextStatus.reviewed: 'reviewed'};
