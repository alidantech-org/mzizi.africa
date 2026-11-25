// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'replies.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityReplies _$CommunityRepliesFromJson(Map<String, dynamic> json) => CommunityReplies(
  body: json['body'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  languageId: json['languageId'] as String,
  postCountryId: json['postCountryId'] as String,
  postId: json['postId'] as String,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  receivedAt: DateTime.parse(json['receivedAt'] as String),
  respondentId: json['respondentId'] as String,
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityRepliesToJson(CommunityReplies instance) => <String, dynamic>{
  'body': instance.body,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'languageId': instance.languageId,
  'postCountryId': instance.postCountryId,
  'postId': instance.postId,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'receivedAt': instance.receivedAt.toIso8601String(),
  'respondentId': instance.respondentId,
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
