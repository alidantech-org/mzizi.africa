// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'tokens.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityTokens _$CommunityTokensFromJson(Map<String, dynamic> json) => CommunityTokens(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  deviceId: json['deviceId'] as String,
  enabledAt: DateTime.parse(json['enabledAt'] as String),
  id: json['id'] as String,
  provider: $enumDecode(_$CommunityPushProviderEnumMap, json['provider']),
  revokedAt: json['revokedAt'] == null ? null : DateTime.parse(json['revokedAt'] as String),
  token: json['token'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityTokensToJson(CommunityTokens instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'deviceId': instance.deviceId,
  'enabledAt': instance.enabledAt.toIso8601String(),
  'id': instance.id,
  'provider': _$CommunityPushProviderEnumMap[instance.provider]!,
  'revokedAt': ?instance.revokedAt?.toIso8601String(),
  'token': instance.token,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityPushProviderEnumMap = {
  CommunityPushProvider.apns: 'apns',
  CommunityPushProvider.fcm: 'fcm',
  CommunityPushProvider.onesignal: 'onesignal',
};
