// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comparison.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsComparison _$InsightsComparisonFromJson(Map<String, dynamic> json) => InsightsComparison(
  a: json['a'],
  b: json['b'],
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  rows: json['rows'] as List<dynamic>,
);

Map<String, dynamic> _$InsightsComparisonToJson(InsightsComparison instance) => <String, dynamic>{
  'a': ?instance.a,
  'b': ?instance.b,
  'gaps': instance.gaps,
  'rows': instance.rows,
};
