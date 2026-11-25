// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_read.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthAccountRead _$AuthAccountReadFromJson(Map<String, dynamic> json) => AuthAccountRead(
  actorKind: $enumDecode(_$AuthAuthActorKindEnumMap, json['actorKind']),
  displayName: json['displayName'] as String,
  id: json['id'] as String,
  lastAuthenticatedAt: json['lastAuthenticatedAt'] == null ? null : DateTime.parse(json['lastAuthenticatedAt'] as String),
  status: $enumDecode(_$AuthAccountStatusEnumMap, json['status']),
);

Map<String, dynamic> _$AuthAccountReadToJson(AuthAccountRead instance) => <String, dynamic>{
  'actorKind': _$AuthAuthActorKindEnumMap[instance.actorKind]!,
  'displayName': instance.displayName,
  'id': instance.id,
  'lastAuthenticatedAt': ?instance.lastAuthenticatedAt?.toIso8601String(),
  'status': _$AuthAccountStatusEnumMap[instance.status]!,
};

const _$AuthAuthActorKindEnumMap = {AuthAuthActorKind.agent: 'agent', AuthAuthActorKind.person: 'person', AuthAuthActorKind.service: 'service'};

const _$AuthAccountStatusEnumMap = {
  AuthAccountStatus.active: 'active',
  AuthAccountStatus.closed: 'closed',
  AuthAccountStatus.suspended: 'suspended',
};
