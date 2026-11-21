// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comparison_at_input.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsComparisonAtInput _$InsightsComparisonAtInputFromJson(Map<String, dynamic> json) => InsightsComparisonAtInput(
  a: json['a'] as String,
  b: json['b'] as String,
  countryCode: json['countryCode'] as String,
  languageCode: json['languageCode'] as String?,
  metrics: json['metrics'] as String?,
);

Map<String, dynamic> _$InsightsComparisonAtInputToJson(InsightsComparisonAtInput instance) => <String, dynamic>{
  'a': instance.a,
  'b': instance.b,
  'countryCode': instance.countryCode,
  'languageCode': ?instance.languageCode,
  'metrics': ?instance.metrics,
};
