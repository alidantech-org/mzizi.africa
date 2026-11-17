// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'locality_unit.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

LocalityLocalityUnit _$LocalityLocalityUnitFromJson(Map<String, dynamic> json) => LocalityLocalityUnit(
  code: json['code'] as String,
  depth: (json['depth'] as num).toInt(),
  featureId: json['featureId'] as String,
  kindCode: json['kindCode'] as String,
  kindLabel: json['kindLabel'] as String,
  name: json['name'] as String,
);

Map<String, dynamic> _$LocalityLocalityUnitToJson(LocalityLocalityUnit instance) => <String, dynamic>{
  'code': instance.code,
  'depth': instance.depth,
  'featureId': instance.featureId,
  'kindCode': instance.kindCode,
  'kindLabel': instance.kindLabel,
  'name': instance.name,
};
