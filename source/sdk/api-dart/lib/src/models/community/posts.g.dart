// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'posts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityPosts _$CommunityPostsFromJson(Map<String, dynamic> json) => CommunityPosts(
  actorId: json['actorId'] as String,
  body: json['body'] as String?,
  countryId: json['countryId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  deviceId: json['deviceId'] as String?,
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  kindTerm: json['kindTerm'] as String,
  languageId: json['languageId'] as String?,
  parentId: json['parentId'] as String?,
  proofId: json['proofId'] as String?,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  rating: (json['rating'] as num?)?.toInt(),
  state: $enumDecode(_$CommunityPostStateEnumMap, json['state']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityPostsToJson(CommunityPosts instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'body': ?instance.body,
  'countryId': instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'deviceId': ?instance.deviceId,
  'id': instance.id,
  'identityId': ?instance.identityId,
  'kindTerm': instance.kindTerm,
  'languageId': ?instance.languageId,
  'parentId': ?instance.parentId,
  'proofId': ?instance.proofId,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'rating': ?instance.rating,
  'state': _$CommunityPostStateEnumMap[instance.state]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityPostStateEnumMap = {
  CommunityPostState.draft: 'draft',
  CommunityPostState.pending: 'pending',
  CommunityPostState.published: 'published',
  CommunityPostState.rejected: 'rejected',
  CommunityPostState.removed: 'removed',
};
