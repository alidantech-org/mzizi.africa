// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'actors.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityActors _$CommunityActorsFromJson(Map<String, dynamic> json) => CommunityActors(
  accountId: json['accountId'] as String?,
  avatarId: json['avatarId'] as String?,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  displayName: json['displayName'] as String?,
  firstSeenAt: DateTime.parse(json['firstSeenAt'] as String),
  handle: json['handle'] as String?,
  id: json['id'] as String,
  kind: $enumDecode(_$CommunityActorKindEnumMap, json['kind']),
  languageId: json['languageId'] as String?,
  lastSeenAt: DateTime.parse(json['lastSeenAt'] as String),
  status: $enumDecode(_$CommunityActorStatusEnumMap, json['status']),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CommunityActorsToJson(CommunityActors instance) => <String, dynamic>{
  'accountId': ?instance.accountId,
  'avatarId': ?instance.avatarId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'displayName': ?instance.displayName,
  'firstSeenAt': instance.firstSeenAt.toIso8601String(),
  'handle': ?instance.handle,
  'id': instance.id,
  'kind': _$CommunityActorKindEnumMap[instance.kind]!,
  'languageId': ?instance.languageId,
  'lastSeenAt': instance.lastSeenAt.toIso8601String(),
  'status': _$CommunityActorStatusEnumMap[instance.status]!,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$CommunityActorKindEnumMap = {CommunityActorKind.member: 'member', CommunityActorKind.visitor: 'visitor'};

const _$CommunityActorStatusEnumMap = {
  CommunityActorStatus.active: 'active',
  CommunityActorStatus.blocked: 'blocked',
  CommunityActorStatus.closed: 'closed',
};
