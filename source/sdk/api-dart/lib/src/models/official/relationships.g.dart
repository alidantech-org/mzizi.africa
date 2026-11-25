// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialRelationships _$OfficialRelationshipsFromJson(Map<String, dynamic> json) => OfficialRelationships(
  basisTerm: json['basisTerm'] as String,
  confidence: (json['confidence'] as num?)?.toDouble(),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  fromId: json['fromId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  id: json['id'] as String,
  kindTerm: json['kindTerm'] as String,
  sharePercentage: (json['sharePercentage'] as num?)?.toDouble(),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  statusTerm: json['statusTerm'] as String,
  toId: json['toId'] as String,
  toYear: (json['toYear'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialRelationshipsToJson(OfficialRelationships instance) => <String, dynamic>{
  'basisTerm': instance.basisTerm,
  'confidence': ?instance.confidence,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'fromId': instance.fromId,
  'fromYear': ?instance.fromYear,
  'id': instance.id,
  'kindTerm': instance.kindTerm,
  'sharePercentage': ?instance.sharePercentage,
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'toId': instance.toId,
  'toYear': ?instance.toYear,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
