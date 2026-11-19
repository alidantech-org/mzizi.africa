// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contracts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicContracts _$CivicContractsFromJson(Map<String, dynamic> json) => CivicContracts(
  amountMinorUnits: (json['amountMinorUnits'] as num).toInt(),
  buyerEntityId: json['buyerEntityId'] as String?,
  code: json['code'] as String,
  contractorEntityId: json['contractorEntityId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  natureId: json['natureId'] as String?,
  procurementId: json['procurementId'] as String?,
  projectId: json['projectId'] as String?,
  signedOn: json['signedOn'] == null ? null : DateTime.parse(json['signedOn'] as String),
  sourceCitationId: json['sourceCitationId'] as String?,
  statusId: json['statusId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicContractsToJson(CivicContracts instance) => <String, dynamic>{
  'amountMinorUnits': instance.amountMinorUnits,
  'buyerEntityId': ?instance.buyerEntityId,
  'code': instance.code,
  'contractorEntityId': instance.contractorEntityId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'natureId': ?instance.natureId,
  'procurementId': ?instance.procurementId,
  'projectId': ?instance.projectId,
  'signedOn': ?instance.signedOn?.toIso8601String(),
  'sourceCitationId': ?instance.sourceCitationId,
  'statusId': instance.statusId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
