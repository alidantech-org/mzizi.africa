// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_series_points.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorSeriesPoints _$InsightsIndicatorSeriesPointsFromJson(Map<String, dynamic> json) => InsightsIndicatorSeriesPoints(
  estimated: json['estimated'] as bool,
  period: json['period'] as String,
  value: (json['value'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsIndicatorSeriesPointsToJson(InsightsIndicatorSeriesPoints instance) => <String, dynamic>{
  'estimated': instance.estimated,
  'period': instance.period,
  'value': instance.value,
};
