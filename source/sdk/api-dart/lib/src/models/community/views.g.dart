// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'views.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityViews _$CommunityViewsFromJson(Map<String, dynamic> json) => CommunityViews(
  articleId: json['articleId'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  day: DateTime.parse(json['day'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  postCountryId: json['postCountryId'] as String?,
  postId: json['postId'] as String?,
  visitorHash: json['visitorHash'] as String,
);

Map<String, dynamic> _$CommunityViewsToJson(CommunityViews instance) => <String, dynamic>{
  'articleId': ?instance.articleId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'day': instance.day.toIso8601String(),
  'id': instance.id,
  'identityId': ?instance.identityId,
  'postCountryId': ?instance.postCountryId,
  'postId': ?instance.postId,
  'visitorHash': instance.visitorHash,
};
