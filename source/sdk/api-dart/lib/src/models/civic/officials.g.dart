// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'officials.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicOfficials _$CivicOfficialsFromJson(Map<String, dynamic> json) => CivicOfficials(
  actedOn: json['actedOn'] == null ? null : DateTime.parse(json['actedOn'] as String),
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  individualId: json['individualId'] as String,
  officeId: json['officeId'] as String?,
  procurementId: json['procurementId'] as String?,
  roleId: json['roleId'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicOfficialsToJson(CivicOfficials instance) => <String, dynamic>{
  'actedOn': ?instance.actedOn?.toIso8601String(),
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'individualId': instance.individualId,
  'officeId': ?instance.officeId,
  'procurementId': ?instance.procurementId,
  'roleId': instance.roleId,
  'sourceCitationId': ?instance.sourceCitationId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
