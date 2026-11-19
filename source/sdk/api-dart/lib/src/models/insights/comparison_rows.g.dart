// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'comparison_rows.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsComparisonRows _$InsightsComparisonRowsFromJson(Map<String, dynamic> json) => InsightsComparisonRows(
  a: (json['a'] as num).toDouble(),
  b: (json['b'] as num).toDouble(),
  code: json['code'] as String,
  diffPercent: (json['diffPercent'] as num?)?.toDouble(),
  higherIsBetter: json['higherIsBetter'] as bool,
  title: json['title'] as String,
  unit: json['unit'] as String,
);

Map<String, dynamic> _$InsightsComparisonRowsToJson(InsightsComparisonRows instance) => <String, dynamic>{
  'a': instance.a,
  'b': instance.b,
  'code': instance.code,
  'diffPercent': ?instance.diffPercent,
  'higherIsBetter': instance.higherIsBetter,
  'title': instance.title,
  'unit': instance.unit,
};
