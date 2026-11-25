// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'post_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityPostEntry _$CommunityPostEntryFromJson(Map<String, dynamic> json) => CommunityPostEntry(
  body: json['body'] as String?,
  displayName: json['displayName'] as String?,
  handle: json['handle'] as String?,
  kindTerm: json['kindTerm'] as String,
  languageCode: json['languageCode'] as String?,
  postId: json['postId'] as String,
  publishedAt: json['publishedAt'] == null ? null : DateTime.parse(json['publishedAt'] as String),
  rating: (json['rating'] as num?)?.toInt(),
  state: $enumDecode(_$CommunityPostStateEnumMap, json['state']),
);

Map<String, dynamic> _$CommunityPostEntryToJson(CommunityPostEntry instance) => <String, dynamic>{
  'body': ?instance.body,
  'displayName': ?instance.displayName,
  'handle': ?instance.handle,
  'kindTerm': instance.kindTerm,
  'languageCode': ?instance.languageCode,
  'postId': instance.postId,
  'publishedAt': ?instance.publishedAt?.toIso8601String(),
  'rating': ?instance.rating,
  'state': _$CommunityPostStateEnumMap[instance.state]!,
};

const _$CommunityPostStateEnumMap = {
  CommunityPostState.draft: 'draft',
  CommunityPostState.pending: 'pending',
  CommunityPostState.published: 'published',
  CommunityPostState.rejected: 'rejected',
  CommunityPostState.removed: 'removed',
};
