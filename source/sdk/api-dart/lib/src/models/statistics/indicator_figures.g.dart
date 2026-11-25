// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_figures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorFigures _$StatisticsIndicatorFiguresFromJson(Map<String, dynamic> json) => StatisticsIndicatorFigures(
  countryId: json['countryId'] as String,
  fromYear: (json['fromYear'] as num?)?.toInt(),
  indicatorId: json['indicatorId'] as String,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$StatisticsIndicatorFiguresToJson(StatisticsIndicatorFigures instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'fromYear': ?instance.fromYear,
  'indicatorId': instance.indicatorId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
