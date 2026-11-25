// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'account_summary.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

AuthAccountSummary _$AuthAccountSummaryFromJson(Map<String, dynamic> json) => AuthAccountSummary(
  actorKind: $enumDecode(_$AuthAuthActorKindEnumMap, json['actorKind']),
  displayName: json['displayName'] as String,
  id: json['id'] as String,
  status: $enumDecode(_$AuthAccountStatusEnumMap, json['status']),
);

Map<String, dynamic> _$AuthAccountSummaryToJson(AuthAccountSummary instance) => <String, dynamic>{
  'actorKind': _$AuthAuthActorKindEnumMap[instance.actorKind]!,
  'displayName': instance.displayName,
  'id': instance.id,
  'status': _$AuthAccountStatusEnumMap[instance.status]!,
};

const _$AuthAuthActorKindEnumMap = {AuthAuthActorKind.agent: 'agent', AuthAuthActorKind.person: 'person', AuthAuthActorKind.service: 'service'};

const _$AuthAccountStatusEnumMap = {
  AuthAccountStatus.active: 'active',
  AuthAccountStatus.closed: 'closed',
  AuthAccountStatus.suspended: 'suspended',
};
