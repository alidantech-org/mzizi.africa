// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_map_units.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorMapUnits _$InsightsIndicatorMapUnitsFromJson(Map<String, dynamic> json) => InsightsIndicatorMapUnits(
  estimated: json['estimated'] as bool,
  featureId: json['featureId'] as String,
  geometry: json['geometry'],
  kind: json['kind'] as String,
  name: json['name'] as String,
  path: json['path'] as String,
  rank: (json['rank'] as num).toDouble(),
  value: (json['value'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsIndicatorMapUnitsToJson(InsightsIndicatorMapUnits instance) => <String, dynamic>{
  'estimated': instance.estimated,
  'featureId': instance.featureId,
  'geometry': ?instance.geometry,
  'kind': instance.kind,
  'name': instance.name,
  'path': instance.path,
  'rank': instance.rank,
  'value': instance.value,
};
