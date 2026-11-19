// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comparison.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsComparison _$InsightsComparisonFromJson(Map<String, dynamic> json) => InsightsComparison(
  a: InsightsComparisonA.fromJson(json['a'] as Map<String, dynamic>),
  b: InsightsComparisonB.fromJson(json['b'] as Map<String, dynamic>),
  gaps: (json['gaps'] as List<dynamic>).map((e) => e as String).toList(),
  rows: (json['rows'] as List<dynamic>).map((e) => InsightsComparisonRows.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$InsightsComparisonToJson(InsightsComparison instance) => <String, dynamic>{
  'a': instance.a,
  'b': instance.b,
  'gaps': instance.gaps,
  'rows': instance.rows,
};
