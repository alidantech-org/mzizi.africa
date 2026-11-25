// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'memberships.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthMemberships _$AuthMembershipsFromJson(Map<String, dynamic> json) => AuthMemberships(
  accountId: json['accountId'] as String,
  endsAt: json['endsAt'] == null ? null : DateTime.parse(json['endsAt'] as String),
  id: json['id'] as String,
  institutionId: json['institutionId'] as String,
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  revokedBy: json['revokedBy'] as String?,
  startsAt: json['startsAt'] == null ? null : DateTime.parse(json['startsAt'] as String),
  status: $enumDecode(_$AuthMembershipStatusEnumMap, json['status']),
  verifiedAt: json['verifiedAt'] == null ? null : DateTime.parse(json['verifiedAt'] as String),
  verifiedBy: json['verifiedBy'] as String?,
);

Map<String, dynamic> _$AuthMembershipsToJson(AuthMemberships instance) => <String, dynamic>{
  'accountId': instance.accountId,
  'endsAt': ?instance.endsAt?.toIso8601String(),
  'id': instance.id,
  'institutionId': instance.institutionId,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'revokedBy': ?instance.revokedBy,
  'startsAt': ?instance.startsAt?.toIso8601String(),
  'status': _$AuthMembershipStatusEnumMap[instance.status]!,
  'verifiedAt': ?instance.verifiedAt?.toIso8601String(),
  'verifiedBy': ?instance.verifiedBy,
};

const _$AuthMembershipStatusEnumMap = {
  AuthMembershipStatus.active: 'active',
  AuthMembershipStatus.expired: 'expired',
  AuthMembershipStatus.pending: 'pending',
  AuthMembershipStatus.revoked: 'revoked',
  AuthMembershipStatus.suspended: 'suspended',
};
