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
  lastAuthenticatedAt: json['lastAuthenticatedAt'] == null ? null : DateTime.parse(json['lastAuthenticatedAt'] as String),
  personRefId: json['personRefId'] as String,
  status: $enumDecode(_$AuthAccountStatusEnumMap, json['status']),
);

Map<String, dynamic> _$AuthAccountsToJson(AuthAccounts instance) => <String, dynamic>{
  'actorKind': _$AuthAuthActorKindEnumMap[instance.actorKind]!,
  'createdAt': instance.createdAt.toIso8601String(),
  'disabledAt': ?instance.disabledAt?.toIso8601String(),
  'displayName': instance.displayName,
  'id': instance.id,
  'lastAuthenticatedAt': ?instance.lastAuthenticatedAt?.toIso8601String(),
  'personRefId': instance.personRefId,
  'status': _$AuthAccountStatusEnumMap[instance.status]!,
};

const _$AuthAuthActorKindEnumMap = {AuthAuthActorKind.person: 'person', AuthAuthActorKind.service: 'service'};

const _$AuthAccountStatusEnumMap = {
  AuthAccountStatus.active: 'active',
  AuthAccountStatus.closed: 'closed',
  AuthAccountStatus.suspended: 'suspended',
};
