// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'bids.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicBids _$CivicBidsFromJson(Map<String, dynamic> json) => CivicBids(
  amount: (json['amount'] as num?)?.toInt(),
  bidderId: json['bidderId'] as String,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  outcomeTerm: json['outcomeTerm'] as String,
  procurementId: json['procurementId'] as String,
  submittedOn: json['submittedOn'] == null ? null : DateTime.parse(json['submittedOn'] as String),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicBidsToJson(CivicBids instance) => <String, dynamic>{
  'amount': ?instance.amount,
  'bidderId': instance.bidderId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'outcomeTerm': instance.outcomeTerm,
  'procurementId': instance.procurementId,
  'submittedOn': ?instance.submittedOn?.toIso8601String(),
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
