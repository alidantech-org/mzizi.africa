// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

GovernanceRelationships _$GovernanceRelationshipsFromJson(Map<String, dynamic> json) => GovernanceRelationships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromId: json['fromId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  provisionId: json['provisionId'] as String?,
  toId: json['toId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$GovernanceRelationshipsToJson(GovernanceRelationships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromId': instance.fromId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'provisionId': ?instance.provisionId,
  'toId': instance.toId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
