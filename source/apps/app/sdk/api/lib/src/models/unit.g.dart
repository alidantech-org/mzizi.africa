// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

Unit _$UnitFromJson(Map<String, dynamic> json) => Unit(
  baseId: json['baseId'] as String?,
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null
      ? null
      : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  offset: (json['offset'] as num).toDouble(),
  quantity: json['quantity'] as String,
  scale: (json['scale'] as num).toDouble(),
  symbol: json['symbol'] as String,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$UnitToJson(Unit instance) => <String, dynamic>{
  'baseId': ?instance.baseId,
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'offset': instance.offset,
  'quantity': instance.quantity,
  'scale': instance.scale,
  'symbol': instance.symbol,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};
