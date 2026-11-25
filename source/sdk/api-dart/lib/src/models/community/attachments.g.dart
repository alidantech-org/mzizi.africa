// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attachments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityAttachments _$CommunityAttachmentsFromJson(Map<String, dynamic> json) => CommunityAttachments(
  assetId: json['assetId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  postCountryId: json['postCountryId'] as String,
  postId: json['postId'] as String,
);

Map<String, dynamic> _$CommunityAttachmentsToJson(CommunityAttachments instance) => <String, dynamic>{
  'assetId': instance.assetId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'postCountryId': instance.postCountryId,
  'postId': instance.postId,
};
