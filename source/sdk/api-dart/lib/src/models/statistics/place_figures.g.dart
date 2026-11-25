// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'place_figures.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsPlaceFigures _$StatisticsPlaceFiguresFromJson(Map<String, dynamic> json) => StatisticsPlaceFigures(
  countryId: json['countryId'] as String,
  featureId: json['featureId'] as String,
  indicatorId: json['indicatorId'] as String?,
  limit: (json['limit'] as num?)?.toInt(),
  offset: (json['offset'] as num?)?.toInt(),
);

Map<String, dynamic> _$StatisticsPlaceFiguresToJson(StatisticsPlaceFigures instance) => <String, dynamic>{
  'countryId': instance.countryId,
  'featureId': instance.featureId,
  'indicatorId': ?instance.indicatorId,
  'limit': ?instance.limit,
  'offset': ?instance.offset,
};
