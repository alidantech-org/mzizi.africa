// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'login_identities.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthLoginIdentities _$AuthLoginIdentitiesFromJson(Map<String, dynamic> json) => AuthLoginIdentities(
  accountId: json['accountId'] as String,
  id: json['id'] as String,
  issuer: json['issuer'] as String,
  lastAuthenticatedAt: json['lastAuthenticatedAt'] == null ? null : DateTime.parse(json['lastAuthenticatedAt'] as String),
  linkedAt: DateTime.parse(json['linkedAt'] as String),
  subject: json['subject'] as String,
  unlinkedAt: json['unlinkedAt'] == null ? null : DateTime.parse(json['unlinkedAt'] as String),
);

Map<String, dynamic> _$AuthLoginIdentitiesToJson(AuthLoginIdentities instance) => <String, dynamic>{
  'accountId': instance.accountId,
  'id': instance.id,
  'issuer': instance.issuer,
  'lastAuthenticatedAt': ?instance.lastAuthenticatedAt?.toIso8601String(),
  'linkedAt': instance.linkedAt.toIso8601String(),
  'subject': instance.subject,
  'unlinkedAt': ?instance.unlinkedAt?.toIso8601String(),
};
