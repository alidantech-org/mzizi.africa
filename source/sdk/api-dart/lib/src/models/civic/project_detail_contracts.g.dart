// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'project_detail_contracts.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicProjectDetailContracts _$CivicProjectDetailContractsFromJson(Map<String, dynamic> json) => CivicProjectDetailContracts(
  amount: (json['amount'] as num?)?.toInt(),
  code: json['code'] as String,
  contractId: json['contractId'] as String,
  contractorId: json['contractorId'] as String,
  currencyCode: json['currencyCode'] as String?,
  signedOn: json['signedOn'] == null ? null : DateTime.parse(json['signedOn'] as String),
  statusTerm: json['statusTerm'] as String,
);

Map<String, dynamic> _$CivicProjectDetailContractsToJson(CivicProjectDetailContracts instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'code': instance.code,
  'contractId': instance.contractId,
  'contractorId': instance.contractorId,
  'currencyCode': ?instance.currencyCode,
  'signedOn': ?instance.signedOn?.toIso8601String(),
  'statusTerm': instance.statusTerm,
};
