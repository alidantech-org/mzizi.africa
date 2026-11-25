// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'logins.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthLogins _$AuthLoginsFromJson(Map<String, dynamic> json) => AuthLogins(
  accountId: json['accountId'] as String,
  id: json['id'] as String,
  issuer: json['issuer'] as String?,
  kind: $enumDecode(_$AuthLoginKindEnumMap, json['kind']),
  lastAuthenticatedAt: json['lastAuthenticatedAt'] == null ? null : DateTime.parse(json['lastAuthenticatedAt'] as String),
  linkedAt: DateTime.parse(json['linkedAt'] as String),
  subject: json['subject'] as String?,
  unlinkedAt: json['unlinkedAt'] == null ? null : DateTime.parse(json['unlinkedAt'] as String),
  value: json['value'] as String?,
  verifiedAt: json['verifiedAt'] == null ? null : DateTime.parse(json['verifiedAt'] as String),
);

Map<String, dynamic> _$AuthLoginsToJson(AuthLogins instance) => <String, dynamic>{
  'accountId': instance.accountId,
  'id': instance.id,
  'issuer': ?instance.issuer,
  'kind': _$AuthLoginKindEnumMap[instance.kind]!,
  'lastAuthenticatedAt': ?instance.lastAuthenticatedAt?.toIso8601String(),
  'linkedAt': instance.linkedAt.toIso8601String(),
  'subject': ?instance.subject,
  'unlinkedAt': ?instance.unlinkedAt?.toIso8601String(),
  'value': ?instance.value,
  'verifiedAt': ?instance.verifiedAt?.toIso8601String(),
};

const _$AuthLoginKindEnumMap = {AuthLoginKind.email: 'email', AuthLoginKind.oidc: 'oidc', AuthLoginKind.phone: 'phone'};
