// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'ranking_screen.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

FrontendRankingScreen _$FrontendRankingScreenFromJson(Map<String, dynamic> json) => FrontendRankingScreen(
  indicator: SharedLocalizedText.fromJson(json['indicator'] as Map<String, dynamic>),
  language: json['language'] as String,
  rows: (json['rows'] as List<dynamic>).map((e) => FrontendRankRow.fromJson(e as Map<String, dynamic>)).toList(),
  unit: json['unit'] as String?,
  year: (json['year'] as num?)?.toInt(),
);

Map<String, dynamic> _$FrontendRankingScreenToJson(FrontendRankingScreen instance) => <String, dynamic>{
  'indicator': instance.indicator,
  'language': instance.language,
  'rows': instance.rows,
  'unit': ?instance.unit,
  'year': ?instance.year,
};
