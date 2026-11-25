// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'consents.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CommunityConsents _$CommunityConsentsFromJson(Map<String, dynamic> json) => CommunityConsents(
  actorId: json['actorId'] as String,
  countryId: json['countryId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  givenAt: DateTime.parse(json['givenAt'] as String),
  id: json['id'] as String,
  keyId: json['keyId'] as String,
  purposeTerm: json['purposeTerm'] as String,
  textVersion: json['textVersion'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
  withdrawnAt: json['withdrawnAt'] == null ? null : DateTime.parse(json['withdrawnAt'] as String),
);

Map<String, dynamic> _$CommunityConsentsToJson(CommunityConsents instance) => <String, dynamic>{
  'actorId': instance.actorId,
  'countryId': ?instance.countryId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'givenAt': instance.givenAt.toIso8601String(),
  'id': instance.id,
  'keyId': instance.keyId,
  'purposeTerm': instance.purposeTerm,
  'textVersion': instance.textVersion,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
  'withdrawnAt': ?instance.withdrawnAt?.toIso8601String(),
};
