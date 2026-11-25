// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'article_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaArticleEntry _$MediaArticleEntryFromJson(Map<String, dynamic> json) => MediaArticleEntry(
  articleId: json['articleId'] as String,
  categoryTerm: json['categoryTerm'] as String,
  code: json['code'] as String,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  titles: (json['titles'] as List<dynamic>).map((e) => MediaArticleEntryTitles.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$MediaArticleEntryToJson(MediaArticleEntry instance) => <String, dynamic>{
  'articleId': instance.articleId,
  'categoryTerm': instance.categoryTerm,
  'code': instance.code,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'titles': instance.titles,
};
