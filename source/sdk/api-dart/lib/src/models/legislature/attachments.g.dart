// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'attachments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LegislatureAttachments _$LegislatureAttachmentsFromJson(Map<String, dynamic> json) => LegislatureAttachments(
  articleId: json['articleId'] as String?,
  assetId: json['assetId'] as String?,
  billId: json['billId'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endSecond: (json['endSecond'] as num?)?.toDouble(),
  id: json['id'] as String,
  position: (json['position'] as num?)?.toInt(),
  purposeTerm: json['purposeTerm'] as String,
  sittingId: json['sittingId'] as String?,
  speechId: json['speechId'] as String?,
  startSecond: (json['startSecond'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$LegislatureAttachmentsToJson(LegislatureAttachments instance) => <String, dynamic>{
  'articleId': ?instance.articleId,
  'assetId': ?instance.assetId,
  'billId': ?instance.billId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endSecond': ?instance.endSecond,
  'id': instance.id,
  'position': ?instance.position,
  'purposeTerm': instance.purposeTerm,
  'sittingId': ?instance.sittingId,
  'speechId': ?instance.speechId,
  'startSecond': ?instance.startSecond,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
