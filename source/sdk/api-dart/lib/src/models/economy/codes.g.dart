// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'codes.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyCodes _$EconomyCodesFromJson(Map<String, dynamic> json) => EconomyCodes(
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  goodId: json['goodId'] as String,
  id: json['id'] as String,
  schemeTerm: json['schemeTerm'] as String,
  value: json['value'] as String,
);

Map<String, dynamic> _$EconomyCodesToJson(EconomyCodes instance) => <String, dynamic>{
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'goodId': instance.goodId,
  'id': instance.id,
  'schemeTerm': instance.schemeTerm,
  'value': instance.value,
};
