// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'roles.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicRoles _$CivicRolesFromJson(Map<String, dynamic> json) => CivicRoles(
  actedOn: json['actedOn'] == null ? null : DateTime.parse(json['actedOn'] as String),
  bidId: json['bidId'] as String?,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  holderId: json['holderId'] as String?,
  id: json['id'] as String,
  identityId: json['identityId'] as String?,
  procurementId: json['procurementId'] as String?,
  projectId: json['projectId'] as String?,
  roleTerm: json['roleTerm'] as String,
  share: (json['share'] as num?)?.toDouble(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicRolesToJson(CivicRoles instance) => <String, dynamic>{
  'actedOn': ?instance.actedOn?.toIso8601String(),
  'bidId': ?instance.bidId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'holderId': ?instance.holderId,
  'id': instance.id,
  'identityId': ?instance.identityId,
  'procurementId': ?instance.procurementId,
  'projectId': ?instance.projectId,
  'roleTerm': instance.roleTerm,
  'share': ?instance.share,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
