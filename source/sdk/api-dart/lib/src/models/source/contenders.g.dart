// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contenders.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

SourceContenders _$SourceContendersFromJson(Map<String, dynamic> json) => SourceContenders(
  citationId: json['citationId'] as String,
  claim: json['claim'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  disputeId: json['disputeId'] as String,
  id: json['id'] as String,
  isPreferred: json['isPreferred'] as bool,
  position: (json['position'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$SourceContendersToJson(SourceContenders instance) => <String, dynamic>{
  'citationId': instance.citationId,
  'claim': instance.claim,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'disputeId': instance.disputeId,
  'id': instance.id,
  'isPreferred': instance.isPreferred,
  'position': ?instance.position,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
