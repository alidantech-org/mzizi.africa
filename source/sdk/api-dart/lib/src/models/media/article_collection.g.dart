// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'article_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaArticleCollection _$MediaArticleCollectionFromJson(Map<String, dynamic> json) => MediaArticleCollection(
  articles: (json['articles'] as List<dynamic>).map((e) => MediaArticleEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$MediaArticleCollectionToJson(MediaArticleCollection instance) => <String, dynamic>{'articles': instance.articles};
