// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'figure_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

StatisticsFigureCollection _$StatisticsFigureCollectionFromJson(Map<String, dynamic> json) => StatisticsFigureCollection(
  figures: (json['figures'] as List<dynamic>).map((e) => StatisticsFigureEntry.fromJson(e as Map<String, dynamic>)).toList(),
);

Map<String, dynamic> _$StatisticsFigureCollectionToJson(StatisticsFigureCollection instance) => <String, dynamic>{'figures': instance.figures};
