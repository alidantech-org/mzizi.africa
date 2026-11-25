// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'goods.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

EconomyGoods _$EconomyGoodsFromJson(Map<String, dynamic> json) => EconomyGoods(
  code: json['code'] as String,
  createdAt: DateTime.parse(json['createdAt'] as String),
  deletedAt: json['deletedAt'] == null ? null : DateTime.parse(json['deletedAt'] as String),
  id: json['id'] as String,
  kind: $enumDecode(_$EconomyGoodKindEnumMap, json['kind']),
  parentId: json['parentId'] as String?,
  size: (json['size'] as num?)?.toDouble(),
  sizeUnitId: json['sizeUnitId'] as String?,
  standardTerm: json['standardTerm'] as String?,
  status: $enumDecode(_$EconomyGoodStatusEnumMap, json['status']),
  unitId: json['unitId'] as String?,
  updatedAt: DateTime.parse(json['updatedAt'] as String),
  version: (json['version'] as num).toInt(),
);

Map<String, dynamic> _$EconomyGoodsToJson(EconomyGoods instance) => <String, dynamic>{
  'code': instance.code,
  'createdAt': instance.createdAt.toIso8601String(),
  'deletedAt': ?instance.deletedAt?.toIso8601String(),
  'id': instance.id,
  'kind': _$EconomyGoodKindEnumMap[instance.kind]!,
  'parentId': ?instance.parentId,
  'size': ?instance.size,
  'sizeUnitId': ?instance.sizeUnitId,
  'standardTerm': ?instance.standardTerm,
  'status': _$EconomyGoodStatusEnumMap[instance.status]!,
  'unitId': ?instance.unitId,
  'updatedAt': instance.updatedAt.toIso8601String(),
  'version': instance.version,
};

const _$EconomyGoodKindEnumMap = {EconomyGoodKind.good: 'good', EconomyGoodKind.service: 'service', EconomyGoodKind.works: 'works'};

const _$EconomyGoodStatusEnumMap = {EconomyGoodStatus.active: 'active', EconomyGoodStatus.retired: 'retired'};
