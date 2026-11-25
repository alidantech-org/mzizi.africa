// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'accounts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthAccounts _$AuthAccountsFromJson(Map<String, dynamic> json) => AuthAccounts(
  actorKind: $enumDecode(_$AuthAuthActorKindEnumMap, json['actorKind']),
  createdAt: DateTime.parse(json['createdAt'] as String),
  disabledAt: json['disabledAt'] == null ? null : DateTime.parse(json['disabledAt'] as String),
  displayName: json['displayName'] as String,
  id: json['id'] as String,
  individualId: json['individualId'] as String?,
  lastAuthenticatedAt: json['lastAuthenticatedAt'] == null ? null : DateTime.parse(json['lastAuthenticatedAt'] as String),
  status: $enumDecode(_$AuthAccountStatusEnumMap, json['status']),
);

Map<String, dynamic> _$AuthAccountsToJson(AuthAccounts instance) => <String, dynamic>{
  'actorKind': _$AuthAuthActorKindEnumMap[instance.actorKind]!,
  'createdAt': instance.createdAt.toIso8601String(),
  'disabledAt': ?instance.disabledAt?.toIso8601String(),
  'displayName': instance.displayName,
  'id': instance.id,
  'individualId': ?instance.individualId,
  'lastAuthenticatedAt': ?instance.lastAuthenticatedAt?.toIso8601String(),
  'status': _$AuthAccountStatusEnumMap[instance.status]!,
};

const _$AuthAuthActorKindEnumMap = {AuthAuthActorKind.agent: 'agent', AuthAuthActorKind.person: 'person', AuthAuthActorKind.service: 'service'};

const _$AuthAccountStatusEnumMap = {
  AuthAccountStatus.active: 'active',
  AuthAccountStatus.closed: 'closed',
  AuthAccountStatus.suspended: 'suspended',
};
