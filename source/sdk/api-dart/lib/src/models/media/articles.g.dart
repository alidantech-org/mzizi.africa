// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'articles.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

MediaArticles _$MediaArticlesFromJson(Map<String, dynamic> json) => MediaArticles(
  authorId: json['authorId'] as String?,
  categoryTerm: json['categoryTerm'] as String,
  code: json['code'] as String,
  contributorId: json['contributorId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$MediaArticlesToJson(MediaArticles instance) => <String, dynamic>{
  'authorId': ?instance.authorId,
  'categoryTerm': instance.categoryTerm,
  'code': instance.code,
  'contributorId': ?instance.contributorId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': ?instance.identityId,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
