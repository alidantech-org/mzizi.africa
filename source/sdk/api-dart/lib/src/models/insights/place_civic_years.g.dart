// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_civic_years.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

InsightsPlaceCivicYears _$InsightsPlaceCivicYearsFromJson(Map<String, dynamic> json) => InsightsPlaceCivicYears(
  classes: (json['classes'] as List<dynamic>).map((e) => InsightsPlaceCivicYearsClasses.fromJson(e as Map<String, dynamic>)).toList(),
  total: (json['total'] as num).toDouble(),
  year: (json['year'] as num).toDouble(),
);

Map<String, dynamic> _$InsightsPlaceCivicYearsToJson(InsightsPlaceCivicYears instance) => <String, dynamic>{
  'classes': instance.classes,
  'total': instance.total,
  'year': instance.year,
};
