// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'devices.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityDevices _$CommunityDevicesFromJson(Map<String, dynamic> json) => CommunityDevices(
  actorId: json['actorId'] as String,
  appVersion: json['appVersion'] as String?,
  attestation: $enumDecode(_$CommunityAttestationStatusEnumMap, json['attestation']),
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  fingerprintHash: json['fingerprintHash'] as String,
  firstSeenAt: DateTime.parse(json['firstSeenAt'] as String),
  id: json['id'] as String,
  lastSeenAt: DateTime.parse(json['lastSeenAt'] as String),
  platform: $enumDecode(_$CommunityPlatformEnumMap, json['platform']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityDevicesToJson(CommunityDevices instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'appVersion': ?instance.appVersion,
  'attestation': _$CommunityAttestationStatusEnumMap[instance.attestation]!,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'fingerprintHash': instance.fingerprintHash,
  'firstSeenAt': instance.firstSeenAt.toIso8601String(),
  'id': instance.id,
  'lastSeenAt': instance.lastSeenAt.toIso8601String(),
  'platform': _$CommunityPlatformEnumMap[instance.platform]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityAttestationStatusEnumMap = {
  CommunityAttestationStatus.failed: 'failed',
  CommunityAttestationStatus.none: 'none',
  CommunityAttestationStatus.passed: 'passed',
  CommunityAttestationStatus.unavailable: 'unavailable',
};

const _$CommunityPlatformEnumMap = {CommunityPlatform.android: 'android', CommunityPlatform.ios: 'ios', CommunityPlatform.web: 'web'};
