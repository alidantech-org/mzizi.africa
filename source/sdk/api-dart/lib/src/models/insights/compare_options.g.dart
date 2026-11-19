// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptions _$InsightsCompareOptionsFromJson(Map<String, dynamic> json) => InsightsCompareOptions(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  hierarchy: (json['hierarchy'] as List<dynamic>).map((e) => InsightsCompareOptionsHierarchy.fromJson(e as Map<String, dynamic>)).toList(),
  metrics: (json['metrics'] as List<dynamic>).map((e) => InsightsCompareOptionsMetrics.fromJson(e as Map<String, dynamic>)).toList(),
  nearby: (json['nearby'] as List<dynamic>).map((e) => InsightsCompareOptionsNearby.fromJson(e as Map<String, dynamic>)).toList(),
  place: InsightsCompareOptionsPlace.fromJson(json['place'] as Map<String, dynamic>),
  top: (json['top'] as List<dynamic>).map((e) => InsightsCompareOptionsTop.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsCompareOptionsToJson(InsightsCompareOptions instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'hierarchy': instance.hierarchy,
  'metrics': instance.metrics,
  'nearby': instance.nearby,
  'place': instance.place,
  'top': instance.top,
};
