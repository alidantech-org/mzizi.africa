// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'roles.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryRoles _$HistoryRolesFromJson(Map<String, dynamic> json) => HistoryRoles(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  identityId: json['identityId'] as String,
  occurrenceId: json['occurrenceId'] as String,
  roleTerm: json['roleTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$HistoryRolesToJson(HistoryRoles instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'identityId': instance.identityId,
  'occurrenceId': instance.occurrenceId,
  'roleTerm': instance.roleTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
