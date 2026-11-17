// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'delegations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthDelegations _$AuthDelegationsFromJson(Map<String, dynamic> json) => AuthDelegations(
  createdAt: DateTime.parse(json['createdAt'] as String),
  delegateAccountId: json['delegateAccountId'] as String,
  delegatorAccountId: json['delegatorAccountId'] as String,
  expiresAt: json['expiresAt'] == null ? null : DateTime.parse(json['expiresAt'] as String),
  id: json['id'] as String,
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  revokedBy: json['revokedBy'] as String?,
  scopeId: json['scopeId'] as String,
  startsAt: json['startsAt'] == null ? null : DateTime.parse(json['startsAt'] as String),
);

Map<String, dynamic> _$AuthDelegationsToJson(AuthDelegations instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'delegateAccountId': instance.delegateAccountId,
  'delegatorAccountId': instance.delegatorAccountId,
  'expiresAt': ?instance.expiresAt?.toIso8601String(),
  'id': instance.id,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'revokedBy': ?instance.revokedBy,
  'scopeId': instance.scopeId,
  'startsAt': ?instance.startsAt?.toIso8601String(),
};
