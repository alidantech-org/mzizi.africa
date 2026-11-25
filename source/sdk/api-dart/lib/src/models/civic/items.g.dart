// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'items.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicItems _$CivicItemsFromJson(Map<String, dynamic> json) => CivicItems(
  bidId: json['bidId'] as String?,
  contractId: json['contractId'] as String?,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  quantity: (json['quantity'] as num).toDouble(),
  unitId: json['unitId'] as String,
  unitPrice: (json['unitPrice'] as num?)?.toInt(),
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicItemsToJson(CivicItems instance) => <String, dynamic>{
  'bidId': ?instance.bidId,
  'contractId': ?instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'goodId': instance.goodId,
  'id': instance.id,
  'quantity': instance.quantity,
  'unitId': instance.unitId,
  'unitPrice': ?instance.unitPrice,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
