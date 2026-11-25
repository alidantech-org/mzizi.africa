// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'identity_posts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityIdentityPosts _$CommunityIdentityPostsFromJson(Map<String, dynamic> json) => CommunityIdentityPosts(
  countryId: json['countryId'] as String,
  identityId: json['identityId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$CommunityIdentityPostsToJson(CommunityIdentityPosts instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'identityId': instance.identityId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
