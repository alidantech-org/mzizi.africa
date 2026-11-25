// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'contracts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicContracts _$CivicContractsFromJson(Map<String, dynamic> json) => CivicContracts(
  amount: (json['amount'] as num?)?.toInt(),
  buyerId: json['buyerId'] as String,
  code: json['code'] as String,
  contractorId: json['contractorId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  endsOn: json['endsOn'] == null ? null : DateTime.parse(json['endsOn'] as String),
  id: json['id'] as String,
  natureTerm: json['natureTerm'] as String,
  procurementId: json['procurementId'] as String?,
  projectId: json['projectId'] as String?,
  signedOn: json['signedOn'] == null ? null : DateTime.parse(json['signedOn'] as String),
  startsOn: json['startsOn'] == null ? null : DateTime.parse(json['startsOn'] as String),
  statusTerm: json['statusTerm'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicContractsToJson(CivicContracts instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'buyerId': instance.buyerId,
  'code': instance.code,
  'contractorId': instance.contractorId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'endsOn': ?instance.endsOn?.toIso8601String(),
  'id': instance.id,
  'natureTerm': instance.natureTerm,
  'procurementId': ?instance.procurementId,
  'projectId': ?instance.projectId,
  'signedOn': ?instance.signedOn?.toIso8601String(),
  'startsOn': ?instance.startsOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
