// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'subscriptions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunitySubscriptions _$CommunitySubscriptionsFromJson(Map<String, dynamic> json) => CommunitySubscriptions(
  actorId: json['actorId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  kindTerm: json['kindTerm'] as String,
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunitySubscriptionsToJson(CommunitySubscriptions instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': instance.identityId,
  'kindTerm': instance.kindTerm,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
