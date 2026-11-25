// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'unit_entry.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

ReferenceUnitEntry _$ReferenceUnitEntryFromJson(Map<String, dynamic> json) => ReferenceUnitEntry(
  baseId: json['baseId'] as String?,
  code: json['code'] as String,
  names: (json['names'] as List<dynamic>).map((e) => ReferenceUnitEntryNames.fromJson(e as Map<String, dynamic>)).toList(),
  quantityTerm: json['quantityTerm'] as String,
  symbol: json['symbol'] as String,
  unitId: json['unitId'] as String,
);

Map<String, dynamic> _$ReferenceUnitEntryToJson(ReferenceUnitEntry instance) => <String, dynamic>{
  'baseId': ?instance.baseId,
  'code': instance.code,
  'names': instance.names,
  'quantityTerm': instance.quantityTerm,
  'symbol': instance.symbol,
  'unitId': instance.unitId,
};
