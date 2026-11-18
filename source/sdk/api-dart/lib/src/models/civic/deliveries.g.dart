// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'deliveries.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

CivicDeliveries _$CivicDeliveriesFromJson(Map<String, dynamic> json) => CivicDeliveries(
  amountMinorUnits: (json['amountMinorUnits'] as num?)?.toInt(),
  code: json['code'] as String,
  contractId: json['contractId'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String?,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  deliveredOn: json['deliveredOn'] == null ? null : DateTime.parse(json['deliveredOn'] as String),
  deliveryKindId: json['deliveryKindId'] as String,
  id: json['id'] as String,
  sourceCitationId: json['sourceCitationId'] as String?,
  unitFeatureId: json['unitFeatureId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$CivicDeliveriesToJson(CivicDeliveries instance) => <String, dynamic>{
  'amountMinorUnits': ?instance.amountMinorUnits,
  'code': instance.code,
  'contractId': instance.contractId,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': ?instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'deliveredOn': ?instance.deliveredOn?.toIso8601String(),
  'deliveryKindId': instance.deliveryKindId,
  'id': instance.id,
  'sourceCitationId': ?instance.sourceCitationId,
  'unitFeatureId': ?instance.unitFeatureId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
