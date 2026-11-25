// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'blocks.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityBlocks _$CommunityBlocksFromJson(Map<String, dynamic> json) => CommunityBlocks(
  accountId: json['accountId'] as String,
  caseId: json['caseId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  decidedBy: json['decidedBy'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromOn: DateTime.parse(json['fromOn'] as String),
  id: json['id'] as String,
  reasonTerm: json['reasonTerm'] as String,
  toOn: json['toOn'] == null ? null : DateTime.parse(json['toOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityBlocksToJson(CommunityBlocks instance) => <String, dynamic>{
  'accountId': instance.accountId,
  'caseId': ?instance.caseId,
  'createdAt': instance.createdAt.toIso8601String(),
  'decidedBy': instance.decidedBy,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromOn': instance.fromOn.toIso8601String(),
  'id': instance.id,
  'reasonTerm': instance.reasonTerm,
  'toOn': ?instance.toOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
