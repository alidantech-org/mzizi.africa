// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compositions.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyCompositions _$EconomyCompositionsFromJson(Map<String, dynamic> json) => EconomyCompositions(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  inputId: json['inputId'] as String,
  quantity: (json['quantity'] as num).toDouble(),
  unitId: json['unitId'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EconomyCompositionsToJson(EconomyCompositions instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'goodId': instance.goodId,
  'id': instance.id,
  'inputId': instance.inputId,
  'quantity': instance.quantity,
  'unitId': instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
