// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'money_entity.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FinanceMoneyEntity _$FinanceMoneyEntityFromJson(Map<String, dynamic> json) => FinanceMoneyEntity(
  amountMinorUnits: (json['amountMinorUnits'] as num).toInt(),
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  currencyId: json['currencyId'] as String,
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$FinanceMoneyEntityToJson(FinanceMoneyEntity instance) => <String, dynamic>{
  'amountMinorUnits': instance.amountMinorUnits,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'currencyId': instance.currencyId,
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
