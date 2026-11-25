// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'dispatches.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityDispatches _$CommunityDispatchesFromJson(Map<String, dynamic> json) => CommunityDispatches(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deviceId: json['deviceId'] as String,
  id: json['id'] as String,
  notificationCreatedAt: DateTime.parse(json['notificationCreatedAt'] as String),
  notificationId: json['notificationId'] as String,
  openedAt: json['openedAt'] == null ? null : DateTime.parse(json['openedAt'] as String),
  sentAt: json['sentAt'] == null ? null : DateTime.parse(json['sentAt'] as String),
  state: $enumDecode(_$CommunityDispatchStateEnumMap, json['state']),
  subscriptionId: json['subscriptionId'] as String,
);

Map<String, dynamic> _$CommunityDispatchesToJson(CommunityDispatches instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deviceId': instance.deviceId,
  'id': instance.id,
  'notificationCreatedAt': instance.notificationCreatedAt.toIso8601String(),
  'notificationId': instance.notificationId,
  'openedAt': ?instance.openedAt?.toIso8601String(),
  'sentAt': ?instance.sentAt?.toIso8601String(),
  'state': _$CommunityDispatchStateEnumMap[instance.state]!,
  'subscriptionId': instance.subscriptionId,
};

const _$CommunityDispatchStateEnumMap = {
  CommunityDispatchState.failed: 'failed',
  CommunityDispatchState.opened: 'opened',
  CommunityDispatchState.queued: 'queued',
  CommunityDispatchState.sent: 'sent',
};
