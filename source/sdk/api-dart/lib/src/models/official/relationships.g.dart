// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'relationships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

OfficialRelationships _$OfficialRelationshipsFromJson(Map<String, dynamic> json) => OfficialRelationships(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fromEntityId: json['fromEntityId'] as String?,
  fromIndividualId: json['fromIndividualId'] as String?,
  id: json['id'] as String,
  kindId: json['kindId'] as String,
  sharePercentage: (json['sharePercentage'] as num?)?.toDouble(),
  sourceCitationId: json['sourceCitationId'] as String?,
  toEntityId: json['toEntityId'] as String?,
  toIndividualId: json['toIndividualId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  validFrom: json['validFrom'] == null ? null : DateTime.parse(json['validFrom'] as String),
  validUntil: json['validUntil'] == null ? null : DateTime.parse(json['validUntil'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$OfficialRelationshipsToJson(OfficialRelationships instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fromEntityId': ?instance.fromEntityId,
  'fromIndividualId': ?instance.fromIndividualId,
  'id': instance.id,
  'kindId': instance.kindId,
  'sharePercentage': ?instance.sharePercentage,
  'sourceCitationId': ?instance.sourceCitationId,
  'toEntityId': ?instance.toEntityId,
  'toIndividualId': ?instance.toIndividualId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'validFrom': ?instance.validFrom?.toIso8601String(),
  'validUntil': ?instance.validUntil?.toIso8601String(),
  'version': instance.version,
};
