// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptions _$InsightsCompareOptionsFromJson(Map<String, dynamic> json) => InsightsCompareOptions(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  hierarchy: json['hierarchy'] as List<dynamic>,
  metrics: json['metrics'] as List<dynamic>,
  nearby: json['nearby'] as List<dynamic>,
  place: json['place'],
  top: json['top'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsCompareOptionsToJson(InsightsCompareOptions instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'hierarchy': instance.hierarchy,
  'metrics': instance.metrics,
  'nearby': instance.nearby,
  'place': ?instance.place,
  'top': instance.top,
};
