// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_map_indicator.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsIndicatorMapIndicator _$InsightsIndicatorMapIndicatorFromJson(Map<String, dynamic> json) => InsightsIndicatorMapIndicator(
  code: json['code'] as String,
  higherIsBetter: json['higherIsBetter'] as bool?,
  name: json['name'] as String,
  unit: json['unit'] as String,
);

Map<String, dynamic> _$InsightsIndicatorMapIndicatorToJson(InsightsIndicatorMapIndicator instance) => <String, dynamic>{
  'code': instance.code,
  'higherIsBetter': ?instance.higherIsBetter,
  'name': instance.name,
  'unit': instance.unit,
};
