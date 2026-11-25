// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attachments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicAttachments _$CivicAttachmentsFromJson(Map<String, dynamic> json) => CivicAttachments(
  articleId: json['articleId'] as String?,
  assetId: json['assetId'] as String?,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  deliveryId: json['deliveryId'] as String?,
  endSecond: (json['endSecond'] as num?)?.toDouble(),
  id: json['id'] as String,
  position: (json['position'] as num?)?.toInt(),
  projectId: json['projectId'] as String?,
  purposeTerm: json['purposeTerm'] as String,
  startSecond: (json['startSecond'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicAttachmentsToJson(CivicAttachments instance) => <String, dynamic>{
  'articleId': ?instance.articleId,
  'assetId': ?instance.assetId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'deliveryId': ?instance.deliveryId,
  'endSecond': ?instance.endSecond,
  'id': instance.id,
  'position': ?instance.position,
  'projectId': ?instance.projectId,
  'purposeTerm': instance.purposeTerm,
  'startSecond': ?instance.startSecond,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
