// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'era_collection.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

HistoryEraCollection _$HistoryEraCollectionFromJson(Map<String, dynamic> json) =>
    HistoryEraCollection(eras: (json['eras'] as List<dynamic>).map((e) => HistoryEraEntry.fromJson(e as Map<String, dynamic>)).toList());

Map<String, dynamic> _$HistoryEraCollectionToJson(HistoryEraCollection instance) => <String, dynamic>{'eras': instance.eras};
