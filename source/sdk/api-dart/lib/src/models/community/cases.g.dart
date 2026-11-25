// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'cases.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityCases _$CommunityCasesFromJson(Map<String, dynamic> json) => CommunityCases(
  createdAt: DateTime.parse(json['createdAt'] as String),
  decidedAt: json['decidedAt'] == null ? null : DateTime.parse(json['decidedAt'] as String),
  decisionTerm: json['decisionTerm'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  postCountryId: json['postCountryId'] as String,
  postId: json['postId'] as String,
  reason: json['reason'] as String?,
  reviewerAccountId: json['reviewerAccountId'] as String?,
  state: $enumDecode(_$CommunityPostStateEnumMap, json['state']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityCasesToJson(CommunityCases instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'decidedAt': ?instance.decidedAt?.toIso8601String(),
  'decisionTerm': ?instance.decisionTerm,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'postCountryId': instance.postCountryId,
  'postId': instance.postId,
  'reason': ?instance.reason,
  'reviewerAccountId': ?instance.reviewerAccountId,
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
