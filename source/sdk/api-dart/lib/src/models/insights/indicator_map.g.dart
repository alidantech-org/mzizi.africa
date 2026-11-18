// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_map.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorMap _$InsightsIndicatorMapFromJson(Map<String, dynamic> json) => InsightsIndicatorMap(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  indicator: json['indicator'],
  parent: json['parent'] == null ? null : InsightsPlaceCrumb.fromJson(json['parent'] as Map<String, dynamic>),
  periodFrom: json['periodFrom'] == null ? null : DateTime.parse(json['periodFrom'] as String),
  units: json['units'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsIndicatorMapToJson(InsightsIndicatorMap instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'indicator': ?instance.indicator,
  'parent': ?instance.parent,
  'periodFrom': ?instance.periodFrom?.toIso8601String(),
  'units': instance.units,
};
