// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_series.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorSeries _$InsightsIndicatorSeriesFromJson(Map<String, dynamic> json) => InsightsIndicatorSeries(
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  indicator: InsightsIndicatorSeriesIndicator.fromJson(json['indicator'] as Map<String, dynamic>),
  place: InsightsPlaceCrumb.fromJson(json['place'] as Map<String, dynamic>),
  points: (json['points'] as List<dynamic>).map((e) => InsightsIndicatorSeriesPoints.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsIndicatorSeriesToJson(InsightsIndicatorSeries instance) => <String, dynamic>{
  'gaps': instance.gaps,
  'indicator': instance.indicator,
  'place': instance.place,
  'points': instance.points,
};
