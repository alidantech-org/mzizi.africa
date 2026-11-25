// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attachments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ElectionAttachments _$ElectionAttachmentsFromJson(Map<String, dynamic> json) => ElectionAttachments(
  articleId: json['articleId'] as String?,
  assetId: json['assetId'] as String?,
  candidateId: json['candidateId'] as String?,
  contestId: json['contestId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  electionId: json['electionId'] as String?,
  endSecond: (json['endSecond'] as num?)?.toDouble(),
  id: json['id'] as String,
  position: (json['position'] as num?)?.toInt(),
  purposeTerm: json['purposeTerm'] as String,
  startSecond: (json['startSecond'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$ElectionAttachmentsToJson(ElectionAttachments instance) => <String, dynamic>{
  'articleId': ?instance.articleId,
  'assetId': ?instance.assetId,
  'candidateId': ?instance.candidateId,
  'contestId': ?instance.contestId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'electionId': ?instance.electionId,
  'endSecond': ?instance.endSecond,
  'id': instance.id,
  'position': ?instance.position,
  'purposeTerm': instance.purposeTerm,
  'startSecond': ?instance.startSecond,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
