// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_series_indicator.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorSeriesIndicator _$InsightsIndicatorSeriesIndicatorFromJson(Map<String, dynamic> json) => InsightsIndicatorSeriesIndicator(
  code: json['code'] as String,
  description: json['description'] as String,
  higherIsBetter: json['higherIsBetter'] as bool?,
  name: json['name'] as String,
  unit: json['unit'] as String,
);

Map<String, dynamic> _$InsightsIndicatorSeriesIndicatorToJson(InsightsIndicatorSeriesIndicator instance) => <String, dynamic>{
  'code': instance.code,
  'description': instance.description,
  'higherIsBetter': ?instance.higherIsBetter,
  'name': instance.name,
  'unit': instance.unit,
};
