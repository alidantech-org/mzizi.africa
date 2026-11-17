// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'role_assignments.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthRoleAssignments _$AuthRoleAssignmentsFromJson(Map<String, dynamic> json) => AuthRoleAssignments(
  accountId: json['accountId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  delegationId: json['delegationId'] as String?,
  expiresAt: json['expiresAt'] == null ? null : DateTime.parse(json['expiresAt'] as String),
  grantedBy: json['grantedBy'] as String,
  id: json['id'] as String,
  membershipId: json['membershipId'] as String?,
  revocationReason: json['revocationReason'] as String?,
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  revokedBy: json['revokedBy'] as String?,
  roleId: json['roleId'] as String,
  scopeId: json['scopeId'] as String,
  startsAt: json['startsAt'] == null ? null : DateTime.parse(json['startsAt'] as String),
);

Map<String, dynamic> _$AuthRoleAssignmentsToJson(AuthRoleAssignments instance) => <String, dynamic>{
  'accountId': instance.accountId,
  'createdAt': instance.createdAt.toIso8601String(),
  'delegationId': ?instance.delegationId,
  'expiresAt': ?instance.expiresAt?.toIso8601String(),
  'grantedBy': instance.grantedBy,
  'id': instance.id,
  'membershipId': ?instance.membershipId,
  'revocationReason': ?instance.revocationReason,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'revokedBy': ?instance.revokedBy,
  'roleId': instance.roleId,
  'scopeId': instance.scopeId,
  'startsAt': ?instance.startsAt?.toIso8601String(),
};
