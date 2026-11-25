// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attachments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

PoliticsAttachments _$PoliticsAttachmentsFromJson(Map<String, dynamic> json) => PoliticsAttachments(
  articleId: json['articleId'] as String?,
  assetId: json['assetId'] as String?,
  commitmentId: json['commitmentId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endSecond: (json['endSecond'] as num?)?.toDouble(),
  fulfilmentId: json['fulfilmentId'] as String?,
  id: json['id'] as String,
  manifestoId: json['manifestoId'] as String?,
  position: (json['position'] as num?)?.toInt(),
  purposeTerm: json['purposeTerm'] as String,
  startSecond: (json['startSecond'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$PoliticsAttachmentsToJson(PoliticsAttachments instance) => <String, dynamic>{
  'articleId': ?instance.articleId,
  'assetId': ?instance.assetId,
  'commitmentId': ?instance.commitmentId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endSecond': ?instance.endSecond,
  'fulfilmentId': ?instance.fulfilmentId,
  'id': instance.id,
  'manifestoId': ?instance.manifestoId,
  'position': ?instance.position,
  'purposeTerm': instance.purposeTerm,
  'startSecond': ?instance.startSecond,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
