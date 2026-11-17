// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invitations.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthInvitations _$AuthInvitationsFromJson(Map<String, dynamic> json) => AuthInvitations(
  acceptedAccountId: json['acceptedAccountId'] as String?,
  acceptedAt: json['acceptedAt'] == null ? null : DateTime.parse(json['acceptedAt'] as String),
  createdAt: DateTime.parse(json['createdAt'] as String),
  expiresAt: json['expiresAt'] == null ? null : DateTime.parse(json['expiresAt'] as String),
  id: json['id'] as String,
  institutionRefId: json['institutionRefId'] as String,
  intendedEmail: json['intendedEmail'] as String,
  invitedBy: json['invitedBy'] as String,
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  tokenDigest: json['tokenDigest'] as String,
);

Map<String, dynamic> _$AuthInvitationsToJson(AuthInvitations instance) => <String, dynamic>{
  'acceptedAccountId': ?instance.acceptedAccountId,
  'acceptedAt': ?instance.acceptedAt?.toIso8601String(),
  'createdAt': instance.createdAt.toIso8601String(),
  'expiresAt': ?instance.expiresAt?.toIso8601String(),
  'id': instance.id,
  'institutionRefId': instance.institutionRefId,
  'intendedEmail': instance.intendedEmail,
  'invitedBy': instance.invitedBy,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'tokenDigest': instance.tokenDigest,
};
