// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorCollection _$StatisticsIndicatorCollectionFromJson(Map<String, dynamic> json) => StatisticsIndicatorCollection(
  indicators: (json['indicators'] as List<dynamic>).map((e) => StatisticsIndicatorEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$StatisticsIndicatorCollectionToJson(StatisticsIndicatorCollection instance) => <String, dynamic>{
  'indicators': instance.indicators,
};
