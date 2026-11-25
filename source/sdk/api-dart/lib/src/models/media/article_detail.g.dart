// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'article_detail.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaArticleDetail _$MediaArticleDetailFromJson(Map<String, dynamic> json) => MediaArticleDetail(
  articleId: json['articleId'] as String,
  categoryTerm: json['categoryTerm'] as String,
  code: json['code'] as String,
  identityId: json['identityId'] as String?,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  texts: (json['texts'] as List<dynamic>).map((e) => MediaArticleDetailTexts.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$MediaArticleDetailToJson(MediaArticleDetail instance) => <String, dynamic>{
  'articleId': instance.articleId,
  'categoryTerm': instance.categoryTerm,
  'code': instance.code,
  'identityId': ?instance.identityId,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'texts': instance.texts,
};
