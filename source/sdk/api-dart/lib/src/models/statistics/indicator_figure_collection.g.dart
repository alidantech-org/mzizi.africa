// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'indicator_figure_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsIndicatorFigureCollection _$StatisticsIndicatorFigureCollectionFromJson(Map<String, dynamic> json) =>
    StatisticsIndicatorFigureCollection(
      figures: (json['figures'] as List<dynamic>).map((e) => StatisticsIndicatorFigureEntry.fromJson(e as Map<String, dynamic>)).toList(),
    );

Map<String, dynamic> _$StatisticsIndicatorFigureCollectionToJson(StatisticsIndicatorFigureCollection instance) => <String, dynamic>{
  'figures': instance.figures,
};
