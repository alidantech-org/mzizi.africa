// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'votes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceVotes _$GovernanceVotesFromJson(Map<String, dynamic> json) => GovernanceVotes(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  holderId: json['holderId'] as String,
  id: json['id'] as String,
  motionId: json['motionId'] as String,
  positionId: json['positionId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceVotesToJson(GovernanceVotes instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'holderId': instance.holderId,
  'id': instance.id,
  'motionId': instance.motionId,
  'positionId': instance.positionId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
