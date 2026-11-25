// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'reactions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityReactions _$CommunityReactionsFromJson(Map<String, dynamic> json) => CommunityReactions(
  actorId: json['actorId'] as String,
  articleId: json['articleId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  kindTerm: json['kindTerm'] as String,
  postCountryId: json['postCountryId'] as String?,
  postId: json['postId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityReactionsToJson(CommunityReactions instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'articleId': ?instance.articleId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': ?instance.identityId,
  'kindTerm': instance.kindTerm,
  'postCountryId': ?instance.postCountryId,
  'postId': ?instance.postId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
