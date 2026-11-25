// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'proofs.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityProofs _$CommunityProofsFromJson(Map<String, dynamic> json) => CommunityProofs(
  accuracyMeters: (json['accuracyMeters'] as num?)?.toInt(),
  actorId: json['actorId'] as String,
  attestationOk: json['attestationOk'] as bool?,
  check: $enumDecode(_$CommunityLocationCheckEnumMap, json['check']),
  coarseCell: json['coarseCell'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  deviceId: json['deviceId'] as String,
  headerAgrees: json['headerAgrees'] as bool?,
  id: json['id'] as String,
  matchedFeatureId: json['matchedFeatureId'] as String?,
  mockLocationDetected: json['mockLocationDetected'] as bool,
  recordedAt: DateTime.parse(json['recordedAt'] as String),
  travelOk: json['travelOk'] as bool?,
  trustScore: (json['trustScore'] as num).toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityProofsToJson(CommunityProofs instance) => <String, dynamic>{
  'accuracyMeters': ?instance.accuracyMeters,
  'actorId': instance.actorId,
  'attestationOk': ?instance.attestationOk,
  'check': _$CommunityLocationCheckEnumMap[instance.check]!,
  'coarseCell': ?instance.coarseCell,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'deviceId': instance.deviceId,
  'headerAgrees': ?instance.headerAgrees,
  'id': instance.id,
  'matchedFeatureId': ?instance.matchedFeatureId,
  'mockLocationDetected': instance.mockLocationDetected,
  'recordedAt': instance.recordedAt.toIso8601String(),
  'travelOk': ?instance.travelOk,
  'trustScore': instance.trustScore,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityLocationCheckEnumMap = {
  CommunityLocationCheck.inside: 'inside',
  CommunityLocationCheck.near: 'near',
  CommunityLocationCheck.outside: 'outside',
  CommunityLocationCheck.suspectedMock: 'suspected-mock',
  CommunityLocationCheck.unavailable: 'unavailable',
};
