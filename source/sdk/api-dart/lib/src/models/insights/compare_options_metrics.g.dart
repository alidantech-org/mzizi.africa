// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'compare_options_metrics.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsCompareOptionsMetrics _$InsightsCompareOptionsMetricsFromJson(Map<String, dynamic> json) => InsightsCompareOptionsMetrics(
  code: json['code'] as String,
  describe: json['describe'] as String,
  domain: json['domain'] as String,
  higherIsBetter: json['higherIsBetter'] as bool,
  title: json['title'] as String,
  unit: json['unit'] as String,
);

Map<String, dynamic> _$InsightsCompareOptionsMetricsToJson(InsightsCompareOptionsMetrics instance) => <String, dynamic>{
  'code': instance.code,
  'describe': instance.describe,
  'domain': instance.domain,
  'higherIsBetter': instance.higherIsBetter,
  'title': instance.title,
  'unit': instance.unit,
};
